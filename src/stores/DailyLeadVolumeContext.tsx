import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import type { DailyLeadVolume } from '@/types'
import { toCamelCase, toSnakeCase } from '@/lib/utils'

export interface DailyLeadVolumeState {
    dailyVolumes: DailyLeadVolume[]
    addDailyVolume: (volume: Omit<DailyLeadVolume, 'id'>) => void
    updateDailyVolume: (id: string, updates: Partial<DailyLeadVolume>) => void
    deleteDailyVolume: (id: string) => void
    loading: boolean
}

const DailyLeadVolumeContext = createContext<DailyLeadVolumeState | undefined>(undefined)

export function DailyLeadVolumeProvider({ children }: { children: ReactNode }) {
    const [dailyVolumes, setDailyVolumes] = useState<DailyLeadVolume[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchVolumes = async () => {
            try {
                const { data, error } = await supabase.from('daily_lead_volumes').select('*')
                if (!error && data) setDailyVolumes(toCamelCase(data))
            } catch {
                // Table may not exist yet — use empty array
            }
            setLoading(false)
        }
        fetchVolumes()

        const subscription = supabase
            .channel('public:daily_lead_volumes')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'daily_lead_volumes' }, (payload) => {
                setDailyVolumes(prev => [...prev, toCamelCase(payload.new) as DailyLeadVolume])
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'daily_lead_volumes' }, (payload) => {
                const updated = toCamelCase(payload.new) as DailyLeadVolume
                setDailyVolumes(prev => prev.map(v => v.id === updated.id ? updated : v))
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'daily_lead_volumes' }, (payload) => {
                setDailyVolumes(prev => prev.filter(v => v.id !== payload.old.id))
            })
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        }
    }, [])

    const addDailyVolume = useCallback(async (volume: Omit<DailyLeadVolume, 'id'>) => {
        try {
            const { data, error } = await supabase.from('daily_lead_volumes').insert([toSnakeCase(volume)]).select()
            if (!error && data) {
                setDailyVolumes(prev => [...prev, toCamelCase(data[0])])
            } else {
                // Fallback: add locally with generated ID
                const localEntry: DailyLeadVolume = { ...volume, id: crypto.randomUUID() }
                setDailyVolumes(prev => [...prev, localEntry])
            }
        } catch {
            const localEntry: DailyLeadVolume = { ...volume, id: crypto.randomUUID() }
            setDailyVolumes(prev => [...prev, localEntry])
        }
    }, [])

    const updateDailyVolume = useCallback(async (id: string, updates: Partial<DailyLeadVolume>) => {
        try {
            const { error } = await supabase.from('daily_lead_volumes').update(toSnakeCase(updates)).eq('id', id)
            if (!error) setDailyVolumes(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v))
            else setDailyVolumes(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v))
        } catch {
            setDailyVolumes(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v))
        }
    }, [])

    const deleteDailyVolume = useCallback(async (id: string) => {
        try {
            const { error } = await supabase.from('daily_lead_volumes').delete().eq('id', id)
            if (!error) setDailyVolumes(prev => prev.filter(v => v.id !== id))
            else setDailyVolumes(prev => prev.filter(v => v.id !== id))
        } catch {
            setDailyVolumes(prev => prev.filter(v => v.id !== id))
        }
    }, [])

    const value = useMemo<DailyLeadVolumeState>(() => ({
        dailyVolumes, addDailyVolume, updateDailyVolume, deleteDailyVolume, loading,
    }), [dailyVolumes, addDailyVolume, updateDailyVolume, deleteDailyVolume, loading])

    return (
        <DailyLeadVolumeContext.Provider value={value}>
            {children}
        </DailyLeadVolumeContext.Provider>
    )
}

export function useDailyLeadVolume() {
    const context = useContext(DailyLeadVolumeContext)
    if (!context) throw new Error('useDailyLeadVolume must be used within DailyLeadVolumeProvider')
    return context
}
