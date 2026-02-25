require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const { createClient } = require('@supabase/supabase-js');
const cron = require('node-cron');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

let qrCodeData = '';
let qrImage = '';
let isConnected = false;

console.log('Starting WhatsApp Client...');
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', async (qr) => {
    console.log('QR RECEIVED - Displaying in frontend');
    qrCodeData = qr;
    try {
        qrImage = await qrcode.toDataURL(qr);
    } catch (err) {
        console.error('Failed to generate QR string', err);
    }
});

client.on('ready', () => {
    console.log('WhatsApp Client is ready!');
    isConnected = true;
    qrCodeData = '';
});

client.on('disconnected', (reason) => {
    console.log('Client was disconnected', reason);
    isConnected = false;
});

client.initialize();

// API Routes for Frontend Integration
app.get('/api/whatsapp/status', (req, res) => {
    res.json({
        connected: isConnected,
        qr: isConnected ? null : qrImage
    });
});

app.post('/api/whatsapp/restart', async (req, res) => {
    console.log('Restarting WhatsApp Client...');
    try {
        if (client) {
            await client.destroy();
        }
        isConnected = false;
        qrImage = '';
        client.initialize();
        res.json({ success: true, message: 'Client restart initiated' });
    } catch (error) {
        console.error('Failed to restart client:', error);
        res.status(500).json({ error: 'Failed to restart client' });
    }
});

app.post('/api/whatsapp/send', async (req, res) => {
    if (!isConnected) {
        return res.status(400).json({ error: 'WhatsApp is not connected. Scan the QR code first.' });
    }

    const { phone, message } = req.body;
    if (!phone || !message) {
        return res.status(400).json({ error: 'Phone and message are required' });
    }

    try {
        const cleanPhone = phone.replace(/\D/g, '');
        // Append Brazil country code if not present and only 10/11 digits
        const finalPhone = cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone;
        const chatId = `${finalPhone}@c.us`;

        await client.sendMessage(chatId, message);
        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Failed to send message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`WhatsApp Service listening on port ${PORT}`);
});

// CRON JOB: Daily closing report at 18:00
cron.schedule('0 18 * * *', async () => {
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

            await Promise.all(users.map(async (user) => {
                // In a real scenario, you would have the user's phone number in the 'team' table
                // For this MVP automation, we assume we want to log it or if there was a phone field
                if (user.phone) {
                    const message = config.custom_message || `Olá ${user.name},\nAqui está o seu relatório diário de fechamento da agência. Tivemos um ótimo dia de vendas!`;

                    const cleanPhone = user.phone.replace(/\D/g, '');
                    const finalPhone = cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone;
                    await client.sendMessage(`${finalPhone}@c.us`, message);
                }
            }));
        }
    } catch (err) {
        console.error('Error in daily report cron:', err);
    }
});
