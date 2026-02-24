import { useState, useMemo, useCallback } from 'react'
import AdminDashboard from './AdminDashboard'
import {
    ArrowUpRight,
    ArrowDownRight,
    Trash2,
    Settings2,
    Filter,
    Settings,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { chartData } from '@/lib/mock-data'

export default function Dashboard() {
    const { role } = useAuth()
    console.log('Dashboard rendering, role:', role)
    const { leads, team, inventory, goals, activeAgencyId, auditLogs } = useAppStore()
    const [isEditing, setIsEditing] = useState(false)
    const [dashboardWidgets, setDashboardWidgets] = useState<string[]>([
        'kpi-metas',
        'kpi-leads',
        'kpi-vendas',
        'kpi-projecao',
        'kpi-estoque',
        'chart-vendas',
        'ranking-vendedores'
    ])

    // Conditionally render the premium Admin Dashboard
    if (role === 'Admin') {
        return <AdminDashboard />
    }

    const stats = useMemo(() => {
        const totalSales = team.reduce((acc, t) => acc + (t.sales || 0), 0)
        const avgAging = inventory.length > 0 ? Math.round(inventory.reduce((acc, i) => acc + (i.agingDays || 0), 0) / inventory.length) : 0
        const stockValue = inventory.reduce((acc, i) => acc + (i.price || 0), 0)

        // Simple Run-rate: (current sales / days passed) * total days in month
        const daysPassed = Math.max(new Date().getDate(), 1)
        const totalDays = 30
        const projection = (totalSales / daysPassed) * totalDays

        return { totalSales, avgAging, stockValue, projection }
    }, [team, inventory])

    const ALL_WIDGETS = [
        { id: 'kpi-metas', type: 'kpi-progress', title: 'Progresso da Meta (Equipe)' },
        { id: 'kpi-leads', type: 'kpi', title: 'Novos Leads', value: leads.length, trend: 12 },
        { id: 'kpi-vendas', type: 'kpi', title: 'Vendas do Mês', value: stats.totalSales, trend: 8, highlight: true },
        { id: 'kpi-projecao', type: 'kpi', title: 'Projeção (Mês)', value: Math.round(stats.projection), trend: 5, highlight: true },
        { id: 'kpi-estoque', type: 'kpi', title: 'Valor em Estoque', value: `R$ ${(stats.stockValue / 1000000).toFixed(1)}M`, trend: 2.1 },
        { id: 'kpi-aging', type: 'kpi', title: 'Aging Médio', value: stats.avgAging, trend: -5, reverseColor: true },
        { id: 'chart-vendas', type: 'chart' },
        { id: 'chart-funnel-leak', type: 'chart-leak' },
        { id: 'ranking-vendedores', type: 'ranking' },
    ]

    const filteredTeam = useMemo(() => {
        if (!activeAgencyId) return team
        return team.filter(m => m.agencyId === activeAgencyId)
    }, [team, activeAgencyId])

    const toggleWidget = (id: string) => {
        if (dashboardWidgets.includes(id)) {
            setDashboardWidgets(prev => prev.filter(w => w !== id))
        } else {
            setDashboardWidgets(prev => [...prev, id])
        }
    }

    const funnelLeakData = useMemo(() => [
        { stage: 'Sem Contato', value: leads.filter(l => l.stage === 'Lead').length },
        { stage: 'Agendamento', value: leads.filter(l => l.stage === 'Agendamento').length },
        { stage: 'Visita', value: leads.filter(l => l.stage === 'Visita').length },
        { stage: 'Proposta', value: leads.filter(l => l.stage === 'Proposta').length },
    ], [leads])

    const renderWidget = useCallback((id: string) => {
        const widget = ALL_WIDGETS.find((w) => w.id === id)
        if (!widget) return null

        const commonRemoveBtn = isEditing && (
            <Button size="icon" variant="destructive" className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-100 z-10 shadow-lg" onClick={() => toggleWidget(id)}>
                <Trash2 className="w-3 h-3" />
            </Button>
        )

        if (widget.type === 'kpi-progress') {
            const teamGoal = goals.find((g) => g.type === 'Equipe')?.amount || 25
            const currentSales = stats.totalSales
            const progress = teamGoal > 0 ? Math.min((currentSales / teamGoal) * 100, 100) : 0
            return (
                <div key={id} className="relative group">
                    <Card className="border-none shadow-sm transition-all duration-300 hover:shadow-md h-full bg-white dark:bg-black rounded-3xl">
                        <CardContent className="p-4 flex flex-col justify-between h-full">
                            <p className="text-[9px] font-bold text-muted-foreground mb-2 uppercase tracking-widest truncate">{widget.title}</p>
                            <div className="mt-auto flex flex-col gap-2">
                                <div className="flex items-end justify-between gap-2">
                                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-pure-black dark:text-off-white font-mono-numbers">{progress.toFixed(1)}%</h3>
                                    <span className="text-[10px] font-bold text-muted-foreground">{currentSales} de {teamGoal} vdas</span>
                                </div>
                                <Progress value={progress} className="h-2 bg-black/5 dark:bg-white/10 [&>div]:bg-electric-blue rounded-full" />
                            </div>
                        </CardContent>
                    </Card>
                    {commonRemoveBtn}
                </div>
            )
        }

        if (widget.type === 'kpi') {
            return (
                <div key={id} className="relative group">
                    <KpiCard title={widget.title!} value={widget.value!} trend={widget.trend!} isPercentage={widget.id === 'kpi-metas'} reverseColor={widget.reverseColor} highlight={widget.highlight} />
                    {commonRemoveBtn}
                </div>
            )
        }

        if (widget.type === 'chart') {
            return (
                <div key={id} className="relative group lg:col-span-2">
                    <Card className="hyper-glass border-[0.5px] border-white/40 dark:border-white/10 rounded-3xl flex flex-col h-full bg-white dark:bg-black/50 overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-pure-black dark:text-off-white">Evolução de Vendas</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-[250px]">
                            <ChartContainer config={{ vendas: { label: 'Vendas', color: 'var(--electric-blue)' } }}>
                                <ResponsiveContainer width="100%" height={250}>
                                    <AreaChart data={chartData}>
                                        <XAxis dataKey="day" hide />
                                        <YAxis hide />
                                        <Tooltip content={<ChartTooltipContent />} />
                                        <Area type="monotone" dataKey="vendas" stroke="#2563EB" strokeWidth={3} fill="#2563EB20" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                    {commonRemoveBtn}
                </div>
            )
        }

        if (widget.type === 'chart-leak') {
            return (
                <div key={id} className="relative group lg:col-span-1">
                    <Card className="hyper-glass border-[0.5px] border-white/40 dark:border-white/10 rounded-3xl flex flex-col h-full bg-white dark:bg-black/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Filter className="w-3 h-3 text-mars-orange" /> Mapa de Vazamentos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ChartContainer config={{ value: { label: 'Leads', color: '#FF4500' } }}>
                                <ResponsiveContainer width="100%" height={180}>
                                    <BarChart data={funnelLeakData} layout="vertical">
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="stage" type="category" hide />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#FF4500" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                    {commonRemoveBtn}
                </div>
            )
        }

        if (widget.type === 'ranking') {
            return (
                <div key={id} className="relative group lg:col-span-1">
                    <Card className="hyper-glass border-[0.5px] border-white/40 dark:border-white/10 rounded-3xl h-full bg-white dark:bg-black/50">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ranking</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[...filteredTeam].sort((a, b) => b.sales - a.sales).slice(0, 3).map((t, i) => (
                                <div key={t.id} className="flex justify-between items-center bg-black/5 dark:bg-white/5 p-2 rounded-xl">
                                    <span className="text-xs font-bold text-pure-black dark:text-off-white">{i + 1}º {t.name}</span>
                                    <Badge variant="outline" className="text-[10px] border-none font-bold text-electric-blue">{t.sales}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    {commonRemoveBtn}
                </div>
            )
        }

        return null
    }, [isEditing, dashboardWidgets, filteredTeam, stats, goals, funnelLeakData])

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-electric-blue"></div>
                        <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">SISTEMA OPERACIONAL FLUX</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-pure-black dark:text-off-white">
                        Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-cyan-500">Estratégica</span>
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant={isEditing ? 'default' : 'outline'} size="sm" onClick={() => setIsEditing(!isEditing)} className="rounded-xl h-10 px-6 font-bold uppercase tracking-widest text-[10px]">
                        {isEditing ? 'Salvar Dashboard' : 'Customizar'}
                    </Button>
                </div>
            </div>

            {isEditing && (
                <Card className="p-6 bg-electric-blue/5 border-dashed border-2 border-electric-blue/20 rounded-[2rem] mb-8">
                    <h3 className="font-extrabold text-xs uppercase tracking-widest text-electric-blue mb-4">Adicionar Widgets</h3>
                    <div className="flex flex-wrap gap-4">
                        {ALL_WIDGETS.map(w => (
                            <div key={w.id} className="flex items-center gap-2 bg-white dark:bg-black p-3 rounded-2xl border border-black/5 shadow-sm">
                                <Checkbox id={w.id} checked={dashboardWidgets.includes(w.id)} onCheckedChange={() => toggleWidget(w.id)} />
                                <label htmlFor={w.id} className="text-xs font-bold text-pure-black dark:text-off-white cursor-pointer uppercase">{w.title || w.id}</label>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {dashboardWidgets.filter(id => {
                    const w = ALL_WIDGETS.find(x => x.id === id)
                    return w?.type === 'kpi' || w?.type === 'kpi-progress'
                }).map(renderWidget)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardWidgets.filter(id => {
                    const w = ALL_WIDGETS.find(x => x.id === id)
                    return w?.type !== 'kpi' && w?.type !== 'kpi-progress'
                }).map(renderWidget)}
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
        <Card className={cn('border-none shadow-sm transition-all duration-300 hover:shadow-md h-full rounded-[1.5rem]', highlight ? 'bg-electric-blue/[0.03] dark:bg-electric-blue/10 ring-1 ring-inset ring-electric-blue/20' : 'bg-white dark:bg-black')}>
            <CardContent className="p-4 flex flex-col justify-between h-full">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2 opacity-70">{title}</p>
                <div className="flex items-end justify-between gap-2 mt-auto">
                    <h3 className="text-2xl font-extrabold text-pure-black dark:text-off-white tracking-tighter">{value}{isPercentage ? '%' : ''}</h3>
                    <div className={cn('flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0', showGood ? 'text-electric-blue bg-electric-blue/10' : 'text-mars-orange bg-mars-orange/10')}>
                        {isPositiveTrend ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                        {Math.abs(trend)}%
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
