const runDailyReport = async (client, supabase, isConnected) => {
    if (!isConnected) return;
    console.log('Running daily report cron...');

    try {
        // Fetch active daily report configurations
        const { data: configs, error } = await supabase
            .from('communication_configs')
            .select('*')
            .eq('type', 'daily_report')
            .eq('is_active', true);

        if (error || !configs || configs.length === 0) return;

        for (const config of configs) {
            // Fetch users with target roles for this agency
            const { data: users } = await supabase
                .from('team')
                .select('*')
                // Note: Normally joined with agency, simplifying here
                .in('role', config.target_roles || ['Manager', 'Owner']);

            if (!users) continue;

            for (const user of users) {
                // In a real scenario, you would have the user's phone number in the 'team' table
                // For this MVP automation, we assume we want to log it or if there was a phone field
                if (user.phone) {
                    const message = config.custom_message || `Olá ${user.name},\nAqui está o seu relatório diário de fechamento da agência. Tivemos um ótimo dia de vendas!`;

                    const cleanPhone = user.phone.replace(/\D/g, '');
                    const finalPhone = cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone;
                    await client.sendMessage(`${finalPhone}@c.us`, message);
                }
            }
        }
    } catch (err) {
        console.error('Error in daily report cron:', err);
    }
};

module.exports = { runDailyReport };
