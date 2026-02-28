import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Lead, LeadStage } from '@/types'
import { toCamelCase, toSnakeCase } from '@/lib/utils'

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
            if (!error && data) setLeads(toCamelCase(data))
            setLoading(false)
        }
        fetchLeads()

        const subscription = supabase
            .channel('public:leads')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, (payload) => {
                setLeads(prev => [...prev, toCamelCase(payload.new) as Lead])
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'leads' }, (payload) => {
                const updated = toCamelCase(payload.new) as Lead
                setLeads(prev => prev.map(l => l.id === updated.id ? updated : l))
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'leads' }, (payload) => {
                setLeads(prev => prev.filter(l => l.id !== payload.old.id))
            })
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        }
    }, [])

    const addLead = useCallback(async (lead: Omit<Lead, 'id'>) => {
        try {
            const { data, error } = await supabase.from('leads').insert([toSnakeCase(lead)]).select()
            if (!error && data) {
                setLeads(prev => [...prev, toCamelCase(data[0])])
            } else {
                // Supabase error — fallback to local state
                const localLead: Lead = { ...lead, id: crypto.randomUUID() } as Lead
                setLeads(prev => [...prev, localLead])
            }
        } catch {
            const localLead: Lead = { ...lead, id: crypto.randomUUID() } as Lead
            setLeads(prev => [...prev, localLead])
        }
    }, [])

    const updateLead = useCallback(async (id: string, updates: Partial<Lead>) => {
        // Always update local state first for responsiveness
        setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l))
        try {
            await supabase.from('leads').update(toSnakeCase(updates)).eq('id', id)
        } catch {
            // Supabase failed, but local state is already updated
        }
    }, [])

    const deleteLead = useCallback(async (id: string) => {
        // Always update local state first
        setLeads(prev => prev.filter(l => l.id !== id))
        try {
            await supabase.from('leads').delete().eq('id', id)
        } catch {
            // Supabase failed, but local state is already updated
        }
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
