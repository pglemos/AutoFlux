const postgres = require('postgres');
require('dotenv').config();

const connectionString = 'postgresql://postgres.fbhcmzzgwjdgkctlfvbo:Guigui1309%40@aws-0-sa-east-1.pooler.supabase.com:6543/postgres';
const sql = postgres(connectionString);

async function verify() {
    try {
        const team = await sql`SELECT * FROM public.team WHERE role = 'Admin'`;
        console.log("Team records with 'Admin' role:", team);
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await sql.end();
    }
}
verify();
