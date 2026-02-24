import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard, Filter, CalendarDays, Car, Users, Settings,
    BarChart3, Wallet, PieChart, CheckSquare, Presentation, Target,
    Activity, FileSignature, BookOpen, MessageSquare, Bot, LogOut, User as UserIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useAuth, Role } from '@/components/auth-provider'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useAppStore from '@/stores/main'

export const navItems = [
    { title: 'Painel', path: '/dashboard', icon: LayoutDashboard },
    { title: 'Matinal', path: '/relatorio-matinal', icon: Presentation },
    { title: 'Metas', path: '/metas', icon: Target },
    { title: 'Tarefas', path: '/tarefas', icon: CheckSquare },
    { title: 'Leads', path: '/leads', icon: Users },
    { title: 'Funil', path: '/funnel', icon: Filter },
    { title: 'Agenda', path: '/agenda', icon: CalendarDays },
    { title: 'Estoque', path: '/inventory', icon: Car },
    { title: 'Financeiro', path: '/financeiro', icon: Wallet },
    { title: 'Perf. Vendas', path: '/relatorios/performance-vendas', icon: PieChart },
    { title: 'Vendas Cruzadas', path: '/relatorios/vendas-cruzados', icon: Activity },
    { title: 'Perf. Vendedores', path: '/relatorios/performance-vendedores', icon: Presentation },
    { title: 'Relatórios', path: '/reports/stock', icon: BarChart3 },
    { title: 'Equipe', path: '/team', icon: Users },
    { title: 'Comissões', path: '/configuracoes/comissoes', icon: FileSignature },
    { title: 'Treinamento', path: '/training', icon: BookOpen },
    { title: 'Comunicação', path: '/communication', icon: MessageSquare },
    { title: 'IA Analyst', path: '/ia-diagnostics', icon: Bot },
    { title: 'Configurações', path: '/settings', icon: Settings, mobileHidden: true },
]

const roleTranslations: Record<Role, string> = {
    Owner: 'Dono', Manager: 'Gestor', Seller: 'Vendedor', RH: 'RH', Admin: 'Admin',
}

export function Navigation() {
    const location = useLocation()
    const navigate = useNavigate()
    const isMobile = useIsMobile()
    const { role, user, signOut } = useAuth()
    const { permissions } = useAppStore()

    const filteredNavItems = navItems.filter((item) => {
        if (role === 'Admin') return true
        const allowedPaths = permissions[role] || []
        return allowedPaths.includes(item.path)
    })

    if (isMobile) {
        return (
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t pb-safe">
                <div className="flex justify-around items-center h-16 px-2 overflow-x-auto no-scrollbar">
                    {filteredNavItems.filter((item) => !item.mobileHidden).map((item) => {
                        const isActive = location.pathname.startsWith(item.path)
                        const Icon = item.icon
                        return (
                            <Link key={item.path} to={item.path}
                                className={cn('flex flex-col items-center justify-center min-w-[70px] h-full space-y-1 transition-all duration-200 shrink-0 px-2',
                                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground')}>
                                <Icon className={cn('h-5 w-5', isActive && 'text-primary')} />
                                <span className="text-[10px] font-medium text-center leading-tight truncate w-full">{item.title}</span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div className="w-64 bg-background border-r flex flex-col h-screen fixed left-0 top-0 z-50">
            <div className="h-16 flex items-center px-6 border-b">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                        <Car className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold leading-none">AutoGestão</span>
                        <span className="text-[10px] text-muted-foreground uppercase mt-0.5">Flux Control</span>
                    </div>
                </div>
            </div>
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-4 pb-4">
                {filteredNavItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path)
                    const Icon = item.icon
                    return (
                        <Link key={item.path} to={item.path}
                            className={cn('flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group text-sm font-medium',
                                isActive ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
                            <Icon className={cn('h-4 w-4', isActive ? 'text-foreground' : 'text-muted-foreground')} />
                            {item.title}
                        </Link>
                    )
                })}
            </nav>
            <div className="p-4 mt-auto shrink-0 border-t">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                            <Avatar className="w-9 h-9">
                                {user?.user_metadata?.avatar_url && (
                                    <AvatarImage src={user.user_metadata.avatar_url} />
                                )}
                                <AvatarFallback>
                                    {user?.email?.[0].toUpperCase() || 'A'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-medium leading-tight truncate">
                                    {user?.user_metadata?.full_name || 'Alex Gerente'}
                                </span>
                                <span className="text-xs text-muted-foreground">{roleTranslations[role]}</span>
                            </div>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="right" className="w-56 mb-2 ml-2">
                        <DropdownMenuLabel className="font-normal text-xs text-muted-foreground uppercase tracking-wider p-2">
                            Minha Conta
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => navigate('/settings')}
                            className="cursor-pointer"
                        >
                            <UserIcon className="w-4 h-4 mr-2" />
                            <span>Meu Perfil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigate('/settings')}
                            className="cursor-pointer"
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            <span>Configurações</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => signOut()}
                            className="cursor-pointer text-destructive focus:text-destructive"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            <span>Sair do Sistema</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
