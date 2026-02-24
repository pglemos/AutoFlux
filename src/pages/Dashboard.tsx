import { useState, useMemo } from 'react'
import AdminDashboard from './AdminDashboard'
import {
    ArrowUpRight,
    ArrowDownRight,
    Trash2,
    Settings2,
    Filter,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mockKPIs, chartData } from '@/lib/mock-data'
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import useAppStore from '@/stores/main'
import { useAuth } from '@/components/auth-provider'

const funnelLeakData = [
    { stage: 'Leads', value: 142 },
    { stage: 'Contato', value: 110 },
    { stage: 'Agend.', value: 48 },
    { stage: 'Visita', value: 32 },
    { stage: 'Venda', value: 18 },
]

const ALL_WIDGETS = [
    { id: 'kpi-metas', type: 'kpi-progress', title: 'Progresso da Meta (Equipe)' },
    { id: 'kpi-leads', type: 'kpi', title: 'Novos Leads', value: mockKPIs.leads.current, trend: mockKPIs.leads.trend },
    { id: 'kpi-vendas', type: 'kpi', title: 'Vendas do Mês', value: mockKPIs.vendas.current, trend: mockKPIs.vendas.trend, highlight: true },
    { id: 'kpi-projecao', type: 'kpi', title: 'Projeção (Mês)', value: mockKPIs.projecao.provavel, trend: 12, highlight: true },
    { id: 'kpi-estoque', type: 'kpi', title: 'Valor Total em Estoque', value: 'R$ 3.38M', trend: 5.2, isPercentage: true },
    { id: 'kpi-aging', type: 'kpi', title: 'Aging Médio', value: '46', trend: -12, isPercentage: true, reverseColor: true },
    { id: 'chart-vendas', type: 'chart' },
    { id: 'chart-funnel-leak', type: 'chart-leak' },
    { id: 'ranking-vendedores', type: 'ranking' },
]

