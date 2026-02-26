import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Lead, LeadStage } from '@/types'

export interface LeadsState {
    leads: Lead[]
    addLead: (lead: Omit<Lead, 'id'>) => void
    updateLead: (id: string, lead: Partial<Lead>) => void
    deleteLead: (id: string) => void
    loading: boolean
}

const LeadsContext = createContext<LeadsState | undefined>(undefined)

export function LeadsProvider({ children }: { children: ReactNode }) {
    const [leads, setLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLeads = async () => {
            const { data, error } = await supabase.from('leads').select('*')
            if (!error && data) setLeads(data)
            setLoading(false)
        }
        fetchLeads()
    }, [])

    const addLead = useCallback(async (lead: Omit<Lead, 'id'>) => {
        const { data, error } = await supabase.from('leads').insert([lead]).select()
        if (!error && data) setLeads(prev => [...prev, data[0]])
    }, [])

    const updateLead = useCallback(async (id: string, updates: Partial<Lead>) => {
        const { error } = await supabase.from('leads').update(updates).eq('id', id)
        if (!error) setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l))
    }, [])

    const deleteLead = useCallback(async (id: string) => {
        const { error } = await supabase.from('leads').delete().eq('id', id)
        if (!error) setLeads(prev => prev.filter(l => l.id !== id))
    }, [])

    return (
        <LeadsContext.Provider value={{ leads, addLead, updateLead, deleteLead, loading }}>
            {children}
        </LeadsContext.Provider>
    )
}

export function useLeads() {
    const context = useContext(LeadsContext)
    if (!context) throw new Error('useLeads must be used within LeadsProvider')
    return context
}
