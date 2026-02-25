import { useMemo } from 'react'
import {
    ArrowUpRight,
    Settings2,
    Filter,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import useAppStore from '@/stores/main'

export default function Dashboard() {
    // System Data
    const { leads = [], team = [], inventory = [], goals = [] } = useAppStore()

    const stats = useMemo(() => {
        if (!team || !inventory) return { totalSales: 0, avgAging: 0, stockValue: 0, projection: 0 }
        const totalSales = team.reduce((acc, t) => acc + (t.sales || 0), 0)
        const avgAging = inventory.length > 0 ? Math.round(inventory.reduce((acc, i) => acc + (i.agingDays || 0), 0) / inventory.length) : 0
        const stockValue = inventory.reduce((acc, i) => acc + (i.price || 0), 0)

        const daysPassed = Math.max(new Date().getDate(), 1)
        const totalDays = 30
        const projection = (totalSales / daysPassed) * totalDays

        return { totalSales, avgAging, stockValue, projection }
    }, [team, inventory])

    const teamGoal = goals.find((g) => g.type === 'Equipe')?.amount || 25
    const progress = teamGoal > 0 ? Math.min((stats.totalSales / teamGoal) * 100, 100) : 0

    const evolutionData = [
        { day: '01', vendas: 1 },
        { day: '05', vendas: 3 },
        { day: '10', vendas: 7 },
        { day: '15', vendas: 12 },
        { day: '20', vendas: 15 },
        { day: '25', vendas: 18 },
    ]

    const funnelData = [
        { label: 'Leads', percentage: 100 },
        { label: 'Contato', percentage: 75 },
        { label: 'Agend.', percentage: 40 },
        { label: 'Visita', percentage: 25 },
        { label: 'Venda', percentage: 10 },
    ]

    return (
        <div className="max-w-[1600px] mx-auto pb-12 font-sans px-2 md:px-0">
            {/* Header Section from screenshot */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10 pt-4 px-2">
                <div className="max-w-4xl">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-mars-orange"></div>
                        <span className="text-[10px] font-bold tracking-[0.2em] text-pure-black dark:text-white uppercase">VERSÃO DE AVALIAÇÃO</span>
                    </div>
                    <h1 className="text-5xl md:text-[64px] font-black tracking-tight text-pure-black dark:text-white leading-[1.1] mb-6">
                        Sintetizando fluidez <span className="text-electric-blue">orgânica</span> com rigidez <span className="text-mars-orange">digital.</span>
                    </h1>
                    <div className="flex flex-wrap items-center gap-3">
                        <Badge variant="outline" className="rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest border-black/10 dark:border-white/10 text-pure-black dark:text-white bg-white dark:bg-black">
                            VERSÃO 2024
                        </Badge>
                        <Button variant="outline" className="rounded-full px-4 py-2 h-auto text-[10px] font-bold uppercase tracking-widest border-black/10 dark:border-white/10 text-pure-black dark:text-white bg-white dark:bg-black hover:bg-black/5 dark:hover:bg-white/5 shadow-sm">
                            <Settings2 className="w-3.5 h-3.5 mr-2" /> PERSONALIZAR DASHBOARD
                        </Button>
                    </div>
                </div>
                <div className="text-right hidden lg:block pt-2">
                    <div className="flex items-center justify-end gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-electric-blue"></div>
                        <span className="text-[10px] font-bold tracking-[0.2em] text-pure-black dark:text-white uppercase">PRÉVIA AO VIVO</span>
                    </div>
                    <h2 className="text-[32px] font-black text-pure-black dark:text-white leading-[1.1]">
                        Harmonia<br />entre<br /><span className="text-electric-blue">forma</span> e<br />função.
                    </h2>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* KPI 1 */}
                <Card className="border border-black/5 dark:border-white/5 shadow-sm rounded-3xl bg-white dark:bg-pure-black hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6">
                        <p className="text-[10px] font-black text-pure-black/80 dark:text-white/80 uppercase tracking-widest mb-4">Progresso da Meta (Equipe)</p>
                        <div className="flex items-end gap-3 mb-3">
                            <span className="text-4xl font-extrabold text-pure-black dark:text-white tracking-tight">{progress.toFixed(1)}%</span>
                            <span className="text-[10px] font-bold text-pure-black/60 dark:text-white/60 mb-1 leading-tight">{stats.totalSales} de {teamGoal}<br />vendas</span>
                        </div>
                        <Progress value={progress} className="h-2.5 bg-black/5 dark:bg-white/10 [&>div]:bg-electric-blue rounded-full" />
                    </CardContent>
                </Card>

                {/* KPI 2 */}
                <Card className="border border-black/5 dark:border-white/5 shadow-sm rounded-3xl bg-white dark:bg-pure-black hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6 flex flex-col justify-between h-full">
                        <p className="text-[10px] font-black text-pure-black/80 dark:text-white/80 uppercase tracking-widest mb-4">Novos Leads</p>
                        <div className="flex items-center justify-between mt-auto">
                            <span className="text-4xl font-extrabold text-pure-black dark:text-white tracking-tight">{leads.length || 142}</span>
                            <div className="flex items-center gap-1 bg-electric-blue/10 text-electric-blue px-2 py-1 rounded-lg text-xs font-bold">
                                <ArrowUpRight className="w-3 h-3" /> 12
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* KPI 3 */}
                <Card className="border border-black/5 dark:border-white/5 shadow-sm rounded-3xl bg-white dark:bg-pure-black hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6 flex flex-col justify-between h-full">
                        <p className="text-[10px] font-black text-pure-black/80 dark:text-white/80 uppercase tracking-widest mb-4">Vendas do Mês</p>
                        <div className="flex items-center justify-between mt-auto">
                            <span className="text-4xl font-extrabold text-pure-black dark:text-white tracking-tight">{stats.totalSales || 18}</span>
                            <div className="flex items-center gap-1 bg-electric-blue/10 text-electric-blue px-2 py-1 rounded-lg text-xs font-bold">
                                <ArrowUpRight className="w-3 h-3" /> 15
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* KPI 4 */}
                <Card className="border border-black/5 dark:border-white/5 shadow-sm rounded-3xl bg-white dark:bg-pure-black hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6 flex flex-col justify-between h-full">
                        <p className="text-[10px] font-black text-pure-black/80 dark:text-white/80 uppercase tracking-widest mb-4">Projeção (Mês)</p>
                        <div className="flex items-center justify-between mt-auto">
                            <span className="text-4xl font-extrabold text-pure-black dark:text-white tracking-tight">{Math.round(stats.projection) || 36}</span>
                            <div className="flex items-center gap-1 bg-electric-blue/10 text-electric-blue px-2 py-1 rounded-lg text-xs font-bold">
                                <ArrowUpRight className="w-3 h-3" /> 12
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Evolução de Vendas Chart */}
                <Card className="border border-black/5 dark:border-white/5 shadow-sm rounded-3xl bg-white dark:bg-pure-black lg:col-span-2 flex flex-col hover:shadow-md transition-shadow duration-300 overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-sm font-extrabold text-pure-black dark:text-white tracking-tight">Evolução de Vendas</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 flex-1 min-h-[350px]">
                        <ChartContainer config={{ vendas: { label: 'Vendas', color: 'var(--electric-blue)' } }}>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={evolutionData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.5} />
                                            <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#888888', fontSize: 10, fontWeight: 700 }} dy={15} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888888', fontSize: 10, fontWeight: 700 }} dx={-10} />
                                    <Tooltip content={<ChartTooltipContent />} />
                                    <CartesianGrid vertical={false} stroke="#000000" strokeDasharray="3 3" opacity={0.05} />
                                    <Area type="monotone" dataKey="vendas" stroke="#2563EB" strokeWidth={4} fillOpacity={1} fill="url(#colorVendas)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Mapa de Vazamentos Chart */}
                <Card className="border border-black/5 dark:border-white/5 shadow-sm rounded-3xl bg-white dark:bg-pure-black lg:col-span-1 hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="p-8 pb-6">
                        <CardTitle className="text-[10px] font-extrabold uppercase tracking-widest text-pure-black dark:text-white flex items-center gap-2">
                            <Filter className="w-4 h-4 text-mars-orange" /> Mapa de Vazamentos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-2 flex flex-col justify-center gap-6 pb-12">
                        {funnelData.map(item => (
                            <div key={item.label} className="flex items-center gap-4">
                                <span className="w-[50px] text-[10px] font-bold text-pure-black/80 dark:text-white/80 text-right shrink-0">{item.label}</span>
                                <div className="flex-1">
                                    <div className="h-6 bg-mars-orange rounded-sm transition-all duration-500" style={{ width: `${item.percentage}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
