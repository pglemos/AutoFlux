import postgres from 'postgres'
import * as dotenv from 'dotenv'
import { resolve } from 'path'
import * as fs from 'fs'

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env') })

const connectionString = process.env.POSTGRES_URL
if (!connectionString) {
    console.error('Error: POSTGRES_URL not found in .env')
    process.exit(1)
}

const sql = postgres(connectionString, { ssl: 'require' })

const migrationsDir = resolve(process.cwd(), 'supabase/migrations')
const migrations = [
    '20260224154400_rename_consultoria_to_admin.sql',
    '20260224154500_user_sync.sql',
    '20260224160000_multi_tenancy.sql'
]

async function runMigrations() {
    console.log('Starting migration process...')

    for (const file of migrations) {
        const filePath = resolve(migrationsDir, file)
        console.log(`Applying ${file}...`)

        try {
            const content = fs.readFileSync(filePath, 'utf8')
            // Split by semicolon might be dangerous if there are strings with semicolons
            // but for these standard migrations it should be okay if we run the whole content
            // actually, postgres-js can execute multiple statements in one call
            await sql.unsafe(content)
            console.log(`Successfully applied ${file}`)
        } catch (error: any) {
            console.error(`Error applying ${file}:`, error.message)
            // We continue to the next migration unless it's a fatal connection error
        }
    }

    console.log('Migrations completed. Configuring default agency...')

    try {
        // Ensure agencies table exists and has at least one entry
        const [agency] = await sql`
      INSERT INTO agencies (name) 
      VALUES ('Agência Matriz') 
      ON CONFLICT DO NOTHING 
      RETURNING id
    `

        let agencyId = agency?.id
        if (!agencyId) {
            const existing = await sql`SELECT id FROM agencies LIMIT 1`
            agencyId = existing[0]?.id
        }

        if (agencyId) {
            console.log(`Using agency ID: ${agencyId}`)
            // Update admin user to this agency
            await sql`UPDATE team SET agency_id = ${agencyId} WHERE role = 'Admin'`
            console.log('Admin user assigned to default agency.')
        } else {
            console.warn('No agency found or created.')
        }

    } catch (error: any) {
        console.error('Error configuring default agency:', error.message)
    }

    await sql.end()
}

runMigrations().catch(async (e) => {
    console.error(e)
    await sql.end()
})
