import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import type { Commission, CommissionRule, Goal } from '@/types'
import { toCamelCase, toSnakeCase } from '@/lib/utils'

export interface FinanceState {
    commissions: Commission[]
    addCommission: (commission: Omit<Commission, 'id'>) => void
    commissionRules: CommissionRule[]
    addCommissionRule: (rule: Omit<CommissionRule, 'id'>) => void
    deleteCommissionRule: (id: string) => void
    goals: Goal[]
    setGoal: (goal: Omit<Goal, 'id'>) => void
    deleteGoal: (id: string) => void
}

const FinanceContext = createContext<FinanceState | undefined>(undefined)

// Helper to map DB commission to Frontend type
const mapCommissionFromDB = (c: any): Commission => {
    const camel = toCamelCase(c)
    return {
        ...camel,
        date: c.sale_date || camel.date,
        comission: Number(c.commission_amount || camel.comission || 0)
    }
}

// Helper to map Frontend commission to DB type
const mapCommissionToDB = (c: any): any => {
    const snake = toSnakeCase(c)
    const { date, comission, ...rest } = snake
    return {
        ...rest,
        sale_date: date,
        commission_amount: comission
    }
}

export function FinanceProvider({ children }: { children: ReactNode }) {
    const [commissions, setCommissions] = useState<Commission[]>([])
    const [commissionRules, setCommissionRules] = useState<CommissionRule[]>([])
    const [goals, setGoals] = useState<Goal[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    { data: commsData },
                    { data: rulesData },
                    { data: goalsData },
                ] = await Promise.all([
                    supabase.from('commissions').select('*'),
                    supabase.from('commission_rules').select('*'),
                    supabase.from('goals').select('*'),
                ])
                if (commsData) setCommissions(commsData.map(mapCommissionFromDB))
                if (rulesData) setCommissionRules(toCamelCase(rulesData))
                if (goalsData) setGoals(toCamelCase(goalsData))
            } catch {
                // Supabase error — use empty arrays
            }
        }
        fetchData()

        const commsSub = supabase
            .channel('public:commissions')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'commissions' }, (payload) => {
                if (payload.eventType === 'INSERT') setCommissions(prev => [mapCommissionFromDB(payload.new), ...prev])
                if (payload.eventType === 'UPDATE') {
                    const updated = mapCommissionFromDB(payload.new)
                    setCommissions(prev => prev.map(c => c.id === updated.id ? updated : c))
                }
                if (payload.eventType === 'DELETE') setCommissions(prev => prev.filter(c => c.id !== payload.old.id))
            })
            .subscribe()

        const goalsSub = supabase
            .channel('public:goals')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'goals' }, (payload) => {
                if (payload.eventType === 'INSERT') setGoals(prev => [...prev, toCamelCase(payload.new) as Goal])
                if (payload.eventType === 'UPDATE') {
                    const updated = toCamelCase(payload.new) as Goal
                    setGoals(prev => prev.map(g => g.id === updated.id ? updated : g))
                }
                if (payload.eventType === 'DELETE') setGoals(prev => prev.filter(g => g.id !== payload.old.id))
            })
            .subscribe()

        return () => {
            supabase.removeChannel(commsSub)
            supabase.removeChannel(goalsSub)
        }
    }, [])

    const addCommission = useCallback(async (comm: Omit<Commission, 'id'>) => {
        try {
            const { data, error } = await supabase.from('commissions').insert([mapCommissionToDB(comm)]).select()
            if (!error && data) {
                setCommissions(prev => [mapCommissionFromDB(data[0]), ...prev])
            } else {
                const local: Commission = { ...comm, id: crypto.randomUUID() } as Commission
                setCommissions(prev => [local, ...prev])
            }
        } catch {
            const local: Commission = { ...comm, id: crypto.randomUUID() } as Commission
            setCommissions(prev => [local, ...prev])
        }
    }, [])

    const addCommissionRule = useCallback(async (rule: Omit<CommissionRule, 'id'>) => {
        try {
            const { data, error } = await supabase.from('commission_rules').insert([toSnakeCase(rule)]).select()
            if (!error && data) {
                setCommissionRules(prev => [...prev, toCamelCase(data[0])])
            } else {
                const local: CommissionRule = { ...rule, id: crypto.randomUUID() } as CommissionRule
                setCommissionRules(prev => [...prev, local])
            }
        } catch {
            const local: CommissionRule = { ...rule, id: crypto.randomUUID() } as CommissionRule
            setCommissionRules(prev => [...prev, local])
        }
    }, [])

    const deleteCommissionRule = useCallback(async (id: string) => {
        setCommissionRules(prev => prev.filter(r => r.id !== id))
        try {
            await supabase.from('commission_rules').delete().eq('id', id)
        } catch {
            // Local state already updated
        }
    }, [])

    const setGoal = useCallback(async (goal: Omit<Goal, 'id'>) => {
        try {
            const { data, error } = await supabase.from('goals').upsert([toSnakeCase(goal)]).select()
            if (!error && data) {
                const updated = toCamelCase(data[0]) as Goal
                setGoals(prev => {
                    const existing = prev.find(g => g.type === updated.type && g.targetId === updated.targetId)
                    if (existing) return prev.map(g => g.id === existing.id ? updated : g)
                    return [...prev, updated]
                })
            } else {
                const local: Goal = { ...goal, id: crypto.randomUUID() } as Goal
                setGoals(prev => [...prev, local])
            }
        } catch {
            const local: Goal = { ...goal, id: crypto.randomUUID() } as Goal
            setGoals(prev => [...prev, local])
        }
    }, [])

    const deleteGoal = useCallback(async (id: string) => {
        setGoals(prev => prev.filter(g => g.id !== id))
        try {
            await supabase.from('goals').delete().eq('id', id)
        } catch {
            // Local state already updated
        }
    }, [])

    const value = useMemo<FinanceState>(() => ({
        commissions, addCommission,
        commissionRules, addCommissionRule, deleteCommissionRule,
        goals, setGoal, deleteGoal,
    }), [commissions, addCommission, commissionRules, addCommissionRule, deleteCommissionRule, goals, setGoal, deleteGoal])

    return (
        <FinanceContext.Provider value={value}>
            {children}
        </FinanceContext.Provider>
    )
}

// Backward-compat aliases
export const CommissionsProvider = FinanceProvider
export const GoalsProvider = ({ children }: { children: ReactNode }) => <>{children}</>

export function useFinance() {
    const context = useContext(FinanceContext)
    if (!context) throw new Error('useFinance must be used within FinanceProvider')
    return context
}

export const useCommissions = useFinance
export const useGoals = useFinance
