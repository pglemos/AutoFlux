import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import type { User, Agency, TeamMember } from '@/types'

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
            const [
                { data: userData },
                { data: agencyData },
                { data: teamData },
            ] = await Promise.all([
                supabase.from('profiles').select('*'),
                supabase.from('agencies').select('*'),
                supabase.from('team').select('*'),
            ])
            if (userData) setUsers(userData)
            if (agencyData) setAgencies(agencyData)
            if (teamData) setTeam(teamData)
        }
        fetchData()
    }, [])

    // --- Users CRUD ---
    const addUser = useCallback(async (user: Omit<User, 'id'>) => {
        const { data, error } = await supabase.from('profiles').insert([user]).select()
        if (!error && data) setUsers(prev => [...prev, data[0]])
    }, [])

    const updateUser = useCallback(async (id: string, updates: Partial<User>) => {
        const { error } = await supabase.from('profiles').update(updates).eq('id', id)
        if (!error) setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u))
    }, [])

    const deleteUser = useCallback(async (id: string) => {
        const { error } = await supabase.from('profiles').delete().eq('id', id)
        if (!error) setUsers(prev => prev.filter(u => u.id !== id))
    }, [])

    // --- Agencies CRUD ---
    const addAgency = useCallback(async (agency: Omit<Agency, 'id'>) => {
        const { data, error } = await supabase.from('agencies').insert([agency]).select()
        if (!error && data) setAgencies(prev => [...prev, data[0]])
    }, [])

    const updateAgency = useCallback(async (id: string, updates: Partial<Agency>) => {
        const { error } = await supabase.from('agencies').update(updates).eq('id', id)
        if (!error) setAgencies(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a))
    }, [])

    const deleteAgency = useCallback(async (id: string) => {
        const { error } = await supabase.from('agencies').delete().eq('id', id)
        if (!error) {
            setAgencies(prev => prev.filter(a => a.id !== id))
            setUsers(prev => prev.map(u => u.agencyId === id ? { ...u, agencyId: undefined } : u))
        }
    }, [])

    // --- Team CRUD ---
    const addTeamMember = useCallback(async (member: Omit<TeamMember, 'id'>) => {
        const { data, error } = await supabase.from('team').insert([member]).select()
        if (!error && data) setTeam(prev => [...prev, data[0]])
    }, [])

    const updateTeamMember = useCallback(async (id: string, updates: Partial<TeamMember>) => {
        const { error } = await supabase.from('team').update(updates).eq('id', id)
        if (!error) setTeam(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
    }, [])

    const deleteTeamMember = useCallback(async (id: string) => {
        const { error } = await supabase.from('team').delete().eq('id', id)
        if (!error) setTeam(prev => prev.filter(t => t.id !== id))
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
        users, addUser, updateUser, deleteUser,
        agencies, addAgency, updateAgency, deleteAgency,
        team, addTeamMember, updateTeamMember, deleteTeamMember,
        permissions, togglePermission,
        activeAgencyId,
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
