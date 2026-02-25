import { expect, test, spyOn, mock } from "bun:test";

test("Supabase config checks", async () => {
    // Mock createClient to prevent throwing error on import due to missing env vars
    mock.module("@supabase/supabase-js", () => {
        return {
            createClient: () => ({})
        };
    });

    // Spy on console.warn and suppress output
    const consoleWarnSpy = spyOn(console, "warn").mockImplementation(() => {});

    // Dynamic import will trigger the top-level check.
    // Depending on the environment (if .env is present), this might or might not log.
    // We ignore the initial side-effect to ensure the test is robust.
    const { checkSupabaseCredentials } = await import("./supabase");

    // Clear any side-effect warnings (whether they happened or not)
    consoleWarnSpy.mockClear();

    // Test case 1: Explicitly missing credentials
    checkSupabaseCredentials(undefined, undefined);
    expect(consoleWarnSpy).toHaveBeenCalledWith('Supabase credentials missing. Check your .env file.');
    consoleWarnSpy.mockClear();

    // Test case 2: Present credentials
    checkSupabaseCredentials("https://example.com", "anon-key");
    expect(consoleWarnSpy).not.toHaveBeenCalled();

    consoleWarnSpy.mockRestore();
});
