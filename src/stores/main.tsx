import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useMemo,
    useCallback,
} from 'react'
import { mockCommissions } from '@/lib/mock-data'

export type TaskStatus = 'Pendente' | 'Concluída' | 'Atrasada'
export type TaskPriority = 'Alta' | 'Média' | 'Baixa'

export interface Task {
    id: string
    title: string
    description: string
    dueDate: string
    priority: TaskPriority
    leadId: string
    status: TaskStatus
}

export interface Commission {
    id: string
    seller: string
    car: string
    date: string
    margin: string
    comission: number
}

export interface CommissionRule {
    id: string
    sellerId?: string
    vehicleType?: string
    marginMin?: number
    marginMax?: number
    percentage: number
}

export interface Goal {
    id: string
    type: 'Equipe' | 'Individual'
    targetId?: string
    amount: number
}

export interface Agency {
    id: string
    name: string
}

export interface User {
    id: string
    name: string
    email: string
    role: 'Owner' | 'Manager' | 'Seller' | 'RH' | 'Admin'
    agencyId?: string
}

export interface TeamMember {
    id: string
    name: string
    role: string
    conversion: number
    execution: number
    sales: number
    avatar: string
    agencyId?: string
}

export type LeadStage =
    | 'Lead'
    | 'Contato'
    | 'Agendamento'
    | 'Visita'
    | 'Proposta'
    | 'Venda'
    | 'Perdido'

export interface Lead {
    id: string
    name: string
    car: string
    stage: LeadStage
    slaMinutes: number
    source: string
    value: number
    score: number
    lastAction?: string
    lossReason?: string
    stagnantDays?: number
    sellerId?: string
    agencyId?: string
}

export interface InventoryItem {
    id: string
    model: string
    year: number
    price: number
    agencyId: string
    agingDays?: number
}

// --- Split Interfaces ---

export interface TasksState {
    tasks: Task[]
    addTask: (task: Omit<Task, 'id' | 'status'>) => void
    updateTask: (id: string, updates: Partial<Task>) => void
    deleteTask: (id: string) => void
}

    commissions: Commission[]
    addCommission: (commission: Omit<Commission, 'id'>) => void
    commissionRules: CommissionRule[]
    addCommissionRule: (rule: Omit<CommissionRule, 'id'>) => void
    deleteCommissionRule: (id: string) => void
}

export interface GoalsState {
    goals: Goal[]
    setGoal: (goal: Omit<Goal, 'id'>) => void
    deleteGoal: (id: string) => void
}

export interface UIState {
    dashboardWidgets: string[]
    setDashboardWidgets: (widgets: string[]) => void
    reportWidgets: string[]
    setReportWidgets: (widgets: string[]) => void
    calendarIntegrations: { google: boolean; outlook: boolean }
    setCalendarIntegration: (provider: 'google' | 'outlook', connected: boolean) => void
    chainedFunnel: boolean
    setChainedFunnel: (v: boolean) => void
}

export interface UsersState {
    users: User[]
    addUser: (user: Omit<User, 'id'>) => void
    updateUser: (id: string, user: Partial<User>) => void
    deleteUser: (id: string) => void
    agencies: Agency[]
    addAgency: (agency: Omit<Agency, 'id'>) => void
    updateAgency: (id: string, agency: Partial<Agency>) => void
    deleteAgency: (id: string) => void
    permissions: Record<string, string[]>
    togglePermission: (role: string, path: string) => void

    activeAgencyId: string | null
    setActiveAgencyId: (id: string | null) => void
}

export interface TeamState {
    team: TeamMember[]
    addTeamMember: (member: Omit<TeamMember, 'id'>) => void
    updateTeamMember: (id: string, member: Partial<TeamMember>) => void
    deleteTeamMember: (id: string) => void
}

export interface LeadsState {
    leads: Lead[]
    addLead: (lead: Omit<Lead, 'id'>) => void
    updateLead: (id: string, lead: Partial<Lead>) => void
    deleteLead: (id: string) => void
}

export interface AppState extends TasksState, CommissionsState, GoalsState, UIState, UsersState, TeamState, LeadsState {}

// --- Contexts ---

const TasksContext = createContext<TasksState | undefined>(undefined)
const CommissionsContext = createContext<CommissionsState | undefined>(undefined)
const GoalsContext = createContext<GoalsState | undefined>(undefined)
const UIContext = createContext<UIState | undefined>(undefined)
const UsersContext = createContext<UsersState | undefined>(undefined)
const TeamContext = createContext<TeamState | undefined>(undefined)
const LeadsContext = createContext<LeadsState | undefined>(undefined)

// --- Hooks ---

