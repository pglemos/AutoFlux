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
    const { activeAgencyId, setActiveAgencyId, agencies, team } = useAppStore()

    if (role !== 'Admin') return null

    return (
        <div className="flex items-center gap-2 group">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md transition-all group-hover:border-electric-blue/30">
                <Building2 className="h-4 w-4 text-electric-blue" />
                <Select
                    value={activeAgencyId || 'all'}
                    onValueChange={(value) => setActiveAgencyId(value === 'all' ? null : value)}
                >
                    <SelectTrigger className="w-[180px] h-7 border-none bg-transparent shadow-none p-0 focus:ring-0 text-xs font-bold font-mono uppercase tracking-wider text-pure-black dark:text-off-white">
                        <SelectValue placeholder="Matriz Global" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-elevation-lg backdrop-blur-xl bg-white/90 dark:bg-black/90 min-w-[240px]">
                        <SelectItem value="all" className="rounded-xl py-3 font-bold text-xs">
                            <div className="flex items-center justify-between w-full gap-8">
                                <span>Todas as Agências</span>
                                <span className="text-[10px] text-muted-foreground bg-black/5 px-2 py-0.5 rounded-lg">{team.length} sellers</span>
                            </div>
                        </SelectItem>
                        <div className="h-px bg-black/5 dark:bg-white/5 my-1" />
                        {agencies.map((agency) => {
                            const agencySellers = team.filter(m => m.agencyId === agency.id).length
                            return (
                                <SelectItem key={agency.id} value={agency.id} className="rounded-xl py-3 font-bold text-xs">
                                    <div className="flex items-center justify-between w-full gap-8">
                                        <span>{agency.name}</span>
                                        <span className="text-[10px] text-muted-foreground bg-black/5 px-2 py-0.5 rounded-lg">{agencySellers} sellers</span>
                                    </div>
                                </SelectItem>
                            )
                        })}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
