require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function inspect() {
    const { data: vol } = await supabase.from('daily_volume').select('*').limit(3);
    console.log("Daily Volume:", vol);
}
inspect();
