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
            <div className="fixed bottom-0 left-0 right-0 z-50 hyper-glass border-t-0 rounded-t-3xl pb-safe shadow-[0_-8px_32px_rgba(0,0,0,0.04)]">
                <div className="flex justify-around items-center h-20 px-2 overflow-x-auto no-scrollbar">
                    {filteredNavItems.filter((item) => !item.mobileHidden).map((item) => {
                        const isActive = location.pathname.startsWith(item.path)
                        const Icon = item.icon
                        return (
                            <Link key={item.path} to={item.path}
                                className={cn('flex flex-col items-center justify-center min-w-[70px] h-full space-y-1 transition-all duration-300 rounded-2xl shrink-0 px-2',
                                    isActive ? 'text-electric-blue bg-electric-blue/10 scale-105' : 'text-muted-foreground hover:text-pure-black dark:hover:text-off-white')}>
                                <Icon className={cn('h-5 w-5', isActive && 'fill-electric-blue/20')} />
                                <span className="text-[9px] font-bold tracking-wide text-center leading-tight truncate w-full">{item.title}</span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div className="w-64 bg-porcelain dark:bg-pure-black border-r border-black/5 dark:border-white/5 flex flex-col h-screen fixed left-0 top-0 z-50">
            <div className="h-24 flex items-center px-6 border-b border-black/5 dark:border-white/5 bg-transparent">
                <div className="flex items-center gap-3 text-pure-black dark:text-off-white w-full">
                    <div className="w-8 h-8 rounded-[10px] bg-electric-blue flex items-center justify-center text-white shadow-lg shadow-electric-blue/20">
                        <Car className="h-5 w-5" />
                    </div>
                    <span className="text-2xl font-black tracking-tight mt-0.5 text-pure-black dark:text-white">AutoPerf</span>
                </div>
            </div>
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-4 pb-4">
                {filteredNavItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path)
                    const Icon = item.icon
                    return (
                        <Link key={item.path} to={item.path}
                            className={cn('flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-300 group font-bold text-sm',
                                isActive ? 'bg-white dark:bg-white/10 text-electric-blue shadow-sm border border-black/5 dark:border-white/5' : 'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-pure-black dark:hover:text-off-white')}>
                            <Icon className={cn('h-4 w-4 transition-transform group-hover:scale-110', isActive ? 'text-electric-blue fill-electric-blue/10' : 'text-muted-foreground')} />
                            {item.title}
                        </Link>
                    )
                })}
            </nav>
            <div className="p-6 mt-auto shrink-0">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-md cursor-pointer hover:bg-white dark:hover:bg-white/10 transition-colors shadow-sm group">
                            <Avatar className="w-10 h-10 border-2 border-white dark:border-pure-black shadow-sm group-hover:scale-105 transition-transform">
                                {user?.user_metadata?.avatar_url && (
                                    <AvatarImage src={user.user_metadata.avatar_url} />
                                )}
                                <AvatarFallback className="bg-electric-blue text-white font-bold">
                                    {user?.email?.[0].toUpperCase() || 'A'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-bold text-pure-black dark:text-off-white leading-tight truncate">
                                    {user?.user_metadata?.full_name || 'Alex Gerente'}
                                </span>
                                <span className="text-[10px] font-bold text-electric-blue uppercase tracking-wider">{roleTranslations[role]}</span>
                            </div>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="right" className="w-56 mb-4 ml-2 rounded-2xl border-black/5 dark:border-white/5 hyper-glass">
                        <DropdownMenuLabel className="font-extrabold text-xs text-muted-foreground uppercase tracking-widest p-3">
                            Minha Conta
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-black/5 dark:bg-white/5" />
                        <DropdownMenuItem
                            onClick={() => navigate('/settings')}
                            className="flex items-center gap-2 p-3 rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:bg-black/5 dark:focus:bg-white/5"
                        >
                            <UserIcon className="w-4 h-4 text-electric-blue" />
                            <span className="font-bold text-sm">Meu Perfil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigate('/settings')}
                            className="flex items-center gap-2 p-3 rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:bg-black/5 dark:focus:bg-white/5"
                        >
                            <Settings className="w-4 h-4 text-electric-blue" />
                            <span className="font-bold text-sm">Configurações</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-black/5 dark:bg-white/5" />
                        <DropdownMenuItem
                            onClick={() => signOut()}
                            className="flex items-center gap-2 p-3 rounded-xl cursor-pointer hover:bg-mars-orange/10 transition-colors focus:bg-mars-orange/10 text-mars-orange"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="font-bold text-sm">Sair do Sistema</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>


        </div>
    )
}
