require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data: agencies, error: e1 } = await supabase.from('agencies').select('id, name');
    const { data: team, error: e2 } = await supabase.from('team').select('id, name, role, agency_id');
    const { data: comms, error: e3 } = await supabase.from('commissions').select('id');
    
    console.log(`Agencies count: ${agencies?.length || 0}`);
    if (agencies?.length > 0) console.log(agencies.slice(0, 3));
    
    console.log(`Team count: ${team?.length || 0}`);
    if (team?.length > 0) console.log(team.slice(0, 3));
    
    console.log(`Commissions count: ${comms?.length || 0}`);
    
    if (e1 || e2 || e3) console.error("Errors:", {e1, e2, e3});
}

check();
