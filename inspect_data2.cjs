require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function inspect() {
    const { data: leads } = await supabase.from('leads').select('*').limit(3);
    console.log("Leads:", leads);
    
    const { data: goals } = await supabase.from('goals').select('*').limit(3);
    console.log("Goals:", goals);
}
inspect();
