require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: teamUser, error: teamErr } = await supabase.from('team').select('*').eq('email', 'admin@autogestao.com.br').maybeSingle();
  console.log('Team User:', teamUser);
  const { data: sysUser, error: sysErr } = await supabase.from('users').select('*').eq('email', 'admin@autogestao.com.br').maybeSingle();
  console.log('System User:', sysUser);
}
run();
