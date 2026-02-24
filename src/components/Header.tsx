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
import { mockNotifications } from '@/lib/mock-data'
import { useState } from 'react'
import useAppStore from '@/stores/main'

export function Header() {
    const isMobile = useIsMobile()
    const [open, setOpen] = useState(false)
    const [activity, setActivity] = useState('')
    const { addTask } = useAppStore()

    const handleQuickLog = () => {
        toast({
            title: 'Atividade Registrada',
            description: 'O log da atividade foi salvo com sucesso.',
        })
        setOpen(false)
    }

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-6">
                <div className="flex items-center flex-1 gap-4">
                    {isMobile && (
                        <div className="flex flex-col">
                            <span className="text-lg font-bold leading-none">AutoGestão</span>
                        </div>
                    )}
                    <div className="relative max-w-md w-full hidden sm:block">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Buscar..."
                            className="w-full bg-background pl-9 md:w-[300px] lg:w-[400px]"
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
                                className="relative"
                            >
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-destructive animate-pulse"></span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-80"
                        >
                            <div className="font-semibold text-sm p-2 mb-2 border-b">
                                Notificações
                            </div>
                            {mockNotifications.map((n) => (
                                <DropdownMenuItem
                                    key={n.id}
                                    className="flex flex-col items-start p-2 cursor-pointer gap-1"
                                >
                                    <div className="flex items-center gap-2 w-full">
                                        <div className="w-2 h-2 rounded-full bg-destructive shrink-0"></div>
                                        <span className="font-medium text-sm">
                                            {n.title}
                                        </span>
                                    </div>
                                    <span className="text-xs text-muted-foreground ml-4 leading-tight">
                                        {n.description}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground ml-4 mt-1 font-medium uppercase">
                                        {n.time}
                                    </span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="hidden sm:flex" size="sm">
                                <Zap className="w-3.5 h-3.5 mr-2" /> Ação Rápida
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>
                                    Registro de Atividade
                                </DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label>Lead / Cliente</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o lead" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="l1">
                                                Carlos Silva - Porsche 911
                                            </SelectItem>
                                            <SelectItem value="l2">Ana Oliveira - BMW X5</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Tipo de Atividade</Label>
                                    <Select value={activity} onValueChange={setActivity}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="O que aconteceu?" />
                                        </SelectTrigger>
                                        <SelectContent>
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
                                >
                                    Salvar
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </header>
    )
}
