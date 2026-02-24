import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env file
dotenv.config({ path: resolve(process.cwd(), '.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Error: VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found in .env')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function createAdmin() {
    const email = 'admin@autogestao.com.br'
    const password = 'Jose20161@'
    const name = 'Admin AutoGestão'

    console.log(`Creating user ${email}...`)

    // 1. Create user in Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
    })

    if (authError) {
        if (authError.message.includes('already registered')) {
            console.log('User already exists in Auth. Checking team table...')
            // If user exists, we need to find their ID
            const { data: userData } = await supabase.auth.admin.listUsers()
            const existingUser = userData?.users.find((u: any) => u.email === email)
            if (existingUser) {
                await ensureTeamRecord(existingUser.id, name)
            }
        } else {
            console.error('Error creating auth user:', authError.message)
        }
        return
    }

    if (authData.user) {
        console.log('Auth user created successfully with ID:', authData.user.id)
        await ensureTeamRecord(authData.user.id, name)
    }
}

async function ensureTeamRecord(userId: string, name: string) {
    console.log(`Ensuring team record for ${userId}...`)

    // 2. Add to team table
    const { data: teamData, error: teamError } = await supabase
        .from('team')
        .upsert({
            id: userId,
            name: name,
            role: 'Admin',
            conversion: 0,
            execution: 100,
            sales: 0,
            avatar: 'admin'
        })
        .select()

    if (teamError) {
        console.error('Error creating team record:', teamError.message)
    } else {
        console.log('Team record created/updated successfully:', teamData)
    }
}

createAdmin().catch(console.error)