export default function Dashboard() {
    const { role } = useAuth()
    const { dashboardWidgets, setDashboardWidgets, goals, team, leads, activeAgencyId } = useAppStore()
    const [isEditing, setIsEditing] = useState(false)

    // Conditionally render the premium Admin Dashboard
    if (role === 'Admin') {
        return <AdminDashboard />
    }

    // Filter data based on active agency (if Owner)
    const filteredLeads = useMemo(() => {
        if ((role as string) !== 'Admin' || !activeAgencyId) return leads
        return leads.filter(l => l.agencyId === activeAgencyId)
    }, [leads, activeAgencyId, role])

    const filteredTeam = useMemo(() => {
        if ((role as string) !== 'Admin' || !activeAgencyId) return team
        return team.filter(m => m.agencyId === activeAgencyId)
    }, [team, activeAgencyId, role])

    const toggleWidget = (id: string) => {
        if (dashboardWidgets.includes(id))
            setDashboardWidgets(dashboardWidgets.filter((w) => w !== id))
        else setDashboardWidgets([...dashboardWidgets, id])
    }

    const renderWidget = (id: string) => {
        const widget = ALL_WIDGETS.find((w) => w.id === id)
        if (!widget) return null

        if (widget.type === 'kpi-progress') {
            const teamGoal = goals.find((g) => g.type === 'Equipe')?.amount || 25
            const currentSales = team.reduce((acc, t) => acc + t.sales, 0)
            const progress = teamGoal > 0 ? Math.min((currentSales / teamGoal) * 100, 100) : 0
            return (
                <div key={id} className="relative group">
                    <Card className="border-none shadow-sm transition-all duration-300 hover:shadow-md h-full bg-white dark:bg-black rounded-3xl">
                        <CardContent className="p-4 flex flex-col justify-between h-full">
                            <p className="text-[9px] font-bold text-muted-foreground mb-2 uppercase tracking-widest truncate">{widget.title}</p>
                            <div className="mt-auto flex flex-col gap-2">
                                <div className="flex items-end justify-between gap-2">
                                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-pure-black dark:text-off-white font-mono-numbers">{progress.toFixed(1)}%</h3>
                                    <span className="text-[10px] font-bold text-muted-foreground">{currentSales} de {teamGoal} vendas</span>
                                </div>
                                <Progress value={progress} className="h-2 bg-black/5 dark:bg-white/10 [&>div]:bg-electric-blue rounded-full" />
                            </div>
                        </CardContent>
                    </Card>
                    {isEditing && (
                        <Button size="icon" variant="destructive" className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-100 z-10 shadow-lg" onClick={() => toggleWidget(id)}>
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    )}
                </div>
            )
        }

        if (widget.type === 'kpi') {
            return (
                <div key={id} className="relative group">
                    <KpiCard title={widget.title!} value={widget.value!} trend={widget.trend!} isPercentage={widget.isPercentage} reverseColor={widget.reverseColor} highlight={widget.highlight} />
                    {isEditing && (
                        <Button size="icon" variant="destructive" className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-100 z-10 shadow-lg" onClick={() => toggleWidget(id)}>
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    )}
                </div>
            )
        }

        if (widget.type === 'chart') {
            return (
                <div key={id} className="relative group lg:col-span-2">
                    <Card className="hyper-glass border-[0.5px] border-white/40 dark:border-white/10 rounded-3xl flex flex-col h-full">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-extrabold text-pure-black dark:text-off-white">Evolução de Vendas</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ChartContainer config={{ vendas: { label: 'Vendas', color: 'var(--electric-blue)' } }}>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }} fontSize={12} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }} fontSize={12} />
                                            <Tooltip content={<ChartTooltipContent />} />
                                            <Area type="monotone" dataKey="vendas" stroke="#2563EB" strokeWidth={4} fillOpacity={1} fill="url(#colorVendas)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                    {isEditing && (
                        <Button size="icon" variant="destructive" className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-100 z-10 shadow-lg" onClick={() => toggleWidget(id)}>
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    )}
                </div>
            )
        }

        if (widget.type === 'chart-leak') {
            return (
                <div key={id} className="relative group lg:col-span-1">
                    <Card className="hyper-glass border-[0.5px] border-white/40 dark:border-white/10 rounded-3xl flex flex-col h-full">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-pure-black dark:text-off-white flex items-center gap-2">
                                <Filter className="w-4 h-4 text-mars-orange" /> Mapa de Vazamentos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-[250px]">
                            <ChartContainer config={{ value: { label: 'Volume', color: 'var(--mars-orange)' } }}>
                                <div className="h-full w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={funnelLeakData} layout="vertical" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontWeight: 600, fontSize: 10 }} width={60} />
                                            <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'var(--muted)', opacity: 0.2 }} />
                                            <Bar dataKey="value" fill="#FF4500" radius={[0, 4, 4, 0]} barSize={24} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                    {isEditing && (
                        <Button size="icon" variant="destructive" className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-100 z-10 shadow-lg" onClick={() => toggleWidget(id)}>
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    )}
                </div>
            )
        }

        if (widget.type === 'ranking') {
            return (
                <div key={id} className="relative group lg:col-span-1">
                    <Card className="hyper-glass border-[0.5px] border-white/40 dark:border-white/10 rounded-3xl h-full">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-pure-black dark:text-off-white">Ranking de Vendedores</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[...filteredTeam].sort((a, b) => b.sales - a.sales).slice(0, 3).map((t, i) => (
                                <div key={t.id} className="flex justify-between items-center bg-white/40 dark:bg-black/40 p-3 rounded-2xl border border-white/20">
                                    <div className="flex items-center gap-3">
                                        <span className="font-extrabold text-muted-foreground">{i + 1}º</span>
                                        <span className="font-bold text-sm text-pure-black dark:text-off-white">{t.name}</span>
                                    </div>
                                    <Badge variant="secondary" className="font-mono-numbers bg-electric-blue/10 text-electric-blue border-none">{t.sales}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    {isEditing && (
                        <Button size="icon" variant="destructive" className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-100 z-10 shadow-lg" onClick={() => toggleWidget(id)}>
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    )}
                </div>
            )
        }
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#94785C] shadow-[0_0_8px_#94785C]"></div>
                        <span className="text-[9px] font-black tracking-[0.3em] text-[#94785C] uppercase">Terminal de Estratégia</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-pure-black dark:text-off-white leading-[1.1]">
                        Sintetizando fluidez <span className="text-electric-blue">orgânica</span> com rigidez <span className="text-mars-orange">digital</span>.
                        <div className="flex items-center gap-4 mt-8 opacity-40 grayscale group hover:grayscale-0 transition-all duration-500">
                            <div className="h-[1px] w-8 bg-black/20 dark:bg-white/20"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">LUZ DIREÇÃO CONSULTORIA</span>
                        </div>
                    </h1>
                    <div className="flex flex-wrap gap-3 mt-6">
                        <Badge variant="outline" className="rounded-lg font-mono text-[10px] uppercase text-muted-foreground bg-white/50 dark:bg-black/50 border-[0.5px] px-3 py-1 font-bold">
                            VERSÃO 2094
                        </Badge>
                        <Button variant={isEditing ? 'default' : 'outline'} size="sm" onClick={() => setIsEditing(!isEditing)}
                            className={cn('rounded-lg h-7 text-[10px] font-bold uppercase tracking-widest transition-all', isEditing ? 'bg-electric-blue text-white' : 'bg-white/50 dark:bg-black/50')}>
                            <Settings2 className="w-3 h-3 mr-2" /> {isEditing ? 'Concluir Edição' : 'Personalizar Dashboard'}
                        </Button>
                    </div>
                </div>

                {isEditing ? (
                    <Card className="p-5 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-[0.5px] border-electric-blue/30 rounded-3xl w-full max-w-sm shadow-xl">
                        <h3 className="font-extrabold text-sm mb-4 text-pure-black dark:text-off-white">Biblioteca de Widgets</h3>
                        <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                            {ALL_WIDGETS.map((w) => (
                                <div key={w.id} className="flex items-center space-x-3 bg-white/50 dark:bg-black/50 p-2.5 rounded-xl border border-white/20">
                                    <Checkbox id={`chk-${w.id}`} checked={dashboardWidgets.includes(w.id)} onCheckedChange={() => toggleWidget(w.id)} className="data-[state=checked]:bg-electric-blue" />
                                    <label htmlFor={`chk-${w.id}`} className="text-xs font-bold leading-none cursor-pointer select-none text-pure-black dark:text-off-white">{w.title || w.id}</label>
                                </div>
                            ))}
                        </div>
                    </Card>
                ) : (
                    <div className="flex flex-col items-start md:items-end gap-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-electric-blue"></div>
                            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">PRÉVIA AO VIVO</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight md:text-right text-pure-black dark:text-off-white">
                            Harmonia entre <br /><span className="text-electric-blue">forma</span> e função.
                        </h2>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {dashboardWidgets.filter((id) => { const w = ALL_WIDGETS.find((w) => w.id === id); return w?.type === 'kpi' || w?.type === 'kpi-progress' }).map(renderWidget)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                {dashboardWidgets.filter((id) => { const w = ALL_WIDGETS.find((w) => w.id === id); return w?.type !== 'kpi' && w?.type !== 'kpi-progress' }).map(renderWidget)}
            </div>
        </div>
    )
}

function KpiCard({ title, value, trend, isPercentage, reverseColor = false, highlight = false }: {
    title: string; value: string | number; trend: number; isPercentage?: boolean; reverseColor?: boolean; highlight?: boolean
}) {
    const isPositiveTrend = trend > 0
    const showGood = reverseColor ? !isPositiveTrend : isPositiveTrend
    return (
        <Card className={cn('border-none shadow-sm transition-all duration-300 hover:shadow-md h-full', highlight ? 'bg-electric-blue/[0.03] dark:bg-electric-blue/10 ring-1 ring-inset ring-electric-blue/20' : 'bg-white dark:bg-black', 'rounded-3xl')}>
            <CardContent className="p-4 flex flex-col justify-between h-full">
                <p className="text-[9px] font-bold text-muted-foreground mb-2 uppercase tracking-widest truncate">{title}</p>
                <div className="flex items-end justify-between mt-auto gap-2">
                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-pure-black dark:text-off-white font-mono-numbers">
                        {value}{isPercentage && typeof value === 'number' ? '%' : ''}
                    </h3>
                    <div className={cn('flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0', showGood ? 'text-electric-blue bg-electric-blue/10' : 'text-mars-orange bg-mars-orange/10')}>
                        {isPositiveTrend ? <ArrowUpRight className="h-2.5 w-2.5 mr-0.5" /> : <ArrowDownRight className="h-2.5 w-2.5 mr-0.5" />}
                        {Math.abs(trend)}{isPercentage ? '%' : ''}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
