const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function createAdminUser() {
    try {
        console.log("Checking if admin@admin.com exists...");
        const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();

        let adminExists = false;
        if (!usersError && usersData?.users) {
            adminExists = usersData.users.some(u => u.email === 'admin@admin.com');
        }

        if (adminExists) {
            console.log("admin@admin.com already exists. Updating password...");
            const adminUser = usersData.users.find(u => u.email === 'admin@admin.com');
            const { error: updateError } = await supabase.auth.admin.updateUserById(
                adminUser.id,
                { password: 'admin', email_confirm: true }
            );
            if (updateError) throw updateError;
            console.log("Password updated successfully.");

            // Set role in team table
            await supabase.from('team').update({ role: 'Admin' }).eq('email', 'admin@admin.com');

        } else {
            console.log("Creating admin@admin.com...");
            const { data, error } = await supabase.auth.admin.createUser({
                email: 'admin@admin.com',
                password: 'admin',
                email_confirm: true
            });
            if (error) throw error;
            console.log("User created:", data.user.id);

            // Insert into team
            await supabase.from('team').insert([{
                id: data.user.id,
                name: 'Admin Test',
                email: 'admin@admin.com',
                role: 'Admin',
                status: 'Ativo'
            }]);
            console.log("User added to team table with Admin role.");
        }
        console.log("Done.");
    } catch (e) {
        console.error("Error creating user:", e.message);
    }
}

createAdminUser();
