const postgres = require('postgres');

const connectionString = 'postgresql://postgres.fbhcmzzgwjdgkctlfvbo:Guigui1309%40@aws-0-sa-east-1.pooler.supabase.com:6543/postgres';
const sql = postgres(connectionString);

async function runSQL() {
    try {
        console.log("Connecting to DB directly...");
        
        await sql`
            DO $$
            BEGIN
              DROP POLICY IF EXISTS "Allow read access for all" ON public.agencies;
              CREATE POLICY "Allow read access for all" ON public.agencies FOR SELECT USING (true);
              
              DROP POLICY IF EXISTS "Allow read access for all" ON public.team;
              CREATE POLICY "Allow read access for all" ON public.team FOR SELECT USING (true);
              
              DROP POLICY IF EXISTS "Allow read access for all" ON public.goals;
              CREATE POLICY "Allow read access for all" ON public.goals FOR SELECT USING (true);
              
              DROP POLICY IF EXISTS "Allow read access for all" ON public.commissions;
              CREATE POLICY "Allow read access for all" ON public.commissions FOR SELECT USING (true);
              
              DROP POLICY IF EXISTS "Allow read access for all" ON public.daily_lead_volumes;
              CREATE POLICY "Allow read access for all" ON public.daily_lead_volumes FOR SELECT USING (true);
            END $$;
        `;
        console.log("RLS policies added successfully. Checking current counts.");
        
        const teams = await sql`SELECT count(*) from public.team`;
        console.log("Teams in DB:", teams[0].count);

    } catch (e) {
        console.error("Error setting RLS policies:", e);
    } finally {
        await sql.end();
    }
}
runSQL();
