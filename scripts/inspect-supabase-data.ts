import 'dotenv/config';
import postgres from 'postgres';

const {
  POSTGRES_URL,
} = process.env;

if (!POSTGRES_URL) {
  console.error('❌ POSTGRES_URL is missing in .env');
  process.exit(1);
}

const sql = postgres(POSTGRES_URL);

async function inspectData() {
  console.log('--- Inspecting Supabase Data ---');

  try {
    // 1. List all tables in public schema
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

    if (tables.length === 0) {
      console.log('⚠️ No public tables found.');
      return;
    }

    console.log(`Found ${tables.length} tables in public schema:`);
    tables.forEach(t => console.log(` - ${t.table_name}`));

    console.log('\n--- Sample Data ---');

    for (const table of tables) {
      const tableName = table.table_name;

      // Get count
      const countResult = await sql`SELECT count(*) FROM ${sql(tableName)}`;
      const count = countResult[0].count;

      console.log(`\nTable: ${tableName} (Rows: ${count})`);

      if (parseInt(count) > 0) {
        // Get first 3 rows
        const rows = await sql`SELECT * FROM ${sql(tableName)} LIMIT 3`;
        console.table(rows);
      } else {
        console.log('  (Empty)');
      }
    }

  } catch (error) {
    console.error('❌ Error inspecting data:', error);
  } finally {
    await sql.end();
  }
}

inspectData();
