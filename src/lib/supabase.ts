import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export function checkSupabaseCredentials(url: string | undefined, key: string | undefined) {
    if (!url || !key) {
        console.warn('Supabase credentials missing. Check your .env file.')
    }
}

// Perform the check immediately on load
checkSupabaseCredentials(supabaseUrl, supabaseAnonKey);

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
