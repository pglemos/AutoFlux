import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { InventoryItem } from '@/types'

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
            if (!error && data) setInventory(data)
            setLoading(false)
        }
        fetchInventory()
    }, [])

    const updateInventoryItem = useCallback(async (id: string, updates: Partial<InventoryItem>) => {
        const { error } = await supabase.from('inventory').update(updates).eq('id', id)
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
