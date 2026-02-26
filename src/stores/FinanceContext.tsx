import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import type { Commission, CommissionRule, Goal } from '@/types'

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

export function FinanceProvider({ children }: { children: ReactNode }) {
    const [commissions, setCommissions] = useState<Commission[]>([])
    const [commissionRules, setCommissionRules] = useState<CommissionRule[]>([])
    const [goals, setGoals] = useState<Goal[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const [
                { data: commsData },
                { data: rulesData },
                { data: goalsData },
            ] = await Promise.all([
                supabase.from('commissions').select('*'),
                supabase.from('commission_rules').select('*'),
                supabase.from('goals').select('*'),
            ])
            if (commsData) setCommissions(commsData)
            if (rulesData) setCommissionRules(rulesData)
            if (goalsData) setGoals(goalsData)
        }
        fetchData()
    }, [])

    const addCommission = useCallback(async (comm: Omit<Commission, 'id'>) => {
        const { data, error } = await supabase.from('commissions').insert([comm]).select()
        if (!error && data) setCommissions(prev => [data[0], ...prev])
    }, [])

    const addCommissionRule = useCallback(async (rule: Omit<CommissionRule, 'id'>) => {
        const { data, error } = await supabase.from('commission_rules').insert([rule]).select()
        if (!error && data) setCommissionRules(prev => [...prev, data[0]])
    }, [])

    const deleteCommissionRule = useCallback(async (id: string) => {
        const { error } = await supabase.from('commission_rules').delete().eq('id', id)
        if (!error) setCommissionRules(prev => prev.filter(r => r.id !== id))
    }, [])

    const setGoal = useCallback(async (goal: Omit<Goal, 'id'>) => {
        const { data, error } = await supabase.from('goals').upsert([goal]).select()
        if (!error && data) {
            setGoals(prev => {
                const existing = prev.find(g => g.type === goal.type && g.targetId === goal.targetId)
                if (existing) return prev.map(g => g.id === existing.id ? { ...g, amount: goal.amount } : g)
                return [...prev, data[0]]
            })
        }
    }, [])

    const deleteGoal = useCallback(async (id: string) => {
        const { error } = await supabase.from('goals').delete().eq('id', id)
        if (!error) setGoals(prev => prev.filter(g => g.id !== id))
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
