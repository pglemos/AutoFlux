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
    agencyId?: string
}

export interface Appointment {
    id: string
    leadId: string
    sellerId: string
    title: string
    date: string // ISO date
    type: 'Visita' | 'Test-drive' | 'Entrega'
    status: 'Agendado' | 'Realizado' | 'Cancelado' | 'No-show'
    agency_id?: string
}

export interface Visit {
    id: string
    leadId: string
    appointmentId?: string
    sellerId: string
    checkIn: string
    checkOut?: string
    verified: boolean
    verificationMethod: 'QR' | 'Manual' | 'Geofence'
    agency_id?: string
}

export interface Proposal {
    id: string
    leadId: string
    sellerId: string
    value: number
    profitMargin: number
    status: 'Apresentada' | 'Negociação' | 'Aceita' | 'Recusada'
    conditions: any
    agencyId?: string
}

export interface InventoryItem {
    id: string
    model: string
    brand?: string
    year: number
    plate: string
    price: number
    costPrice?: number
    status: 'Disponível' | 'Reservado' | 'Vendido'
    agingDays: number
    mileage?: number
    fuelType?: string
    transmission?: string
    agencyId?: string
}

export interface AttendanceRecord {
    id: string
    sellerId: string
    checkIn: string
    checkOut?: string
    status: 'Presente' | 'Almoço' | 'Folga' | 'Falta'
    agencyId?: string
}

export interface Commission {
    id: string
    sellerId: string
    leadId?: string
    inventoryId?: string
    car: string
    date: string
    margin: number // Changed to number for consistency
    comission: number
    agencyId?: string
}

export interface CommissionRule {
    id: string
    sellerId?: string
    vehicleType?: string
    marginMin?: number
    marginMax?: number
    percentage: number
    agencyId?: string
}

export interface Goal {
    id: string
    type: 'Equipe' | 'Individual'
    targetId?: string
    amount: number
    month?: number
    year?: number
    agencyId?: string
}

export interface Agency {
    id: string
    name: string
    slug: string
    cnpj?: string
    address?: string
    phone?: string
    email?: string
    website?: string
    managerName?: string
}

export interface User {
    id: string
    name: string
    email: string
    password?: string
    phone?: string
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
    createdAt: string
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

export interface CommissionsState {
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
    selectedAiModel: string
    setSelectedAiModel: (model: string) => void
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
    const [activeAgencyId, setActiveAgencyId] = useState<string | null>('a1')
    const [selectedAiModel, setSelectedAiModel] = useState<string>('z-ai/glm-4.5-air:free')
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [visits, setVisits] = useState<Visit[]>([])
    const [proposals, setProposals] = useState<Proposal[]>([])
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
    const [notifications, setNotifications] = useState<any[]>([])
    const [auditLogs, setAuditLogs] = useState<any[]>([
        { id: '1', userId: 'user-1', action: 'login', resource: 'system', agencyId: 'a1', timestamp: new Date().toISOString() }
    ])

    const [tasks, setTasks] = useState<Task[]>([
        { id: 't1', title: 'Ligar para Carlos', description: 'Confirmar test drive', dueDate: new Date().toISOString(), priority: 'Alta', leadId: 'L-101', status: 'Pendente', agencyId: 'a1' },
    ])
    const [commissions, setCommissions] = useState<Commission[]>(
        mockCommissions.map((c) => ({
            id: c.id,
            sellerId: c.seller,
            car: c.car,
            date: new Date().toLocaleDateString('pt-BR'),
            margin: typeof c.margin === 'number' ? c.margin : parseFloat(c.margin.replace('%', '')) || 10,
            comission: c.comission,
            agencyId: 'a1'
        })),
    )

    const [dashboardWidgets, setDashboardWidgets] = useState<string[]>([
        'kpi-metas', 'kpi-leads', 'kpi-vendas', 'kpi-projecao', 'chart-vendas', 'chart-funnel-leak',
    ])
    const [reportWidgets, setReportWidgets] = useState<string[]>([
        'chart-lucratividade', 'chart-ciclo', 'table-descontos',
    ])
    const [commissionRules, setCommissionRules] = useState<CommissionRule[]>([
        { id: 'r1', vehicleType: 'Esportivo', marginMin: 10, percentage: 20, agencyId: 'a1' },
    ])
    const [goals, setGoals] = useState<Goal[]>([
        { id: 'g1', type: 'Equipe', targetId: 'team', amount: 25, agencyId: 'a1' },
    ])
    const [calendarIntegrations, setCalendarIntegrations] = useState({ google: false, outlook: false })
    const [chainedFunnel, setChainedFunnel] = useState(true)

    const [users, setUsers] = useState<User[]>([
        { id: 'u1', name: 'Admin Dono', email: 'admin@loja.com', role: 'Owner', agencyId: 'a1' },
        { id: 'u2', name: 'Alex Gerente', email: 'alex@loja.com', role: 'Manager', agencyId: 'a1' },
    ])

