import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import type { User, Agency, TeamMember } from '@/types'
import { toCamelCase, toSnakeCase } from '@/lib/utils'

export interface UsersState {
    users: User[]
    addUser: (user: Omit<User, 'id'>) => void
    updateUser: (id: string, user: Partial<User>) => void
    deleteUser: (id: string) => void
    agencies: Agency[]
    addAgency: (agency: Omit<Agency, 'id'>) => void
    updateAgency: (id: string, agency: Partial<Agency>) => void
    deleteAgency: (id: string) => void
    team: TeamMember[]
    addTeamMember: (member: Omit<TeamMember, 'id'>) => void
    updateTeamMember: (id: string, member: Partial<TeamMember>) => void
    deleteTeamMember: (id: string) => void
    permissions: Record<string, string[]>
    togglePermission: (role: string, path: string) => void
    activeAgencyId: string | null
    setActiveAgencyId: (id: string | null) => void
}

const UsersContext = createContext<UsersState | undefined>(undefined)

const DEFAULT_PERMISSIONS: Record<string, string[]> = {
    Admin: ['/dashboard', '/relatorio-matinal', '/metas', '/tarefas', '/leads', '/funnel', '/agenda', '/inventory', '/financeiro', '/relatorios/performance-vendas', '/relatorios/vendas-cruzados', '/relatorios/performance-vendedores', '/reports/stock', '/team', '/configuracoes/comissoes', '/training', '/communication', '/ia-diagnostics', '/settings'],
    Owner: ['/dashboard', '/relatorio-matinal', '/metas', '/tarefas', '/leads', '/funnel', '/agenda', '/inventory', '/financeiro', '/relatorios/performance-vendas', '/relatorios/vendas-cruzados', '/relatorios/performance-vendedores', '/reports/stock', '/team', '/configuracoes/comissoes', '/training', '/communication', '/ia-diagnostics', '/settings'],
    Manager: ['/dashboard', '/relatorio-matinal', '/metas', '/tarefas', '/leads', '/funnel', '/agenda', '/inventory', '/financeiro', '/relatorios/performance-vendas', '/relatorios/vendas-cruzados', '/relatorios/performance-vendedores', '/reports/stock', '/team', '/configuracoes/comissoes', '/training', '/communication', '/ia-diagnostics', '/settings'],
    Seller: ['/dashboard', '/relatorio-matinal', '/metas', '/tarefas', '/leads', '/funnel', '/agenda'],
    RH: ['/dashboard', '/team', '/financeiro', '/configuracoes/comissoes', '/settings'],
}

