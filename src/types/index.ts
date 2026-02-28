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
    sellerId?: string
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
    agingDays: number
    plate: string
    status: 'Disponível' | 'Vendido' | 'Reservado'
}

export interface UIState {
    dashboardWidgets: string[]
    reportWidgets: string[]
    calendarIntegrations: { google: boolean; outlook: boolean }
    chainedFunnel: boolean
}

export interface DailyLeadVolume {
    id: string
    sellerId: string
    date: string
    volume: number
    agencyId?: string
}
