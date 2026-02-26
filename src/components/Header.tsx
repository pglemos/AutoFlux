import { Bell, Search, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useIsMobile } from '@/hooks/use-mobile'
import { AgencySelector } from './AgencySelector'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/hooks/use-toast'
import { useNotifications } from '@/hooks/use-notifications'
import { useState } from 'react'
import useAppStore from '@/stores/main'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/auth-provider'

export function Header() {
    const isMobile = useIsMobile()
    const [open, setOpen] = useState(false)
    const [activity, setActivity] = useState('')
    const { leads = [] } = useAppStore()
    const { user } = useAuth()
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
    const [selectedLeadId, setSelectedLeadId] = useState('')

    const handleQuickLog = async () => {
        if (!activity || !user) return

        const leadName = leads.find(l => l.id === selectedLeadId)?.name || 'Lead Desconhecido'
        const actions: Record<string, string> = {
            call: 'Tentativa de Contato',
            schedule: 'Retorno Agendado',
            visit_done: 'Visita Realizada',
            proposal: 'Proposta Enviada'
        }

        const { error } = await supabase.from('audit_logs').insert({
            user_id: user.id,
            action: actions[activity],
            details: `Ação registrada para o lead ${leadName} via Quick Log.`
        })

        if (!error) {
            toast({
                title: 'Atividade Registrada',
                description: 'O log da atividade foi salvo com sucesso (SLA < 10s).',
            })
            setOpen(false)
            setActivity('')
            setSelectedLeadId('')
        } else {
            toast({
                title: 'Erro ao registrar',
                description: 'Não foi possível salvar a atividade.',
                variant: 'destructive'
            })
        }
    }

    return (
        <header className="h-16 hyper-glass sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 transition-all border-b-0 sm:rounded-b-3xl sm:mx-2 sm:mt-2 shadow-sm">
            <div className="flex items-center flex-1 gap-4">
                {isMobile && (
                    <div className="flex flex-col">
                        <span className="text-lg font-black leading-none">AutoPerf</span>
                        <span className="text-[8px] font-bold text-electric-blue tracking-widest uppercase">Perf</span>
                    </div>
                )}
                <div className="relative max-w-md w-full hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Buscar leads, clientes, estoque..."
                        className="w-full bg-white/50 dark:bg-black/50 border-white/20 pl-10 focus-visible:ring-electric-blue rounded-full shadow-inner h-10 transition-all hover:bg-white/80 dark:hover:bg-black/80"
                    />
                </div>
                {!isMobile && <AgencySelector />}
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative rounded-full hover:bg-white/50 dark:hover:bg-black/50"
                        >
                            <Bell className="h-5 w-5 text-pure-black dark:text-off-white" />
                            {unreadCount > 0 && <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-mars-orange animate-pulse"></span>}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-80 rounded-2xl p-2 bg-white/90 dark:bg-black/90 backdrop-blur-xl"
                    >
                        <div className="flex justify-between items-center p-2 mb-2 border-b border-black/5 dark:border-white/5">
                            <span className="font-extrabold text-sm text-pure-black dark:text-off-white">
                                Central de Notificações
                            </span>
                            {unreadCount > 0 && (
                                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-6 px-2 text-[10px] font-bold text-electric-blue hover:bg-electric-blue/10">
                                    Marcar Lidas
                                </Button>
                            )}
                        </div>
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-xs font-bold text-muted-foreground">
                                Nenhuma notificação.
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <DropdownMenuItem
                                    key={n.id}
                                    onClick={() => markAsRead(n.id)}
                                    className={`flex flex-col items-start p-3 rounded-xl cursor-pointer gap-1 focus:bg-black/5 dark:focus:bg-white/5 ${n.is_read ? 'opacity-60 hover:bg-transparent' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                                >
                                    <div className="flex items-center gap-2 w-full">
                                        {!n.is_read && <div className="w-2 h-2 rounded-full bg-mars-orange shrink-0"></div>}
                                        <span className="font-bold text-sm text-pure-black dark:text-off-white">
                                            {n.title}
                                        </span>
                                    </div>
                                    <span className="text-xs text-muted-foreground ml-4 leading-tight">
                                        {n.description}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground ml-4 mt-1 font-bold uppercase tracking-widest">
                                        {n.time_label || new Date(n.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </DropdownMenuItem>
                            ))
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="hidden sm:flex bg-[#0F172A] dark:bg-[#94785C] text-white hover:opacity-90 rounded-full px-6 shadow-2xl transition-all hover:scale-105 active:scale-95 duration-200 font-black text-[10px] uppercase tracking-widest border border-white/10">
                            <Zap className="w-3.5 h-3.5 mr-2" /> Ação Estratégica
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>
                                Registro de Atividade (Ação Rápida)
                            </DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Lead / Cliente</Label>
                                <Select value={selectedLeadId} onValueChange={setSelectedLeadId}>
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue placeholder="Selecione o lead" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {leads.map(lead => (
                                            <SelectItem key={lead.id} value={lead.id}>
                                                {lead.name} - {lead.car}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Tipo de Atividade</Label>
                                <Select value={activity} onValueChange={setActivity}>
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue placeholder="O que aconteceu?" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="call">Tentativa de Contato</SelectItem>
                                        <SelectItem value="schedule">Retorno Agendado</SelectItem>
                                        <SelectItem value="visit_done">Visita Realizada</SelectItem>
                                        <SelectItem value="proposal">Proposta Enviada</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                onClick={handleQuickLog}
                                disabled={!activity}
                                className="w-full rounded-xl bg-pure-black text-white hover:bg-pure-black/80 dark:bg-white dark:text-pure-black font-bold"
                            >
                                Salvar Atividade
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </header>
    )
}
