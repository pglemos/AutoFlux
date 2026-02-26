import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react'
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

export function UsersProvider({ children }: { children: ReactNode }) {
    const [users, setUsers] = useState<User[]>([])
    const [agencies, setAgencies] = useState<Agency[]>([])
    const [team, setTeam] = useState<TeamMember[]>([])
    const [activeAgencyId, setActiveAgencyId] = useState<string | null>(null)
    const [permissions, setPermissions] = useState<Record<string, string[]>>({
        Admin: ['/dashboard', '/team', '/settings'],
        Owner: ['/dashboard', '/team', '/settings'],
        Manager: ['/dashboard', '/team', '/settings'],
        Seller: ['/dashboard'],
        RH: ['/team', '/settings'],
    })

    useEffect(() => {
        const fetchData = async () => {
            const { data: userData } = await supabase.from('profiles').select('*')
            const { data: agencyData } = await supabase.from('agencies').select('*')
            const { data: teamData } = await supabase.from('team').select('*')
            if (userData) setUsers(userData)
            if (agencyData) setAgencies(agencyData)
            if (teamData) setTeam(teamData)
        }
        fetchData()
    }, [])

    const togglePermission = useCallback((role: string, path: string) => {
        setPermissions(prev => {
            const current = prev[role] || []
            if (current.includes(path)) return { ...prev, [role]: current.filter(p => p !== path) }
            return { ...prev, [role]: [...current, path] }
        })
    }, [])

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

    return (
        <UsersContext.Provider value={{
            users, addUser: () => { }, updateUser: () => { }, deleteUser: () => { },
            agencies, addAgency: () => { }, updateAgency: () => { }, deleteAgency: () => { },
            team, addTeamMember, updateTeamMember, deleteTeamMember,
            permissions, togglePermission,
            activeAgencyId, setActiveAgencyId
        }}>
            {children}
        </UsersContext.Provider>
    )
}

export function useUsers() {
    const context = useContext(UsersContext)
    if (!context) throw new Error('useUsers must be used within UsersProvider')
    return context
}