export function useTasks() {
    const context = useContext(TasksContext)
    if (!context) throw new Error('useTasks must be used within AppStoreProvider')
    return context
}

export function useCommissions() {
    const context = useContext(CommissionsContext)
    if (!context) throw new Error('useCommissions must be used within AppStoreProvider')
    return context
}

export function useGoals() {
    const context = useContext(GoalsContext)
    if (!context) throw new Error('useGoals must be used within AppStoreProvider')
    return context
}

export function useUI() {
    const context = useContext(UIContext)
    if (!context) throw new Error('useUI must be used within AppStoreProvider')
    return context
}

export function useUsers() {
    const context = useContext(UsersContext)
    if (!context) throw new Error('useUsers must be used within AppStoreProvider')
    return context
}

export function useTeam() {
    const context = useContext(TeamContext)
    if (!context) throw new Error('useTeam must be used within AppStoreProvider')
    return context
}

export function useLeads() {
    const context = useContext(LeadsContext)
    if (!context) throw new Error('useLeads must be used within AppStoreProvider')
    return context
}

// --- Provider ---

export function AppStoreProvider({ children }: { children: ReactNode }) {
    const [activeAgencyId, setActiveAgencyId] = useState<string | null>(null)
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: 't1',
            title: 'Ligar para Carlos',
            description: 'Confirmar test drive',
            dueDate: new Date().toISOString(),
            priority: 'Alta',
            leadId: 'L-101',
            status: 'Pendente',
        },
    ])
    const [commissions, setCommissions] = useState<Commission[]>(
        mockCommissions.map((c) => ({
            ...c,
            date: new Date().toLocaleDateString('pt-BR'),
        })),
    )
    const [dashboardWidgets, setDashboardWidgets] = useState<string[]>([
        'kpi-metas',
        'kpi-leads',
        'kpi-vendas',
        'kpi-projecao',
        'chart-vendas',
        'chart-funnel-leak',
    ])
    const [reportWidgets, setReportWidgets] = useState<string[]>([
        'chart-lucratividade',
        'chart-ciclo',
        'table-descontos',
    ])
    const [commissionRules, setCommissionRules] = useState<CommissionRule[]>([
        { id: 'r1', vehicleType: 'Esportivo', marginMin: 10, percentage: 20 },
    ])
    const [goals, setGoals] = useState<Goal[]>([
        { id: 'g1', type: 'Equipe', targetId: 'team', amount: 25 },
    ])
    const [calendarIntegrations, setCalendarIntegrations] = useState({
        google: false,
        outlook: false,
    })
    const [chainedFunnel, setChainedFunnel] = useState(true)

    const [users, setUsers] = useState<User[]>([
        { id: 'u1', name: 'Admin Dono', email: 'admin@loja.com', role: 'Owner', agencyId: 'a1' },
        { id: 'u2', name: 'Alex Gerente', email: 'alex@loja.com', role: 'Manager', agencyId: 'a1' },
    ])

    const [agencies, setAgencies] = useState<Agency[]>([
        { id: 'a1', name: 'Agência Matriz' },
        { id: 'a2', name: 'Agência Serrana' },
    ])

    const [team, setTeam] = useState<TeamMember[]>([
        { id: 'T-01', name: 'Alex', role: 'Closer', conversion: 18.5, execution: 92, sales: 6, avatar: 'male&seed=1', agencyId: 'a1' },
        { id: 'T-02', name: 'David', role: 'Closer', conversion: 22.1, execution: 98, sales: 5, avatar: 'male&seed=2', agencyId: 'a1' },
        { id: 'T-03', name: 'Leandro', role: 'SDR', conversion: 12.0, execution: 85, sales: 4, avatar: 'male&seed=3', agencyId: 'a2' },
        { id: 'T-04', name: 'Venda Loja', role: 'Loja', conversion: 15.3, execution: 88, sales: 5, avatar: 'female&seed=4', agencyId: 'a2' },
    ])
    const [leads, setLeads] = useState<Lead[]>([
        { id: 'L-101', name: 'Carlos Silva', car: 'Porsche 911', stage: 'Lead', slaMinutes: 5, source: 'Internet', value: 850000, score: 92, sellerId: 'T-01', agencyId: 'a1' },
        { id: 'L-102', name: 'Ana Oliveira', car: 'BMW X5', stage: 'Contato', slaMinutes: 15, source: 'Internet', value: 420000, score: 85, sellerId: 'T-02', agencyId: 'a1' },
        { id: 'L-103', name: 'Roberto Carlos', car: 'Audi Q3', stage: 'Agendamento', slaMinutes: 45, source: 'Porta', value: 280000, score: 60, sellerId: 'T-01', agencyId: 'a1' },
        { id: 'L-104', name: 'Juliana Costa', car: 'Mercedes C300', stage: 'Visita', slaMinutes: 120, source: 'Internet', value: 350000, score: 78, sellerId: 'T-03', agencyId: 'a2' },
        { id: 'L-105', name: 'Fernando Lima', car: 'Volvo XC60', stage: 'Proposta', slaMinutes: 300, source: 'Carteira', value: 390000, score: 88, sellerId: 'T-02', agencyId: 'a1' },
    ])
    const [inventory, setInventory] = useState([
        { id: 'v1', model: 'Porsche 911 GT3', year: 2023, price: 1250000, agencyId: 'a1' },
        { id: 'v2', model: 'BMW M4 Competition', year: 2024, price: 780000, agencyId: 'a1' },
        { id: 'v3', model: 'Audi RS6 Avant', year: 2023, price: 1150000, agencyId: 'a2' },
    ])

    const [permissions, setPermissions] = useState<Record<string, string[]>>({
        Admin: ['/dashboard', '/relatorio-matinal', '/metas', '/tarefas', '/leads', '/funnel', '/agenda', '/inventory', '/financeiro', '/relatorios/performance-vendas', '/relatorios/vendas-cruzados', '/relatorios/performance-vendedores', '/reports/stock', '/team', '/configuracoes/comissoes', '/training', '/communication', '/ia-diagnostics', '/settings'],
        Owner: ['/dashboard', '/relatorio-matinal', '/metas', '/tarefas', '/leads', '/funnel', '/agenda', '/inventory', '/financeiro', '/relatorios/performance-vendas', '/relatorios/vendas-cruzados', '/relatorios/performance-vendedores', '/reports/stock', '/team', '/configuracoes/comissoes', '/training', '/communication', '/ia-diagnostics', '/settings'],
        Manager: ['/dashboard', '/relatorio-matinal', '/metas', '/tarefas', '/leads', '/funnel', '/agenda', '/inventory', '/financeiro', '/relatorios/performance-vendas', '/relatorios/vendas-cruzados', '/relatorios/performance-vendedores', '/reports/stock', '/team', '/configuracoes/comissoes', '/training', '/communication', '/ia-diagnostics', '/settings'],
        Seller: ['/dashboard', '/relatorio-matinal', '/metas', '/tarefas', '/leads', '/funnel', '/agenda'],
        RH: ['/dashboard', '/team', '/financeiro', '/configuracoes/comissoes', '/settings'],
    })

    const addTask = useCallback(
        (task: Omit<Task, 'id' | 'status'>) =>
            setTasks((prev) => [...prev, { ...task, id: Math.random().toString(), status: 'Pendente' }]),
        [],
    )
    const updateTask = useCallback(
        (id: string, updates: Partial<Task>) =>
            setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t))),
        [],
    )
    const deleteTask = useCallback((id: string) => setTasks((prev) => prev.filter((t) => t.id !== id)), [])

    const addCommission = useCallback(
        (comm: Omit<Commission, 'id'>) =>
            setCommissions((prev) => [{ ...comm, id: Math.random().toString() }, ...prev]),
        [],
    )
    const addCommissionRule = useCallback(
        (rule: Omit<CommissionRule, 'id'>) =>
            setCommissionRules((prev) => [...prev, { ...rule, id: Math.random().toString() }]),
        [],
    )
    const deleteCommissionRule = useCallback(
        (id: string) => setCommissionRules((prev) => prev.filter((r) => r.id !== id)),
        [],
    )

    const setGoal = useCallback(
        (goal: Omit<Goal, 'id'>) =>
            setGoals((prev) => {
                const existing = prev.find((g) => g.type === goal.type && g.targetId === goal.targetId)
                if (existing) return prev.map((g) => (g.id === existing.id ? { ...g, amount: goal.amount } : g))
                return [...prev, { ...goal, id: Math.random().toString() }]
            }),
        [],
    )
    const deleteGoal = useCallback((id: string) => setGoals((prev) => prev.filter((g) => g.id !== id)), [])

    const addUser = useCallback(
        (user: Omit<User, 'id'>) => setUsers((prev) => [...prev, { ...user, id: Math.random().toString() }]),
        [],
    )
    const updateUser = useCallback(
        (id: string, updates: Partial<User>) =>
            setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u))),
        [],
    )
    const deleteUser = useCallback((id: string) => setUsers((prev) => prev.filter((u) => u.id !== id)), [])

    const addAgency = useCallback(
        (agency: Omit<Agency, 'id'>) => setAgencies((prev) => [...prev, { ...agency, id: Math.random().toString() }]),
        [],
    )
    const updateAgency = useCallback(
        (id: string, updates: Partial<Agency>) =>
            setAgencies((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a))),
        [],
    )
    const deleteAgency = useCallback((id: string) => {
        setAgencies((prev) => prev.filter((a) => a.id !== id))
        setUsers((prev) => prev.map(u => u.agencyId === id ? { ...u, agencyId: undefined } : u))
    }, [])

    const addTeamMember = useCallback(
        (member: Omit<TeamMember, 'id'>) => setTeam((prev) => [...prev, { ...member, id: Math.random().toString() }]),
        [],
    )
    const updateTeamMember = useCallback(
        (id: string, updates: Partial<TeamMember>) =>
            setTeam((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t))),
        [],
    )
    const deleteTeamMember = useCallback((id: string) => setTeam((prev) => prev.filter((t) => t.id !== id)), [])

    const addLead = useCallback(
        (lead: Omit<Lead, 'id'>) => setLeads((prev) => [...prev, { ...lead, id: Math.random().toString() }]),
        [],
    )
    const updateLead = useCallback(
        (id: string, updates: Partial<Lead>) =>
            setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l))),
        [],
    )
    const deleteLead = useCallback((id: string) => setLeads((prev) => prev.filter((l) => l.id !== id)), [])

    const togglePermission = useCallback((role: string, path: string) => {
        setPermissions((prev) => {
            const current = prev[role] || []
            if (current.includes(path)) {
                return { ...prev, [role]: current.filter((p) => p !== path) }
            }
            return { ...prev, [role]: [...current, path] }
        })
    }, [])

    const value = useMemo(
        () => ({
            tasks, addTask, updateTask, deleteTask,
            commissions, addCommission,
            dashboardWidgets, setDashboardWidgets,
            reportWidgets, setReportWidgets,
            commissionRules, addCommissionRule, deleteCommissionRule,
            goals, setGoal, deleteGoal,
            calendarIntegrations,
            setCalendarIntegration: (provider: 'google' | 'outlook', connected: boolean) =>
                setCalendarIntegrations((prev) => ({ ...prev, [provider]: connected })),
            chainedFunnel, setChainedFunnel,
            users, addUser, updateUser, deleteUser,
            agencies, addAgency, updateAgency, deleteAgency,
            team, addTeamMember, updateTeamMember, deleteTeamMember,
            leads, addLead, updateLead, deleteLead,
            permissions, togglePermission,
            activeAgencyId, setActiveAgencyId,
        }),
        [
            tasks, addTask, updateTask, deleteTask,
            commissions, addCommission,
            dashboardWidgets, reportWidgets,
            commissionRules, addCommissionRule, deleteCommissionRule,
            goals, setGoal, deleteGoal,
            calendarIntegrations, chainedFunnel,
            users, addUser, updateUser, deleteUser,
            agencies, addAgency, updateAgency, deleteAgency,
            team, addTeamMember, updateTeamMember, deleteTeamMember,
            leads, addLead, updateLead, deleteLead,
            permissions, togglePermission,
            activeAgencyId, setActiveAgencyId,
        ],
    )

    const usersValue = useMemo<UsersState>(() => ({
        users, addUser, updateUser, deleteUser,
        agencies, addAgency, updateAgency, deleteAgency,
        permissions, togglePermission,
        activeAgencyId, setActiveAgencyId
    }), [users, addUser, updateUser, deleteUser, agencies, addAgency, updateAgency, deleteAgency, permissions, togglePermission, activeAgencyId])

    const teamValue = useMemo<TeamState>(() => ({
        team, addTeamMember, updateTeamMember, deleteTeamMember
    }), [team, addTeamMember, updateTeamMember, deleteTeamMember])

    const leadsValue = useMemo<LeadsState>(() => ({
        leads, addLead, updateLead, deleteLead
    }), [leads, addLead, updateLead, deleteLead])

    return React.createElement(TasksContext.Provider, { value: tasksValue },
        React.createElement(CommissionsContext.Provider, { value: commissionsValue },
            React.createElement(GoalsContext.Provider, { value: goalsValue },
                React.createElement(UIContext.Provider, { value: uiValue },
                    React.createElement(UsersContext.Provider, { value: usersValue },
                        React.createElement(TeamContext.Provider, { value: teamValue },
                            React.createElement(LeadsContext.Provider, { value: leadsValue },
                                children
                            )
                        )
                    )
                )
            )
        )
    )
}

export default function useAppStore() {
    const tasks = useTasks()
    const commissions = useCommissions()
    const goals = useGoals()
    const ui = useUI()
    const users = useUsers()
    const team = useTeam()
    const leads = useLeads()

    return {
        ...tasks,
        ...commissions,
        ...goals,
        ...ui,
        ...users,
        ...team,
        ...leads,
    }
}
