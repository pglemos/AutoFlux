require('dotenv').config();
const { Client } = require('pg');

const rawUrl = process.env.POSTGRES_URL_NON_POOLING || '';
const DATABASE_URL = rawUrl.split('?')[0];

async function fixRLS() {
    const client = new Client({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log("Connecting to Postgres...");
        await client.connect();

        const queries = [
            `ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;`,
            `DROP POLICY IF EXISTS "Allow read access for all" ON public.agencies;`,
            `CREATE POLICY "Allow read access for all" ON public.agencies FOR SELECT USING (true);`,

            `ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;`,
            `DROP POLICY IF EXISTS "Allow read access for all" ON public.team;`,
            `CREATE POLICY "Allow read access for all" ON public.team FOR SELECT USING (true);`,

            `ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;`,
            `DROP POLICY IF EXISTS "Allow read access for all" ON public.goals;`,
            `CREATE POLICY "Allow read access for all" ON public.goals FOR SELECT USING (true);`,

            `ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;`,
            `DROP POLICY IF EXISTS "Allow read access for all" ON public.commissions;`,
            `CREATE POLICY "Allow read access for all" ON public.commissions FOR SELECT USING (true);`,

            `ALTER TABLE public.daily_lead_volumes ENABLE ROW LEVEL SECURITY;`,
            `DROP POLICY IF EXISTS "Allow read access for all" ON public.daily_lead_volumes;`,
            `CREATE POLICY "Allow read access for all" ON public.daily_lead_volumes FOR SELECT USING (true);`,

            `ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;`,
            `DROP POLICY IF EXISTS "Allow read access for all" ON public.leads;`,
            `CREATE POLICY "Allow read access for all" ON public.leads FOR SELECT USING (true);`
        ];

        for (const q of queries) {
            console.log(`Executing: ${q}`);
            await client.query(q);
        }

        console.log("All RLS policies successfully updated.");
    } catch (e) {
        console.error("Error updating RLS:", e);
    } finally {
        await client.end();
    }
}

fixRLS();

async function fixMoreRLS() {
    const rawUrl = process.env.POSTGRES_URL_NON_POOLING || '';
    const DATABASE_URL = rawUrl.split('?')[0];
    const client = new Client({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const queries = [
            `ALTER TABLE public.commission_rules ENABLE ROW LEVEL SECURITY;`,
            `DROP POLICY IF EXISTS "Allow read access for all" ON public.commission_rules;`,
            `CREATE POLICY "Allow read access for all" ON public.commission_rules FOR SELECT USING (true);`
        ];
        for (const q of queries) {
            await client.query(q);
        }
        console.log("Commission rules RLS fixed.");
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await client.end();
    }
}
fixMoreRLS();
