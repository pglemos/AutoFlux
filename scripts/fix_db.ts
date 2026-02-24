import postgres from 'postgres'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env') })

const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL
if (!connectionString) {
    console.error('Error: POSTGRES_URL not found in .env')
    process.exit(1)
}

const sql = postgres(connectionString, { ssl: 'require' })

async function fixDatabase() {
    console.log('Fixing database schema...')

    try {
        // 1. Create the table
        await sql.unsafe(`
            CREATE TABLE IF NOT EXISTS communication_configs (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
                type TEXT NOT NULL,
                is_active BOOLEAN DEFAULT FALSE,
                time_to_trigger TEXT,
                days_of_week TEXT[],
                target_roles TEXT[],
                custom_message TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
        `)
        console.log('Table communication_configs created or already exists.')

        // 2. Enable RLS
        await sql.unsafe(`ALTER TABLE communication_configs ENABLE ROW LEVEL SECURITY;`)
        console.log('RLS enabled for communication_configs.')

        // 3. Create Policy
        await sql.unsafe(`
            DROP POLICY IF EXISTS "Users can manage their agency configs" ON communication_configs;
            CREATE POLICY "Users can manage their agency configs" ON communication_configs
                FOR ALL
                USING (auth.role() = 'authenticated');
        `)
        console.log('RLS policies created.')

        // 4. Create trigger for updated_at if function exists
        await sql.unsafe(`
            DO $$
            BEGIN
                IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
                    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_comm_configs_updated_at') THEN
                        CREATE TRIGGER update_comm_configs_updated_at
                            BEFORE UPDATE ON communication_configs
                            FOR EACH ROW
                            EXECUTE PROCEDURE update_updated_at_column();
                    END IF;
                END IF;
            END $$;
        `)
        console.log('Trigger created.')

    } catch (error: any) {
        console.error('Error during database fix:', error.message)
    } finally {
        await sql.end()
    }
}

fixDatabase()
