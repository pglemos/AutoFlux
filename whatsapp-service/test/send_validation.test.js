import { describe, it, expect, mock } from 'bun:test';
import request from 'supertest';

// Set environment variables required by index.js
process.env.VITE_SUPABASE_URL = 'http://localhost:54321';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE2NTg1NDI2LCJleHAiOjE5MzIxNjE0MjZ9.ThisIsADummyKeyThatIsLongEnoughToLookLikeAJWTTokenButItIsNotRealOne';
process.env.VITE_SUPABASE_ANON_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Attempt to mock Supabase just in case
mock.module('@supabase/supabase-js', () => ({
    createClient: () => ({
        from: () => ({
            select: () => ({
                eq: () => ({
                    eq: () => ({ data: [] })
                })
            })
        })
    })
}));

// Import the app and client after setting env vars
const { app, client } = require('../index.js');

describe('POST /api/whatsapp/send', () => {

    it('should return 400 if phone is missing', async () => {
        // Simulate connected state
        client.emit('ready');

        const res = await request(app)
            .post('/api/whatsapp/send')
            .send({ message: 'Hello' });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Phone and message are required');
    });

    it('should return 400 if message is missing', async () => {
        // Simulate connected state
        client.emit('ready');

        const res = await request(app)
            .post('/api/whatsapp/send')
            .send({ phone: '1234567890' });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Phone and message are required');
    });

    it('should return 400 if WhatsApp is not connected', async () => {
        // Simulate disconnected state
        client.emit('disconnected', 'Testing disconnect');

        const res = await request(app)
            .post('/api/whatsapp/send')
            .send({ phone: '1234567890', message: 'Hello' });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain('not connected');
    });
});
