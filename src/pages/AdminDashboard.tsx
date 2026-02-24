import { useMemo } from 'react'
import {
    Activity,
    Building2,
    Users,
    TrendingUp,
    ShieldCheck,
    Globe,
    Zap,
    ArrowUpRight,
    ArrowDownRight,
    Search
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { Badge } from '@/components/ui/badge'
import { adminSystemPerformance, adminAgencyRanks, mockAuditLogs } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import useAppStore from '@/stores/main'

export default function AdminDashboard() {
    const { agencies, team, leads } = useAppStore()

    const globalStats = useMemo(() => {
        const totalRevenue = adminSystemPerformance[adminSystemPerformance.length - 1].revenue
        const revenueTrend = 19.9 // Mock trend comparing current month to prev
        const totalAgencies = agencies.length
        const totalUsers = team.length
        const totalLeads = leads.length

        return {
            revenue: totalRevenue,
            revenueTrend,
            agencies: totalAgencies,
            users: totalUsers,
            leads: totalLeads
        }
    }, [agencies, team, leads])

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val)
    }

    return (
        <div className="space-y-8 max-w-[1400px] mx-auto pb-12 text-white min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-electric-blue shadow-[0_0_12px_var(--electric-blue)] animate-pulse"></div>
                        <span className="text-[9px] font-black tracking-[0.4em] text-electric-blue uppercase">Central de Comando</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-[-0.03em] leading-none mb-2">
                        Visão <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-teal-400">Omnisciente</span>.
                    </h1>
                    <p className="text-muted-foreground font-medium text-sm md:text-base max-w-xl">
                        Monitoramento em tempo real da performance global de todas as operações e agências associadas ao ecossistema.
                    </p>
                </div>

                <div className="flex flex-col items-start md:items-end gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-72 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-electric-blue transition-colors" />
                        <Input
                            placeholder="Buscar agência, usuário ou transação..."
                            className="pl-10 h-12 bg-white/5 border-white/10 text-white rounded-2xl focus-visible:ring-1 focus-visible:ring-electric-blue transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Global KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <GlobalKpiCard
                    title="Receita Global (Mês)"
                    value={formatCurrency(globalStats.revenue)}
                    trend={globalStats.revenueTrend}
                    icon={<Globe className="w-5 h-5 text-electric-blue" />}
                    highlight
                />
                <GlobalKpiCard
                    title="Agências Ativas"
                    value={globalStats.agencies.toString()}
                    trend={5.2}
                    icon={<Building2 className="w-5 h-5 text-teal-400" />}
                />
                <GlobalKpiCard
                    title="Volume de Leads"
                    value={globalStats.leads.toString()}
                    trend={12.4}
                    icon={<Zap className="w-5 h-5 text-amber-400" />}
                />
                <GlobalKpiCard
                    title="Times Operacionais"
                    value={globalStats.users.toString()}
                    trend={2.1}
                    icon={<Users className="w-5 h-5 text-indigo-400" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Performance Chart */}
                <Card className="lg:col-span-2 border-white/10 bg-black/80 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <CardHeader className="pb-2 border-b border-white/5 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                <Activity className="w-4 h-4 text-electric-blue" />
                                Ecossistema Financeiro
                            </CardTitle>
                            <CardDescription className="text-white/50 text-xs mt-1">Evolução de receita agregada das agências</CardDescription>
                        </div>
                        <Badge variant="outline" className="border-white/10 bg-white/5 text-white/70 font-mono text-[10px]">ULT. 6 MESES</Badge>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <ChartContainer config={{ revenue: { label: 'Receita', color: 'var(--electric-blue)' } }}>
                            <div className="h-[320px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={adminSystemPerformance} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#2563EB" stopOpacity={0.5} />
                                                <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} dy={10} />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                                            tickFormatter={(val) => `R$${(val / 1000000).toFixed(1)}M`}
                                            width={60}
                                        />
                                        <Tooltip
                                            content={<ChartTooltipContent
                                                formatter={(val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val)}
                                            />}
                                            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                                        />
                                        <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" animationDuration={1500} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Top Agencies */}
                <Card className="border-white/10 bg-black/80 backdrop-blur-xl rounded-[2rem] shadow-2xl flex flex-col">
                    <CardHeader className="pb-4 border-b border-white/5">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-white/80 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-400" /> Top Agências
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 flex-1 flex flex-col gap-4">
                        {adminAgencyRanks.map((agency, i) => (
                            <motion.div
                                key={agency.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shadow-inner",
                                        i === 0 ? "bg-amber-500/20 text-amber-500 border border-amber-500/30" :
                                            i === 1 ? "bg-slate-300/20 text-slate-300 border border-slate-300/30" :
                                                i === 2 ? "bg-amber-700/20 text-amber-600 border border-amber-700/30" :
                                                    "bg-white/5 text-white/50"
                                    )}>
                                        #{i + 1}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white leading-tight">{agency.name}</p>
                                        <p className="text-[10px] text-white/50 font-mono mt-0.5">{formatCurrency(agency.revenue)}</p>
                                    </div>
                                </div>
                                <Badge variant="secondary" className={cn(
                                    "font-mono text-[10px] border-none",
                                    agency.growth > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-mars-orange/10 text-mars-orange"
                                )}>
                                    {agency.growth > 0 ? '+' : ''}{agency.growth}%
                                </Badge>
                            </motion.div>
                        ))}
                    </CardContent>
                </Card>

                {/* Security & Audit Feed */}
                <Card className="lg:col-span-3 border-white/10 bg-black/80 backdrop-blur-xl rounded-[2rem] shadow-2xl">
                    <CardHeader className="pb-4 border-b border-white/5 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-white/80 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-indigo-400" /> Log de Auditoria Global
                        </CardTitle>
                        <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 font-mono text-[10px] animate-pulse">
                            MONITORAMENTO ATIVO
                        </Badge>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {mockAuditLogs.map((log) => (
                                <div key={log.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">{log.date}</span>
                                        <Badge variant="secondary" className="bg-white/5 text-white/60 hover:bg-white/10 border-none text-[9px] h-5">
                                            {log.user}
                                        </Badge>
                                    </div>
                                    <h4 className="text-sm font-bold text-white mb-1">{log.action}</h4>
                                    <p className="text-xs text-white/50 leading-relaxed line-clamp-2">{log.detail}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function GlobalKpiCard({ title, value, trend, icon, highlight = false }: {
    title: string; value: string; trend: number; icon: React.ReactNode; highlight?: boolean
}) {
    const isPositive = trend >= 0
    return (
        <Card className={cn(
            'border-white/10 backdrop-blur-xl rounded-[2rem] overflow-hidden relative group transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl',
            highlight ? 'bg-gradient-to-br from-electric-blue/10 to-black ring-1 ring-inset ring-electric-blue/30' : 'bg-black/80'
        )}>
            {highlight && <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-electric-blue to-transparent opacity-50" />}

            <CardContent className="p-6 flex flex-col h-full z-10 relative">
                <div className="flex justify-between items-start mb-6">
                    <div className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110",
                        highlight ? "bg-electric-blue/20 shadow-[0_0_15px_rgba(37,99,235,0.3)]" : "bg-white/5"
                    )}>
                        {icon}
                    </div>
                    <div className={cn(
                        "flex items-center text-[10px] font-bold px-2 py-1 rounded-lg backdrop-blur-md",
                        isPositive ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" : "text-mars-orange bg-mars-orange/10 border border-mars-orange/20"
                    )}>
                        {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                        {Math.abs(trend)}%
                    </div>
                </div>

                <div className="mt-auto">
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">{title}</p>
                    <h3 className="text-3xl font-extrabold tracking-tighter text-white font-mono">{value}</h3>
                </div>
            </CardContent>
        </Card>
    )
}
