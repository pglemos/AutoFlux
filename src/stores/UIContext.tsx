import React, { createContext, useContext, useState, ReactNode } from 'react'
import { UIState } from '@/types'

export interface UIContextProps {
    dashboardWidgets: string[]
    setDashboardWidgets: (widgets: string[]) => void
    reportWidgets: string[]
    setReportWidgets: (widgets: string[]) => void
    calendarIntegrations: { google: boolean; outlook: boolean }
    setCalendarIntegration: (provider: 'google' | 'outlook', connected: boolean) => void
    chainedFunnel: boolean
    setChainedFunnel: (v: boolean) => void
}

const UIContext = createContext<UIContextProps | undefined>(undefined)

export function UIProvider({ children }: { children: ReactNode }) {
    const [dashboardWidgets, setDashboardWidgets] = useState<string[]>([
        'kpi-metas', 'kpi-leads', 'kpi-vendas', 'kpi-projecao', 'chart-vendas', 'chart-funnel-leak'
    ])
    const [reportWidgets, setReportWidgets] = useState<string[]>([
        'chart-lucratividade', 'chart-ciclo', 'table-descontos'
    ])
    const [calendarIntegrations, setCalendarIntegrations] = useState({ google: false, outlook: false })
    const [chainedFunnel, setChainedFunnel] = useState(true)

    const setCalendarIntegration = (provider: 'google' | 'outlook', connected: boolean) => {
        setCalendarIntegrations(prev => ({ ...prev, [provider]: connected }))
    }

    return (
        <UIContext.Provider value={{
            dashboardWidgets, setDashboardWidgets,
            reportWidgets, setReportWidgets,
            calendarIntegrations, setCalendarIntegration,
            chainedFunnel, setChainedFunnel
        }}>
            {children}
        </UIContext.Provider>
    )
}

export const useUI = () => {
    const context = useContext(UIContext)
    if (!context) throw new Error('useUI must be used within UIProvider')
    return context
}
