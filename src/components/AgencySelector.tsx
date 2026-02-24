import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import useAppStore from '@/stores/main'
import { useAuth } from '@/components/auth-provider'
import { Building2 } from 'lucide-react'

export function AgencySelector() {
    const { role } = useAuth()
    const { activeAgencyId, setActiveAgencyId } = useAppStore()

    // In a real app, we would fetch agencies from Supabase
    // For now, using mock data or a placeholder
    const agencies = [
        { id: '1', name: 'AutoFlux Matriz' },
        { id: '2', name: 'AutoFlux Sul' },
        { id: '3', name: 'AutoFlux Norte' },
    ]

    if (role !== 'Admin') return null

    return (
        <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <Select
                value={activeAgencyId || 'all'}
                onValueChange={(value) => setActiveAgencyId(value === 'all' ? null : value)}
            >
                <SelectTrigger className="w-[200px] h-9 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <SelectValue placeholder="Selecione a Agência" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas as Agências</SelectItem>
                    {agencies.map((agency) => (
                        <SelectItem key={agency.id} value={agency.id}>
                            {agency.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