export function UsersProvider({ children }: { children: ReactNode }) {
    const [users, setUsers] = useState<User[]>([])
    const [agencies, setAgencies] = useState<Agency[]>([])
    const [team, setTeam] = useState<TeamMember[]>([])
    const [activeAgencyId, setActiveAgencyId] = useState<string | null>(null)
    const [permissions, setPermissions] = useState<Record<string, string[]>>(DEFAULT_PERMISSIONS)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    { data: teamData },
                    { data: agencyData },
                ] = await Promise.all([
                    supabase.from('team').select('*'),
                    supabase.from('agencies').select('*'),
                ])
                if (teamData) {
                    const camelTeam = toCamelCase(teamData)
                    setTeam(camelTeam)
                    // Users are derived from team members with email/role info
                    setUsers(camelTeam.map((t: any) => ({
                        id: t.id,
                        name: t.name,
                        email: t.email || '',
                        role: t.role || 'Seller',
                        agencyId: t.agencyId,
                    })))
                }
                if (agencyData) setAgencies(toCamelCase(agencyData))
            } catch {
                // Supabase error — use empty arrays
            }
        }
        fetchData()

        const agencySub = supabase
            .channel('public:agencies')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'agencies' }, (payload) => {
                if (payload.eventType === 'INSERT') setAgencies(prev => [...prev, toCamelCase(payload.new) as Agency])
                if (payload.eventType === 'UPDATE') {
                    const updated = toCamelCase(payload.new) as Agency
                    setAgencies(prev => prev.map(a => a.id === updated.id ? updated : a))
                }
                if (payload.eventType === 'DELETE') setAgencies(prev => prev.filter(a => a.id !== payload.old.id))
            })
            .subscribe()

        const teamSub = supabase
            .channel('public:team')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'team' }, (payload) => {
                if (payload.eventType === 'INSERT') setTeam(prev => [...prev, toCamelCase(payload.new) as TeamMember])
                if (payload.eventType === 'UPDATE') {
                    const updated = toCamelCase(payload.new) as TeamMember
                    setTeam(prev => prev.map(t => t.id === updated.id ? updated : t))
                }
                if (payload.eventType === 'DELETE') setTeam(prev => prev.filter(t => t.id !== payload.old.id))
            })
            .subscribe()

        return () => {
            supabase.removeChannel(agencySub)
            supabase.removeChannel(teamSub)
        }
    }, [])

    // --- Users CRUD (uses team table) ---
    const addUser = useCallback(async (user: Omit<User, 'id'>) => {
        try {
            const { data, error } = await supabase.from('team').insert([toSnakeCase(user)]).select()
            if (!error && data) {
                setUsers(prev => [...prev, toCamelCase(data[0])])
            } else {
                const localUser: User = { ...user, id: crypto.randomUUID() } as User
                setUsers(prev => [...prev, localUser])
            }
        } catch {
            const localUser: User = { ...user, id: crypto.randomUUID() } as User
            setUsers(prev => [...prev, localUser])
        }
    }, [])

    const updateUser = useCallback(async (id: string, updates: Partial<User>) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u))
        try {
            await supabase.from('team').update(toSnakeCase(updates)).eq('id', id)
        } catch {
            // Local state already updated
        }
    }, [])

    const deleteUser = useCallback(async (id: string) => {
        setUsers(prev => prev.filter(u => u.id !== id))
        try {
            await supabase.from('team').delete().eq('id', id)
        } catch {
            // Local state already updated
        }
    }, [])

    // --- Agencies CRUD ---
    const addAgency = useCallback(async (agency: Omit<Agency, 'id'>) => {
        try {
            const { data, error } = await supabase.from('agencies').insert([toSnakeCase(agency)]).select()
            if (!error && data) {
                setAgencies(prev => [...prev, toCamelCase(data[0])])
            } else {
                const local: Agency = { ...agency, id: crypto.randomUUID() } as Agency
                setAgencies(prev => [...prev, local])
            }
        } catch {
            const local: Agency = { ...agency, id: crypto.randomUUID() } as Agency
            setAgencies(prev => [...prev, local])
        }
    }, [])

    const updateAgency = useCallback(async (id: string, updates: Partial<Agency>) => {
        setAgencies(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a))
        try {
            await supabase.from('agencies').update(toSnakeCase(updates)).eq('id', id)
        } catch { /* local state already updated */ }
    }, [])

    const deleteAgency = useCallback(async (id: string) => {
        setAgencies(prev => prev.filter(a => a.id !== id))
        setUsers(prev => prev.map(u => u.agencyId === id ? { ...u, agencyId: undefined } : u))
        try {
            await supabase.from('agencies').delete().eq('id', id)
        } catch { /* local state already updated */ }
    }, [])

    // --- Team CRUD ---
    const addTeamMember = useCallback(async (member: Omit<TeamMember, 'id'>) => {
        try {
            const { data, error } = await supabase.from('team').insert([toSnakeCase(member)]).select()
            if (!error && data) {
                setTeam(prev => [...prev, toCamelCase(data[0])])
            } else {
                const local: TeamMember = { ...member, id: crypto.randomUUID() } as TeamMember
                setTeam(prev => [...prev, local])
            }
        } catch {
            const local: TeamMember = { ...member, id: crypto.randomUUID() } as TeamMember
            setTeam(prev => [...prev, local])
        }
    }, [])

    const updateTeamMember = useCallback(async (id: string, updates: Partial<TeamMember>) => {
        setTeam(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
        try {
            await supabase.from('team').update(toSnakeCase(updates)).eq('id', id)
        } catch { /* local state already updated */ }
    }, [])

    const deleteTeamMember = useCallback(async (id: string) => {
        setTeam(prev => prev.filter(t => t.id !== id))
        try {
            await supabase.from('team').delete().eq('id', id)
        } catch { /* local state already updated */ }
    }, [])

    // --- Permissions ---
    const togglePermission = useCallback((role: string, path: string) => {
        setPermissions(prev => {
            const current = prev[role] || []
            if (current.includes(path)) return { ...prev, [role]: current.filter(p => p !== path) }
            return { ...prev, [role]: [...current, path] }
        })
    }, [])

    const value = useMemo<UsersState>(() => ({
        users, addUser, updateUser, deleteUser,
        agencies, addAgency, updateAgency, deleteAgency,
        team, addTeamMember, updateTeamMember, deleteTeamMember,
        permissions, togglePermission,
        activeAgencyId, setActiveAgencyId,
    }), [
        users, agencies, team, permissions, togglePermission, activeAgencyId, addUser, updateUser, deleteUser, addAgency, updateAgency, deleteAgency, addTeamMember, updateTeamMember, deleteTeamMember
    ])

    return (
        <UsersContext.Provider value={value}>
            {children}
        </UsersContext.Provider>
    )
}

export function useUsers() {
    const context = useContext(UsersContext)
    if (!context) throw new Error('useUsers must be used within UsersProvider')
    return context
}
