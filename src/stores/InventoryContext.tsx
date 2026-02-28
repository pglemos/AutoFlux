import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import type { InventoryItem } from '@/types'
import { toCamelCase, toSnakeCase } from '@/lib/utils'

export interface InventoryState {
    inventory: InventoryItem[]
    addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void
    updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void
    deleteInventoryItem: (id: string) => void
    loading: boolean
}

const InventoryContext = createContext<InventoryState | undefined>(undefined)

export function InventoryProvider({ children }: { children: ReactNode }) {
    const [inventory, setInventory] = useState<InventoryItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const { data, error } = await supabase.from('inventory').select('*')
                if (!error && data) setInventory(toCamelCase(data))
            } catch {
                // Table may not exist yet — use empty array
            }
            setLoading(false)
        }
        fetchInventory()

        const subscription = supabase
            .channel('public:inventory')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'inventory' }, (payload) => {
                setInventory(prev => [...prev, toCamelCase(payload.new) as InventoryItem])
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'inventory' }, (payload) => {
                const updated = toCamelCase(payload.new) as InventoryItem
                setInventory(prev => prev.map(item => item.id === updated.id ? updated : item))
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'inventory' }, (payload) => {
                setInventory(prev => prev.filter(item => item.id !== payload.old.id))
            })
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        }
    }, [])

    const addInventoryItem = useCallback(async (item: Omit<InventoryItem, 'id'>) => {
        try {
            const { data, error } = await supabase.from('inventory').insert([toSnakeCase(item)]).select()
            if (!error && data) {
                setInventory(prev => [...prev, toCamelCase(data[0])])
            } else {
                const localItem: InventoryItem = { ...item, id: crypto.randomUUID() } as InventoryItem
                setInventory(prev => [...prev, localItem])
            }
        } catch {
            const localItem: InventoryItem = { ...item, id: crypto.randomUUID() } as InventoryItem
            setInventory(prev => [...prev, localItem])
        }
    }, [])

    const updateInventoryItem = useCallback(async (id: string, updates: Partial<InventoryItem>) => {
        setInventory(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item))
        try {
            await supabase.from('inventory').update(toSnakeCase(updates)).eq('id', id)
        } catch {
            // Local state already updated
        }
    }, [])

    const deleteInventoryItem = useCallback(async (id: string) => {
        setInventory(prev => prev.filter(item => item.id !== id))
        try {
            await supabase.from('inventory').delete().eq('id', id)
        } catch {
            // Local state already updated
        }
    }, [])

    const value = useMemo<InventoryState>(() => ({
        inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, loading,
    }), [inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, loading])

    return (
        <InventoryContext.Provider value={value}>
            {children}
        </InventoryContext.Provider>
    )
}

export function useInventory() {
    const context = useContext(InventoryContext)
    if (!context) throw new Error('useInventory must be used within InventoryProvider')
    return context
}