    const [agencies, setAgencies] = useState<Agency[]>([
        { id: 'a1', name: 'Agência Matriz', slug: 'matriz' },
        { id: 'a2', name: 'Agência Serrana', slug: 'serrana' },
    ])

    const [team, setTeam] = useState<TeamMember[]>([
        { id: 'T-01', name: 'Alex', role: 'Closer', conversion: 18.5, execution: 92, sales: 6, avatar: 'male&seed=1', agencyId: 'a1' },
        { id: 'T-02', name: 'David', role: 'Closer', conversion: 22.1, execution: 98, sales: 5, avatar: 'male&seed=2', agencyId: 'a1' },
        { id: 'T-03', name: 'Leandro', role: 'SDR', conversion: 12.0, execution: 85, sales: 4, avatar: 'male&seed=3', agencyId: 'a2' },
        { id: 'T-04', name: 'Venda Loja', role: 'Loja', conversion: 15.3, execution: 88, sales: 5, avatar: 'female&seed=4', agencyId: 'a2' },
    ])
    const [leads, setLeads] = useState<Lead[]>([
        { id: 'L-101', name: 'Carlos Silva', car: 'Porsche 911', stage: 'Lead', slaMinutes: 5, source: 'Internet', value: 850000, score: 92, sellerId: 'T-01', agencyId: 'a1', createdAt: new Date().toISOString() },
        { id: 'L-102', name: 'Ana Oliveira', car: 'BMW X5', stage: 'Contato', slaMinutes: 15, source: 'Internet', value: 420000, score: 85, sellerId: 'T-02', agencyId: 'a1', createdAt: new Date().toISOString() },
        { id: 'L-103', name: 'Roberto Carlos', car: 'Audi Q3', stage: 'Agendamento', slaMinutes: 45, source: 'Porta', value: 280000, score: 60, sellerId: 'T-01', agencyId: 'a1', createdAt: new Date().toISOString() },
        { id: 'L-104', name: 'Juliana Costa', car: 'Mercedes C300', stage: 'Visita', slaMinutes: 120, source: 'Internet', value: 350000, score: 78, sellerId: 'T-03', agencyId: 'a2', createdAt: new Date().toISOString() },
        { id: 'L-105', name: 'Fernando Lima', car: 'Volvo XC60', stage: 'Proposta', slaMinutes: 300, source: 'Carteira', value: 390000, score: 88, sellerId: 'T-02', agencyId: 'a1', createdAt: new Date().toISOString() },
    ])
    const [inventory, setInventory] = useState<InventoryItem[]>([
        { id: 'v1', model: 'Porsche 911 GT3', year: 2023, price: 1250000, agencyId: 'a1', agingDays: 45 },
        { id: 'v2', model: 'BMW M4 Competition', year: 2024, price: 780000, agencyId: 'a1', agingDays: 12 },
        { id: 'v3', model: 'Audi RS6 Avant', year: 2023, price: 1150000, agencyId: 'a2', agingDays: 5 },
    ])

    const [permissions, setPermissions] = useState<Record<string, string[]>>({
        Admin: ['/dashboard', '/relatorio-matinal', '/metas', '/tarefas', '/leads', '/funnel', '/agenda', '/inventory', '/financeiro', '/team', '/communication', '/ia-diagnostics', '/settings'],
        Owner: ['/dashboard', '/relatorio-matinal', '/metas', '/tarefas', '/leads', '/funnel', '/agenda', '/inventory', '/financeiro', '/team', '/communication', '/ia-diagnostics', '/settings'],
        Manager: ['/dashboard', '/relatorio-matinal', '/metas', '/tarefas', '/leads', '/funnel', '/agenda', '/inventory', '/financeiro', '/team', '/communication', '/ia-diagnostics', '/settings'],
        Seller: ['/dashboard', '/relatorio-matinal', '/metas', '/tarefas', '/leads', '/funnel', '/agenda'],
        RH: ['/dashboard', '/team', '/financeiro', '/settings'],
    })

