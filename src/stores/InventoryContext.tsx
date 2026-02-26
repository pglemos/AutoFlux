import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { InventoryItem } from '@/types'
import { toCamelCase, toSnakeCase } from '@/lib/utils'

export interface InventoryState {
    inventory: InventoryItem[]
    updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void
    loading: boolean
}

const InventoryContext = createContext<InventoryState | undefined>(undefined)

export function InventoryProvider({ children }: { children: ReactNode }) {
    const [inventory, setInventory] = useState<InventoryItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchInventory = async () => {
            const { data, error } = await supabase.from('inventory').select('*')
            if (!error && data) setInventory(toCamelCase(data))
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

    const updateInventoryItem = useCallback(async (id: string, updates: Partial<InventoryItem>) => {
        const { error } = await supabase.from('inventory').update(toSnakeCase(updates)).eq('id', id)
        if (!error) setInventory(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item))
    }, [])

    return (
        <InventoryContext.Provider value={{ inventory, updateInventoryItem, loading }}>
            {children}
        </InventoryContext.Provider>
    )
}

export function useInventory() {
    const context = useContext(InventoryContext)
    if (!context) throw new Error('useInventory must be used within InventoryProvider')
    return context
}
