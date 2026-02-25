require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const { createClient } = require('@supabase/supabase-js');
const cron = require('node-cron');
const { runDailyReport } = require('./cron-jobs');

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

console.log('Starting WhatsApp Client with optimized configuration...');
const client = new Client({
    authStrategy: new LocalAuth(),
    webVersion: '2.3000.1014559863', // Forcing a very modern version to bypass "outdated" error
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-js/main/dist/wppconnect-wa.js',
    },
    puppeteer: {
        headless: true,
        handleSIGINT: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--use-gl=disabled',
            '--disable-setuid-sandbox',
            '--no-sandbox'
        ],
    },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
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

// Authentication Middleware
const authenticate = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!process.env.VITE_WHATSAPP_API_KEY || apiKey !== process.env.VITE_WHATSAPP_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

// API Routes for Frontend Integration
app.get('/api/whatsapp/status', authenticate, (req, res) => {
    res.json({
        connected: isConnected,
        qr: isConnected ? null : qrImage
    });
});

app.post('/api/whatsapp/restart', authenticate, async (req, res) => {
    console.log('Restarting WhatsApp Client...');
    try {
        if (client) {
            try {
                await client.destroy();
            } catch (e) {
                console.log('Error destroying client, continuing anyway:', e.message);
            }
        }

        // Clean session files
        const fs = require('fs');
        const path = require('path');
        const authPath = path.join(__dirname, '.wwebjs_auth');
        const cachePath = path.join(__dirname, '.wwebjs_cache');

        if (fs.existsSync(authPath)) fs.rmSync(authPath, { recursive: true, force: true });
        if (fs.existsSync(cachePath)) fs.rmSync(cachePath, { recursive: true, force: true });

        isConnected = false;
        qrImage = '';
        qrCodeData = '';

        // Give it a second before re-initializing
        setTimeout(() => {
            client.initialize();
        }, 1000);

        res.json({ success: true, message: 'Client reset and restart initiated' });
    } catch (error) {
        console.error('Failed to restart client:', error);
        res.status(500).json({ error: 'Failed to restart client' });
    }
});

app.post('/api/whatsapp/send', authenticate, async (req, res) => {
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

const startServer = () => {
    client.initialize();

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
    });
};

if (require.main === module) {
    startServer();
}

module.exports = { app, client, startServer };
