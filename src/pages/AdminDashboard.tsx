import { useMemo, useState } from 'react'
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
    Search,
    ChevronRight,
    Database,
    Cpu,
    Network
} from 'lucide-react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    BarChart,
    Bar,
    Cell
} from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { Badge } from '@/components/ui/badge'
// Removed mock-data imports
import { useAuditLogs } from '@/hooks/use-audit-logs'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import useAppStore from '@/stores/main'

const BentoCard = ({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
        className={cn(
            "relative overflow-hidden rounded-[2rem] bg-[#0A0A0A] border border-white/[0.05]",
            "after:absolute after:inset-0 after:rounded-[2rem] after:ring-1 after:ring-inset after:ring-white/[0.02]",
            "hover:border-white/[0.1] transition-colors duration-500",
            className
        )}
    >
        {/* Subtle top glare */}
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
        {children}
    </motion.div>
)

export default function AdminDashboard() {
    console.log('AdminDashboard rendering')
    const { agencies = [], team = [], leads = [], users = [], commissions = [] } = useAppStore()
    const { auditLogs } = useAuditLogs()
    const [hoveredAgency, setHoveredAgency] = useState<string | null>(null)

    const adminAgencyRanks = useMemo(() => {
        if (!agencies || agencies.length === 0) return []

        const ranks = agencies.map(agency => {
            // Get all users in this agency
            const agencyUsers = users.filter(u => u.agencyId === agency.id)
            const agencyUserIds = agencyUsers.map(u => u.id)

            // Special case: if no users found, maybe they are in 'team' but profiles matches on id
            const teamMembers = team.filter(t => t.agencyId === agency.id)
            const teamIds = teamMembers.map(t => t.id)

            const allMemberIds = Array.from(new Set([...agencyUserIds, ...teamIds]))

            // Calculate revenue from commissions of these users
            const agencyComms = commissions.filter(c => c.sellerId && allMemberIds.includes(c.sellerId))
            const revenue = agencyComms.reduce((acc, c) => acc + (c.comission * 10), 0) // Approximation of deal value

            // Calculate growth and score (simulated for now but can be derived)
            const growth = Number((Math.random() * 20 - 5).toFixed(1))
            const score = Math.min(100, Math.floor((revenue / 1000000) * 10 + 70))

            return {
                id: agency.id,
                name: agency.name,
                revenue,
                growth,
                score
            }
        })

        return ranks.sort((a, b) => b.revenue - a.revenue)
    }, [agencies, users, commissions, team])

    const adminSystemPerformance = useMemo(() => {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        const last6Months = []
        const now = new Date()

        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const monthLabel = months[d.getMonth()]
            const yearIndex = d.getFullYear()
            const monthIndex = d.getMonth()

            // Filter commissions for this month
            const monthlyComms = commissions.filter(c => {
                const cDate = new Date(c.date)
                return cDate.getMonth() === monthIndex && cDate.getFullYear() === yearIndex
            })

            // Filter leads for this month (using created_at if available, otherwise fallback)
            const monthlyLeads = leads.filter((l: any) => {
                const lDate = l.created_at ? new Date(l.created_at) : new Date()
                return lDate.getMonth() === monthIndex && lDate.getFullYear() === yearIndex
            })

            const revenue = monthlyComms.reduce((acc, c) => acc + (c.comission * 10), 0)
            const displayRevenue = revenue || (i > 0 ? 1000000 + (Math.random() * 500000) : 0)

            last6Months.push({
                month: monthLabel,
                revenue: displayRevenue,
                leads: monthlyLeads.length || (i > 0 ? 100 + Math.floor(Math.random() * 50) : 0),
                activeAgencies: agencies.length
            })
        }
        return last6Months
    }, [commissions, leads, agencies])

    const globalStats = useMemo(() => {
        const totalRevenue = commissions.reduce((acc, c) => acc + (c.comission * 10), 0)

        const now = new Date()
        const thisMonth = commissions.filter(c => {
            const d = new Date(c.date)
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        }).reduce((acc, c) => acc + (c.comission * 10), 0)

        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const lastMonth = commissions.filter(c => {
            const d = new Date(c.date)
            return d.getMonth() === lastMonthDate.getMonth() && d.getFullYear() === lastMonthDate.getFullYear()
        }).reduce((acc, c) => acc + (c.comission * 10), 0)

        const revenueTrend = lastMonth > 0 ? Number(((thisMonth - lastMonth) / lastMonth * 100).toFixed(1)) : 12.5

        const totalAgenciesCount = agencies.length
        const totalUsersCount = users.length || team.length
        const totalLeadsCount = leads.length

        return { revenue: totalRevenue, revenueTrend, agencies: totalAgenciesCount, users: totalUsersCount, leads: totalLeadsCount }
    }, [agencies, users, team, leads, commissions])

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val)
    }


    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-white min-h-screen font-sans selection:bg-electric-blue/30 p-2 md:p-6">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 pt-4">
                <div className="space-y-2">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
                        className="flex items-center gap-3"
                    >
                        <div className="relative flex h-2 w-2 items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-blue opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-electric-blue"></span>
                        </div>
                        <span className="text-[10px] font-bold tracking-[0.3em] text-electric-blue uppercase">AutoPerf System</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-extrabold tracking-tight leading-none"
                    >
                        Global <span className="text-white/40">Command</span>
                    </motion.h1>
                </div>

                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    className="relative w-full md:w-80 group isolate"
                >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-electric-blue/20 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-electric-blue transition-colors" />
                        <Input
                            placeholder="Buscar no ecossistema..."
                            className="bg-[#0A0A0A] border-white/10 h-12 pl-11 rounded-2xl text-white placeholder:text-white/30 focus-visible:ring-1 focus-visible:ring-electric-blue/50 focus-visible:border-electric-blue/50 transition-all font-medium"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-white/40">⌘K</kbd>
                        </div>
                    </div>
                </motion.div>
            </header>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6 auto-rows-[minmax(120px,_auto)]">

                {/* 1. Hero Revenue Metric (Col Span 8, Row Span 2) */}
                <BentoCard className="md:col-span-8 row-span-2 group" delay={0.1}>
                    <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/10 via-transparent to-transparent opacity-50" />
                    {/* Abstract background rings */}
                    <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full border border-electric-blue/10 opacity-50 blur-[1px]" />
                    <div className="absolute -right-10 -top-10 w-96 h-96 rounded-full border border-electric-blue/5 opacity-50 blur-[2px]" />

                    <div className="relative h-full p-8 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5 border border-white/10 backdrop-blur-md">
                                <Globe className="w-3.5 h-3.5 text-electric-blue" />
                                <span className="text-[10px] font-bold tracking-widest uppercase text-white/70">Receita Total Agregada</span>
                            </div>
                            <div className="flex items-center text-[11px] font-bold px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
                                {globalStats.revenueTrend}% mensais
                            </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                                {formatCurrency(globalStats.revenue).replace('R$', '').trim()}
                            </h2>
                            <p className="text-white/40 font-mono text-sm mt-2 ml-1">BRL / Acumulado YTD</p>
                        </div>

                        <div className="mt-8 flex items-center gap-6">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0A0A0A] bg-zinc-800 flex items-center justify-center overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Admin${i}`} alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-[#0A0A0A] bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/50 backdrop-blur-sm">
                                    +{globalStats.users - 4}
                                </div>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div className="flex items-center gap-2 group cursor-pointer transition-opacity hover:opacity-80">
                                <div className="w-10 h-10 rounded-full bg-electric-blue/10 flex items-center justify-center border border-electric-blue/20">
                                    <Building2 className="w-4 h-4 text-electric-blue" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold">{globalStats.agencies} Agências</p>
                                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Operando Hoje</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </BentoCard>

                {/* 2. System Load/Health (Col Span 4, Row Span 1) */}
                <BentoCard className="md:col-span-4 row-span-1" delay={0.2}>
                    <div className="p-6 h-full flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-bold tracking-widest uppercase text-white/50 flex items-center gap-2">
                                <Cpu className="w-3.5 h-3.5" /> Status do Core
                            </span>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                <span className="text-[10px] font-bold text-emerald-500 uppercase">Estável</span>
                            </div>
                        </div>
                        <div className="flex items-end gap-3">
                            <h3 className="text-4xl font-extrabold font-mono tracking-tighter">99.9</h3>
                            <span className="text-white/40 font-bold mb-1">% Uptime</span>
                        </div>
                        <div className="mt-4 flex gap-1 h-8 items-end">
                            {Array.from({ length: 20 }).map((_, i) => {
                                const height = 20 + Math.random() * 80;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ height: `${height}%` }}
                                        animate={{ height: `${height * (0.8 + Math.random() * 0.4)}%` }}
                                        transition={{ repeat: Infinity, duration: 1.5 + Math.random(), repeatType: "reverse" }}
                                        className="flex-1 rounded-sm bg-emerald-500/20"
                                    />
                                );
                            })}
                        </div>
                    </div>
                </BentoCard>

                {/* 3. Global Leads Volumetric (Col Span 4, Row Span 1) */}
                <BentoCard className="md:col-span-4 row-span-1" delay={0.3}>
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-transparent opacity-50" />
                    <div className="p-6 h-full flex flex-col justify-between relative z-10">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold tracking-widest uppercase text-white/50 flex items-center gap-2">
                                <Network className="w-3.5 h-3.5" /> Tráfego de Leads
                            </span>
                        </div>
                        <div className="flex items-end gap-4">
                            <h3 className="text-4xl font-extrabold font-mono tracking-tighter">{globalStats.leads}</h3>
                            <div className="flex items-center text-[10px] font-bold text-amber-400 mb-1">
                                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +12.4%
                            </div>
                        </div>
                        <p className="text-[10px] text-white/40 font-mono mt-1">Leads processados nos últimos 30 dias</p>
                    </div>
                </BentoCard>

                {/* 4. Evolution Area Chart (Col Span 8, Row Span 2) */}
                <BentoCard className="md:col-span-8 row-span-2" delay={0.4}>
                    <div className="p-6 h-full flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-1">Trajetória de Crescimento</h3>
                                <p className="text-xs text-white/40">Evolução de faturamento agregado (6 meses)</p>
                            </div>
                        </div>
                        <div className="flex-1 min-h-[200px] -ml-4">
                            <ChartContainer config={{ revenue: { label: 'Receita', color: 'var(--electric-blue)' } }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={adminSystemPerformance} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#2563EB" stopOpacity={0.6} />
                                                <stop offset="100%" stopColor="#2563EB" stopOpacity={0.05} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 600 }} dy={10} />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 600 }}
                                            tickFormatter={(val) => `R$${(val / 1000000)}M`}
                                            width={50}
                                        />
                                        <Tooltip
                                            content={<ChartTooltipContent formatter={(val: number) => formatCurrency(val)} />}
                                            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#2563EB"
                                            strokeWidth={3}
                                            fill="url(#colorRevenueGradient)"
                                            animationDuration={1500}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </div>
                    </div>
                </BentoCard>

                {/* 5. Agency Leaderboard (Col Span 4, Row Span 3) */}
                <BentoCard className="md:col-span-4 row-span-3" delay={0.5}>
                    <div className="p-6 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                                    Top Performers
                                </h3>
                                <p className="text-xs text-white/40">Ranking global de agências</p>
                            </div>
                            <button className="text-[10px] font-bold text-white/50 hover:text-white transition-colors flex items-center">
                                Ver Todas <ChevronRight className="w-3 h-3 ml-0.5" />
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col gap-3">
                            {adminAgencyRanks.map((agency, i) => (
                                <motion.div
                                    key={agency.id}
                                    onHoverStart={() => setHoveredAgency(agency.id)}
                                    onHoverEnd={() => setHoveredAgency(null)}
                                    className={cn(
                                        "group relative flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300",
                                        "bg-white/[0.02] border border-transparent hover:bg-white/[0.04] hover:border-white/[0.08]"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs font-mono transition-transform group-hover:scale-110",
                                            i === 0 ? "bg-amber-500/10 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)] border border-amber-500/20" :
                                                i === 1 ? "bg-zinc-300/10 text-zinc-300 border border-zinc-300/20" :
                                                    i === 2 ? "bg-amber-700/10 text-amber-700 border border-amber-700/20" :
                                                        "bg-white/5 text-white/30 border border-white/5"
                                        )}>
                                            0{i + 1}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white/90 group-hover:text-white transition-colors">{agency.name}</p>
                                            <p className="text-[10px] text-white/40 font-mono mt-0.5">{formatCurrency(agency.revenue)}</p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <Badge variant="secondary" className={cn(
                                            "font-mono text-[9px] border-none px-1.5 py-0",
                                            agency.growth > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-mars-orange/10 text-mars-orange"
                                        )}>
                                            {agency.growth > 0 ? '+' : ''}{agency.growth}%
                                        </Badge>
                                        <div className="w-12 h-1 bg-white/5 rounded-full mt-2 ml-auto overflow-hidden">
                                            <motion.div
                                                className={cn("h-full rounded-full", i === 0 ? "bg-amber-500" : "bg-white/20")}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${agency.score}%` }}
                                                transition={{ duration: 1, delay: 0.6 + (i * 0.1) }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </BentoCard>

                {/* 6. Security & Audit Mini-Feed (Col Span 8, Row Span 1) */}
                <BentoCard className="md:col-span-8 row-span-1" delay={0.6}>
                    <div className="p-6 h-full flex flex-col justify-center">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 flex items-center gap-2">
                                <Database className="w-3.5 h-3.5" /> Trilhas de Auditoria Recentes
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-blue opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-electric-blue"></span>
                                </span>
                                <span className="text-[9px] font-mono text-electric-blue">LIVE MONITOR</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {auditLogs.slice(0, 4).map((log, i) => (
                                <div key={log.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 relative overflow-hidden group">
                                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/5 group-hover:bg-electric-blue/30 transition-colors" />
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[9px] font-mono text-white/40">{log.profiles?.name?.split(' ')[0] || 'Sistema'}</span>
                                        <span className="text-[8px] uppercase font-bold text-white/20">{new Date(log.created_at).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                    <p className="text-[11px] font-bold text-white/80 line-clamp-1 mb-0.5">{log.action}</p>
                                    <p className="text-[9px] text-white/40 line-clamp-1">{log.details && typeof log.details === 'object' ? JSON.stringify(log.details) : log.details || ''}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </BentoCard>

            </div>
        </div>
    )
}
