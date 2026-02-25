const { describe, it, expect, mock, beforeEach } = require('bun:test');
const { runDailyReport } = require('../cron-jobs');

describe('runDailyReport', () => {
    let client;

    beforeEach(() => {
        client = {
            sendMessage: mock(() => Promise.resolve())
        };
    });

    const createSupabaseMock = (configsResponse, usersResponse) => {
        return {
            from: mock((table) => {
                if (table === 'communication_configs') {
                    return {
                        select: () => ({
                            eq: () => ({
                                eq: () => Promise.resolve(configsResponse)
                            })
                        })
                    };
                }
                if (table === 'team') {
                    return {
                        select: () => ({
                            in: () => Promise.resolve(usersResponse)
                        })
                    };
                }
                return {
                    select: () => ({ eq: () => ({ eq: () => Promise.resolve({ data: [] }) }) })
                };
            })
        };
    };

    it('should return early if not connected', async () => {
        const supabase = createSupabaseMock({ data: [] }, { data: [] });
        await runDailyReport(client, supabase, false);
        expect(client.sendMessage).not.toHaveBeenCalled();
        expect(supabase.from).not.toHaveBeenCalled();
    });

    it('should return early if no active configs found', async () => {
        const supabase = createSupabaseMock({ data: [], error: null }, { data: [] });
        await runDailyReport(client, supabase, true);
        expect(supabase.from).toHaveBeenCalledWith('communication_configs');
        expect(client.sendMessage).not.toHaveBeenCalled();
    });

    it('should return early if config fetch error', async () => {
        const supabase = createSupabaseMock({ data: null, error: 'Some error' }, { data: [] });
        await runDailyReport(client, supabase, true);
        expect(client.sendMessage).not.toHaveBeenCalled();
    });

    it('should send messages to users with phone numbers', async () => {
        const configs = [{ target_roles: ['Manager'], custom_message: 'Hello' }];
        const users = [{ name: 'Alice', phone: '1234567890' }];
        const supabase = createSupabaseMock({ data: configs, error: null }, { data: users });

        await runDailyReport(client, supabase, true);

        expect(client.sendMessage).toHaveBeenCalledTimes(1);
        expect(client.sendMessage).toHaveBeenCalledWith('551234567890@c.us', 'Hello');
    });

    it('should skip users without phone numbers', async () => {
        const configs = [{ target_roles: ['Manager'] }];
        const users = [{ name: 'Bob' }]; // No phone
        const supabase = createSupabaseMock({ data: configs, error: null }, { data: users });

        await runDailyReport(client, supabase, true);

        expect(client.sendMessage).not.toHaveBeenCalled();
    });

    it('should handle multiple configs and users', async () => {
         const configs = [
             { target_roles: ['Manager'], custom_message: 'Msg1' },
             { target_roles: ['Owner'], custom_message: 'Msg2' }
         ];
         const users = [{ name: 'Alice', phone: '111' }];
         const supabase = createSupabaseMock({ data: configs, error: null }, { data: users });

         await runDailyReport(client, supabase, true);

         // 2 configs * 1 user = 2 messages
         expect(client.sendMessage).toHaveBeenCalledTimes(2);
         expect(client.sendMessage).toHaveBeenCalledWith('55111@c.us', 'Msg1');
         expect(client.sendMessage).toHaveBeenCalledWith('55111@c.us', 'Msg2');
    });

    it('should use default message if custom_message is missing', async () => {
        const configs = [{ target_roles: ['Manager'] }]; // No custom_message
        const users = [{ name: 'Dave', phone: '999' }];
        const supabase = createSupabaseMock({ data: configs, error: null }, { data: users });

        await runDailyReport(client, supabase, true);

        expect(client.sendMessage).toHaveBeenCalledTimes(1);
        const args = client.sendMessage.mock.calls[0];
        expect(args[1]).toContain('Olá Dave');
        expect(args[1]).toContain('relatório diário');
    });

    it('should handle Supabase errors gracefully', async () => {
        const supabase = {
            from: mock(() => {
                throw new Error('Database connection failed');
            })
        };

        // Should not throw
        await runDailyReport(client, supabase, true);
        expect(supabase.from).toHaveBeenCalled();
    });
});
