// @ts-ignore
import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";
import '@/test/setup'; // Import setup first
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';

// Mock modules
const mockSupabase = {
    auth: {
        getSession: mock(() => Promise.resolve({ data: { session: null }, error: null })),
        onAuthStateChange: mock(() => ({ data: { subscription: { unsubscribe: mock() } } })),
        signOut: mock(),
    },
    from: mock(() => ({
        select: mock().mockReturnThis(),
        eq: mock().mockReturnThis(),
        single: mock().mockReturnThis(),
    }))
};

mock.module('@/lib/supabase', () => ({ supabase: mockSupabase }));
mock.module('src/lib/supabase.ts', () => ({ supabase: mockSupabase }));

const mockUseAuth = mock(() => ({ role: 'User' }));
mock.module('@/components/auth-provider', () => ({
    useAuth: mockUseAuth
}));
mock.module('src/components/auth-provider.tsx', () => ({
    useAuth: mockUseAuth
}));

const mockUseAppStore = mock(() => ({
    activeAgencyId: null,
    setActiveAgencyId: mock(),
    agencies: [],
    team: []
}));
mock.module('@/stores/main', () => ({
    default: mockUseAppStore
}));

// Import component
import { AgencySelector } from './AgencySelector';

describe('AgencySelector', () => {
    afterEach(() => {
        cleanup();
        mockUseAuth.mockClear();
        mockUseAppStore.mockClear();
    });

    it('should return null if role is not Admin', () => {
        mockUseAuth.mockReturnValue({ role: 'User' });
        mockUseAppStore.mockReturnValue({
            activeAgencyId: null,
            setActiveAgencyId: mock(),
            agencies: [],
            team: []
        });

        const { container } = render(<AgencySelector />);
        expect(container.firstChild).toBeNull();
    });

    it('should render if role is Admin', () => {
        mockUseAuth.mockReturnValue({ role: 'Admin' });
        mockUseAppStore.mockReturnValue({
            activeAgencyId: null,
            setActiveAgencyId: mock(),
            agencies: [{ id: 'a1', name: 'Agencia Teste' }],
            team: []
        });

        render(<AgencySelector />);

        // The placeholder or selected value should be visible
        // When activeAgencyId is null, it defaults to 'all' which shows "Todas as Agências"
        expect(screen.getByText('Todas as Agências')).toBeInTheDocument();
    });
});
