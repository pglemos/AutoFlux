require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
   console.log('Fetching auth user...');
   const { data: { users }, error } = await supabase.auth.admin.listUsers();
   const authAdmin = users?.find(u => u.email === 'admin@autogestao.com.br');

   if (!authAdmin) {
      console.log('No auth user found for admin@autogestao.com.br');
      return;
   }

   console.log('Auth Admin ID:', authAdmin.id);

   // Attach to an arbitrary agency to satisfy foreign key (or leave null if not required)
   const { data: agencies } = await supabase.from('agencies').select('id').limit(1);
   const agencyId = agencies?.[0]?.id || null;

   // Insert team row
   const { data, error: insertError } = await supabase.from('team').upsert({
      id: authAdmin.id,
      name: 'Pedro Costa (Admin)',
      role: 'Admin',
      agency_id: agencyId,
      conversion: 0,
      execution: 0,
      sales: 0
   }).select();

   if (insertError) {
      console.log('Insert Error:', insertError);
   } else {
      console.log('Successfully upserted Admin team member:', data);
   }
}
run();