    const addTask = useCallback((task: Omit<Task, 'id' | 'status'>) => setTasks((prev) => [...prev, { ...task, id: Math.random().toString(), status: 'Pendente' }]), [])
    const updateTask = useCallback((id: string, updates: Partial<Task>) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t))), [])
    const deleteTask = useCallback((id: string) => setTasks((prev) => prev.filter((t) => t.id !== id)), [])

    const addAppointment = useCallback((appointment: Omit<Appointment, 'id' | 'status'>) => setAppointments(prev => [...prev, { ...appointment, id: Math.random().toString(), status: 'Agendado' }]), [])
    const updateAppointment = useCallback((id: string, updates: Partial<Appointment>) => setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a)), [])

    const recordVisit = useCallback((visit: Omit<Visit, 'id' | 'checkIn' | 'verified' | 'verificationMethod'>) => setVisits(prev => [...prev, { ...visit, id: Math.random().toString(), checkIn: new Date().toISOString(), verified: false, verificationMethod: 'Manual' }]), [])
    const verifyVisit = useCallback((id: string) => setVisits(prev => prev.map(v => v.id === id ? { ...v, verified: true } : v)), [])

    const addProposal = useCallback((proposal: Omit<Proposal, 'id' | 'status'>) => setProposals(prev => [...prev, { ...proposal, id: Math.random().toString(), status: 'Apresentada' }]), [])
    const updateProposal = useCallback((id: string, updates: Partial<Proposal>) => setProposals(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p)), [])

    const updateInventoryItem = useCallback((id: string, updates: Partial<InventoryItem>) => setInventory(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i)), [])

    const recordAttendance = useCallback((record: Omit<AttendanceRecord, 'id' | 'checkIn'>) => setAttendance(prev => [...prev, { ...record, id: Math.random().toString(), checkIn: new Date().toISOString() }]), [])

    const addCommission = useCallback((comm: Omit<Commission, 'id'>) => setCommissions((prev) => [{ ...comm, id: Math.random().toString() }, ...prev]), [])
    const addCommissionRule = useCallback((rule: Omit<CommissionRule, 'id'>) => setCommissionRules((prev) => [...prev, { ...rule, id: Math.random().toString() }]), [])
    const deleteCommissionRule = useCallback((id: string) => setCommissionRules((prev) => prev.filter((r) => r.id !== id)), [])

    const setGoal = useCallback((goal: Omit<Goal, 'id'>) => setGoals((prev) => {
        const existing = prev.find((g) => g.type === goal.type && g.targetId === goal.targetId)
        if (existing) return prev.map((g) => (g.id === existing.id ? { ...g, amount: goal.amount } : g))
        return [...prev, { ...goal, id: Math.random().toString() }]
    }), [])
    const deleteGoal = useCallback((id: string) => setGoals((prev) => prev.filter((g) => g.id !== id)), [])

    const addUser = useCallback((user: Omit<User, 'id'>) => setUsers((prev) => [...prev, { ...user, id: Math.random().toString() }]), [])
    const updateUser = useCallback((id: string, updates: Partial<User>) => setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u))), [])
    const deleteUser = useCallback((id: string) => setUsers((prev) => prev.filter((u) => u.id !== id)), [])

    const addAgency = useCallback((agency: Omit<Agency, 'id'>) => setAgencies((prev) => [...prev, { ...agency, id: Math.random().toString() }]), [])
    const updateAgency = useCallback((id: string, updates: Partial<Agency>) => setAgencies((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a))), [])
    const deleteAgency = useCallback((id: string) => {
        setAgencies((prev) => prev.filter((a) => a.id !== id))
        setUsers((prev) => prev.map(u => u.agencyId === id ? { ...u, agencyId: undefined } : u))
    }, [])

    const addTeamMember = useCallback((member: Omit<TeamMember, 'id'>) => setTeam((prev) => [...prev, { ...member, id: Math.random().toString() }]), [])
    const updateTeamMember = useCallback((id: string, updates: Partial<TeamMember>) => setTeam((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t))), [])
    const deleteTeamMember = useCallback((id: string) => setTeam((prev) => prev.filter((t) => t.id !== id)), [])

    const addLead = useCallback((lead: Omit<Lead, 'id'>) => setLeads((prev) => [...prev, { ...lead, id: Math.random().toString(), createdAt: new Date().toISOString() }]), [])
    const updateLead = useCallback((id: string, updates: Partial<Lead>) => setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l))), [])
    const deleteLead = useCallback((id: string) => setLeads((prev) => prev.filter((l) => l.id !== id)), [])

    const addAuditLog = useCallback((log: { userId: string; action: string; resource: string; agencyId: string }) => {
        setAuditLogs(prev => [...prev, { ...log, id: Math.random().toString(), timestamp: new Date().toISOString() }])
    }, [])

    const togglePermission = useCallback((role: string, path: string) => {
        setPermissions((prev) => {
            const current = prev[role] || []
            if (current.includes(path)) return { ...prev, [role]: current.filter((p) => p !== path) }
            return { ...prev, [role]: [...current, path] }
        })
    }, [])

    // --- Memoized Values ---

    const tasksValue = useMemo<TasksState>(() => ({
        tasks, addTask, updateTask, deleteTask
    }), [tasks, addTask, updateTask, deleteTask])

    const commissionsValue = useMemo<CommissionsState>(() => ({
        commissions, addCommission, commissionRules, addCommissionRule, deleteCommissionRule
    }), [commissions, addCommission, commissionRules, addCommissionRule, deleteCommissionRule])

    const goalsValue = useMemo<GoalsState>(() => ({
        goals, setGoal, deleteGoal
    }), [goals, setGoal, deleteGoal])

    const uiValue = useMemo<UIState>(() => ({
        dashboardWidgets, setDashboardWidgets,
        reportWidgets, setReportWidgets,
        calendarIntegrations,
        setCalendarIntegration: (provider: 'google' | 'outlook', connected: boolean) =>
            setCalendarIntegrations((prev) => ({ ...prev, [provider]: connected })),
        chainedFunnel, setChainedFunnel
    }), [dashboardWidgets, reportWidgets, calendarIntegrations, chainedFunnel])

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
