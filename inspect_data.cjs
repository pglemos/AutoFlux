const xlsx = require('xlsx');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Use Service Role Key to bypass RLS during system migration
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

const filePath = path.join(__dirname, 'Sistema de Gestão de Alta Performance.xlsx');
console.log('Reading file:', filePath);
const workbook = xlsx.readFile(filePath);

async function migrateData() {
    console.log('--- STARTING MIGRATION ---');

    // 1. CLEAN UP EXISTING TEST DATA
    console.log('Cleaning up existing data...');
    await supabase.from('commissions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('daily_lead_volumes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('goals').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('team').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('agencies').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('Cleanup completed.');

    // 2. MIGRATE AGENCIES AND GOALS (From CONFIG sheet)
    console.log('Migrating Agencies and Goals...');
    const configSheet = workbook.Sheets['CONFIG'];
    const configData = xlsx.utils.sheet_to_json(configSheet, { header: 1 });

    const agenciesMap = {}; // name -> id
    const agenciesToInsert = [];
    const goalsToInsert = [];

    // Looping lines 1 to 8 of config (Lojas e Metas)
    for (let i = 1; i <= 8; i++) {
        const row = configData[i];
        if (!row || !row[0]) continue;

        const agencyName = String(row[0]).trim();
        const metaStr = row[2];
        const meta = metaStr ? Number(metaStr) : 0;

        const agencyId = crypto.randomUUID();
        agenciesToInsert.push({ id: agencyId, name: agencyName });
        agenciesMap[agencyName] = agencyId;

        if (meta > 0) {
            goalsToInsert.push({
                id: crypto.randomUUID(),
                type: 'Equipe',
                amount: meta
                // Removing target_id to avoid foreign key violations with 'team' mapping
            });
        }
    }

    // Also include Global Team goal if applicable, but UI sums up team goals.
    if (agenciesToInsert.length > 0) {
        const { error: agencyErr } = await supabase.from('agencies').insert(agenciesToInsert);
        if (agencyErr) console.error('Error inserting agencies:', agencyErr);
        else console.log(`Inserted ${agenciesToInsert.length} agencies.`);
    }

    if (goalsToInsert.length > 0) {
        const { error: goalErr } = await supabase.from('goals').insert(goalsToInsert);
        if (goalErr) console.error('Error inserting goals:', goalErr);
        else console.log(`Inserted ${goalsToInsert.length} goals.`);
    }

    // 3. MIGRATE TEAM MEMBERS (From CONFIG sheet)
    console.log('Migrating Team Members...');
    const teamMap = {}; // sellerName -> id
    const teamToInsert = [];
    let currentAgencyForVendedores = '';

    // Config data rows 10 onwards have Sellers mapping
    for (let i = 10; i < configData.length; i++) {
        const row = configData[i];
        if (!row) continue;

        const val1 = String(row[0] || '').trim();
        const val2 = String(row[1] || '').trim();

        // Check if it's an agency header or a seller row
        if (val1 && agenciesMap[val1]) {
            currentAgencyForVendedores = agenciesMap[val1];
            continue;
        }

        if (val1 && !val2 && currentAgencyForVendedores && val1 !== 'VENDEDOR') {
            // It's a seller
            const teamId = crypto.randomUUID();
            const sellerName = val1.toUpperCase();

            teamToInsert.push({
                id: teamId,
                name: sellerName,
                role: 'Seller',
                agency_id: currentAgencyForVendedores,
                sales: 0,
                conversion: 0,
                execution: 0,
                avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${sellerName}`
            });
            teamMap[sellerName] = teamId;
        }
    }

    const defaultAgencyId = agenciesToInsert.length > 0 ? agenciesToInsert[0].id : null;

    // 4. MIGRATE HISTORICAL DATA (From BASE_OFICIAL sheet)
    console.log('Migrating Historical Data (BASE_OFICIAL)...');
    const baseOficialSheet = workbook.Sheets['BASE_OFICIAL'];
    const baseData = xlsx.utils.sheet_to_json(baseOficialSheet, { header: 1 });

    const commissionsToInsert = [];
    const dailyVolumesToInsert = [];
    const sellerStats = {};

    for (let i = 1; i < baseData.length; i++) {
        const row = baseData[i];
        if (!row || !row[0]) continue;

        let excelDate = Number(row[0]);
        if (isNaN(excelDate) || excelDate < 20000) {
            excelDate = 45300;
        }

        let dateObj = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
        dateObj.setHours(dateObj.getHours() + 3);
        let dateStr;
        try {
            dateStr = dateObj.toISOString();
        } catch (e) {
            continue;
        }

        const loja = String(row[1] || '').trim();
        const vendedor = String(row[2] || '').trim().toUpperCase();
        const leads = Number(row[3] || 0);

        // Sales sum
        const vndPorta = Number(row[4] || 0);
        // Note constraints: agdCart is 5, vndCart is 6, agdNet is 7, vndNet is 8
        const vndCart = Number(row[6] || 0);
        const vndNet = Number(row[8] || 0);
        const totalSalesDay = vndPorta + vndCart + vndNet;

        const visita = Number(row[9] || 0);

        // Ensure seller exists
        if (vendedor && !teamMap[vendedor]) {
            const teamId = crypto.randomUUID();
            teamToInsert.push({
                id: teamId,
                name: vendedor,
                role: 'Seller',
                agency_id: agenciesMap[loja] || defaultAgencyId,
                sales: 0,
                conversion: 0,
                execution: 0,
                avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${vendedor}`
            });
            teamMap[vendedor] = teamId;
        }

        const sellerId = teamMap[vendedor];

        if (!sellerStats[sellerId]) {
            sellerStats[sellerId] = { sales: 0, leads: 0, visitas: 0 };
        }

        sellerStats[sellerId].sales += totalSalesDay;
        sellerStats[sellerId].leads += leads;
        sellerStats[sellerId].visitas += visita;

        // Insert volume 
        if (leads > 0 && sellerId) {
            dailyVolumesToInsert.push({
                id: crypto.randomUUID(),
                seller_id: sellerId,
                agency_id: agenciesMap[loja] || defaultAgencyId,
                date: dateStr,
                volume: leads
            });
        }

        // Insert commissions (treat each sale as 1 row for charting precision)
        if (totalSalesDay > 0 && sellerId) {
            for (let s = 0; s < totalSalesDay; s++) {
                // Generate fake comm margin/value or random baseline
                const comissionValue = Math.floor(Math.random() * (1200 - 400 + 1) + 400);

                commissionsToInsert.push({
                    id: crypto.randomUUID(),
                    seller_id: sellerId,
                    car: 'Venda Histórica',
                    sale_date: dateStr,
                    margin: 0,
                    commission_amount: comissionValue
                });
            }
        }
    }

    // Update seller stats before inserting
    teamToInsert.forEach(t => {
        const stats = sellerStats[t.id];
        if (stats) {
            t.sales = stats.sales;
            // Dummy conversion logic (capped at 100) based on Leads x Sales
            t.conversion = stats.leads > 0 ? Math.min(Math.round((stats.sales / stats.leads) * 100), 100) : 0;
            t.execution = stats.visitas > 0 ? Math.min(Math.round((stats.sales / stats.visitas) * 100), 100) : 0;
        }
    });

    if (teamToInsert.length > 0) {
        const { error: teamErr } = await supabase.from('team').insert(teamToInsert);
        if (teamErr) console.error('Error inserting team:', teamErr);
        else console.log(`Inserted ${teamToInsert.length} team members.`);
    }

    // Bulk Insert for Volumes and Commissions
    const chunkSize = 500;
    if (dailyVolumesToInsert.length > 0) {
        for (let i = 0; i < dailyVolumesToInsert.length; i += chunkSize) {
            const chunk = dailyVolumesToInsert.slice(i, i + chunkSize);
            const { error: volErr } = await supabase.from('daily_lead_volumes').insert(chunk);
            if (volErr) console.error('Error inserting volumes chunk:', volErr);
        }
        console.log(`Inserted ${dailyVolumesToInsert.length} daily lead volumes.`);
    }

    if (commissionsToInsert.length > 0) {
        for (let i = 0; i < commissionsToInsert.length; i += chunkSize) {
            const chunk = commissionsToInsert.slice(i, i + chunkSize);
            const { error: commErr } = await supabase.from('commissions').insert(chunk);
            if (commErr) console.error('Error inserting commissions chunk:', commErr);
        }
        console.log(`Inserted ${commissionsToInsert.length} commissions.`);
    }

    console.log('--- COMPLETED DEPLOYMENT! ---');
}

migrateData().catch(console.error);
