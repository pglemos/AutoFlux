import { describe, test, expect, mock, beforeAll } from "bun:test";
import request from "supertest";

// Mock event handlers to simulate events
const eventHandlers = {};

const mockClient = {
    on: (event, cb) => {
        eventHandlers[event] = cb;
    },
    initialize: () => {},
    sendMessage: mock(() => Promise.resolve()),
    destroy: mock(() => Promise.resolve()),
};

// Mock whatsapp-web.js
mock.module("whatsapp-web.js", () => {
    return {
        Client: class {
            constructor() {
                return mockClient;
            }
        },
        LocalAuth: class {}
    };
});

// Mock qrcode
mock.module("qrcode", () => {
    return {
        toDataURL: () => Promise.resolve("data:image/png;base64,mockqr")
    };
});

// Mock supabase
mock.module("@supabase/supabase-js", () => {
    return {
        createClient: () => ({
            from: () => ({
                select: () => ({
                    eq: () => ({
                        eq: () => Promise.resolve({ data: [], error: null })
                    })
                })
            })
        })
    };
});

// Set env vars to prevent Supabase client creation error if mock fails (fallback)
process.env.VITE_SUPABASE_URL = "https://example.com";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-key";
process.env.VITE_SUPABASE_ANON_KEY = "test-key";

// Import app after mocks
// Use require to ensure we get the CommonJS export
const { app } = require("../index.js");

describe("POST /api/whatsapp/send", () => {
    test("should return 400 if not connected", async () => {
        // Ensure disconnected state (simulate disconnected event if needed, or rely on initial state)
        // Initial state isConnected = false.
        // If previous tests ran, we might need to reset.
        // Since tests run in parallel or sequence, better to force disconnect.
        if (eventHandlers['disconnected']) eventHandlers['disconnected']('test reset');

        const response = await request(app)
            .post("/api/whatsapp/send")
            .send({ phone: "1234567890", message: "Hello" });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain("WhatsApp is not connected");
    });

    test("should return 400 if phone or message is missing", async () => {
        // Simulate connection
        if (eventHandlers['ready']) eventHandlers['ready']();

        const response1 = await request(app)
            .post("/api/whatsapp/send")
            .send({ phone: "1234567890" });

        expect(response1.status).toBe(400);
        expect(response1.body.error).toContain("Phone and message are required");

        const response2 = await request(app)
            .post("/api/whatsapp/send")
            .send({ message: "Hello" });

        expect(response2.status).toBe(400);
    });

    test("should send message if connected and valid data", async () => {
        // Simulate connection
        if (eventHandlers['ready']) eventHandlers['ready']();

        const phone = "11999999999";
        const message = "Hello World";

        const response = await request(app)
            .post("/api/whatsapp/send")
            .send({ phone, message });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        // Verify mock call
        expect(mockClient.sendMessage).toHaveBeenCalled();
        const calls = mockClient.sendMessage.mock.calls;
        const lastCall = calls[calls.length - 1];

        // cleanPhone = 11999999999 (11 digits) -> adds 55 prefix -> 5511999999999
        expect(lastCall[0]).toBe("5511999999999@c.us");
        expect(lastCall[1]).toBe(message);
    });
});
