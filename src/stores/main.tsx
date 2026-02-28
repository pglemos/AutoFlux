import { ReactNode, useMemo } from 'react'
import { TasksProvider, useTasks } from './TasksContext'
import { FinanceProvider, useCommissions, useGoals, useFinance } from './FinanceContext'
import { UIProvider, useUI } from './UIContext'
import { UsersProvider, useUsers } from './UsersContext'
import { LeadsProvider, useLeads } from './LeadsContext'
import { InventoryProvider, useInventory } from './InventoryContext'
import { DailyLeadVolumeProvider, useDailyLeadVolume } from './DailyLeadVolumeContext'

export * from './TasksContext'
export * from './FinanceContext'
export * from './UIContext'
export * from './UsersContext'
export * from './LeadsContext'
export * from './InventoryContext'
export * from './DailyLeadVolumeContext'
export * from '@/types'

export function AppStoreProvider({ children }: { children: ReactNode }) {
    return (
        <UIProvider>
            <UsersProvider>
                <LeadsProvider>
                    <InventoryProvider>
                        <TasksProvider>
                            <FinanceProvider>
                                <DailyLeadVolumeProvider>
                                    {children}
                                </DailyLeadVolumeProvider>
                            </FinanceProvider>
                        </TasksProvider>
                    </InventoryProvider>
                </LeadsProvider>
            </UsersProvider>
        </UIProvider>
    )
}

export default function useAppStore() {
    const tasks = useTasks()
    const commissions = useCommissions()
    const goals = useGoals()
    const ui = useUI()
    const users = useUsers()
    const leads = useLeads()
    const inventory = useInventory()
    const finance = useFinance()
    const dailyLeadVolume = useDailyLeadVolume()

    return useMemo(() => ({
        ...tasks,
        ...commissions,
        ...goals,
        ...ui,
        ...users,
        ...leads,
        ...inventory,
        ...finance,
        ...dailyLeadVolume,
    }), [tasks, commissions, goals, ui, users, leads, inventory, finance, dailyLeadVolume])
}
