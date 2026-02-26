import React, { createContext, useContext, useState, ReactNode } from 'react'

const FinanceContext = createContext<any>(undefined)

export function FinanceProvider({ children }: { children: ReactNode }) {
    const [commissions, setCommissions] = useState([])
    const [commissionRules, setCommissionRules] = useState([])
    const [goals, setGoals] = useState([])

    return (
        <FinanceContext.Provider value={{ commissions, commissionRules, goals }}>
            {children}
        </FinanceContext.Provider>
    )
}

// For backward compatibility while we refactor
export const CommissionsProvider = FinanceProvider
export const GoalsProvider = ({ children }: { children: ReactNode }) => <>{children}</>

export const useCommissions = () => useContext(FinanceContext)
export const useGoals = () => useContext(FinanceContext)
export const useFinance = () => useContext(FinanceContext)
