import { useState } from 'react'
import {
    Target,
    Plus,
    Trash2,
    Users,
    User,
    TrendingUp,
    CheckCircle2,
    BarChart3,
    ArrowUpRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import useAppStore from '@/stores/main'
import { cn } from '@/lib/utils'

export default function GoalManagement({ standalone = true }: { standalone?: boolean }) {
    const { goals, setGoal, deleteGoal, team } = useAppStore()
    const [type, setType] = useState<'Equipe' | 'Individual'>('Equipe')
    const [targetId, setTargetId] = useState('')
    const [amount, setAmount] = useState('')

    const handleSave = () => {
        if (!amount) return
        setGoal({ type, targetId: type === 'Equipe' ? 'team' : targetId, amount: Number(amount) })
        toast({ title: 'Meta Salva', description: `Meta de ${amount} vendas definida com sucesso.` })
        setAmount('')
    }

    // Mock progress calculation for visual demonstration
    const getProgress = (goalId: string) => {
        const hash = goalId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        return (hash % 60) + 30 // Returns a value between 30% and 90%
    }

    const currentStats = [
        { title: 'Meta Global', value: '85%', label: 'Concluído', icon: Target, color: 'text-electric-blue' },
        { title: 'Performance Equipe', value: '+12%', label: 'vs mês anterior', icon: TrendingUp, color: 'text-emerald-500' },
        { title: 'Top Vendedor', value: 'JV', label: '102% da meta', icon: CheckCircle2, color: 'text-amber-500' },
    ]

    return (
        <div className={cn("space-y-8 max-w-7xl mx-auto pb-12", !standalone && "max-w-none pb-0")}>
            {standalone && (
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-electric-blue animate-pulse"></div>
                            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">PERFORMANCE TRACKING</span>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-pure-black dark:text-off-white">Gestão de <span className="text-electric-blue">Metas</span></h1>
                        <p className="text-muted-foreground font-medium mt-1">Defina objetivos claros e acompanhe a evolução em tempo real.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="rounded-xl font-bold h-11 border-black/10 dark:border-white/10 bg-white dark:bg-pure-black">
                            <BarChart3 className="w-4 h-4 mr-2" /> Relatório Completo
                        </Button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {currentStats.map((stat) => (
                    <Card key={stat.title} className="border-none shadow-sm bg-white dark:bg-pure-black rounded-3xl overflow-hidden relative group">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className={cn("p-3 rounded-2xl bg-black/5 dark:bg-white/5", stat.color)}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.title}</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-2xl font-extrabold text-pure-black dark:text-off-white font-mono-numbers">{stat.value}</h3>
                                    <span className="text-[10px] font-bold text-muted-foreground">{stat.label}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-xl bg-white dark:bg-pure-black rounded-3xl overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-extrabold text-pure-black dark:text-off-white flex items-center gap-2">
                                <Plus className="w-5 h-5 text-electric-blue" /> Nova Meta
                            </CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Configuração de objetivo mensal</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-4 space-y-6">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground dark:text-off-white">Tipo de Meta</Label>
                                <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded-xl">
                                    <Button
                                        variant={type === 'Equipe' ? 'default' : 'ghost'}
                                        onClick={() => setType('Equipe')}
                                        className={cn("flex-1 rounded-lg font-bold text-xs h-9", type === 'Equipe' ? "bg-white dark:bg-pure-black text-pure-black dark:text-off-white shadow-sm" : "text-muted-foreground")}
                                    >
                                        <Users className="w-3.5 h-3.5 mr-2" /> Equipe
                                    </Button>
                                    <Button
                                        variant={type === 'Individual' ? 'default' : 'ghost'}
                                        onClick={() => setType('Individual')}
                                        className={cn("flex-1 rounded-lg font-bold text-xs h-9", type === 'Individual' ? "bg-white dark:bg-pure-black text-pure-black dark:text-off-white shadow-sm" : "text-muted-foreground")}
                                    >
                                        <User className="w-3.5 h-3.5 mr-2" /> Individual
                                    </Button>
                                </div>
                            </div>

                            {type === 'Individual' && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground dark:text-off-white">Selecionar Vendedor</Label>
                                    <Select value={targetId} onValueChange={setTargetId}>
                                        <SelectTrigger className="h-11 rounded-xl bg-black/5 dark:bg-white/5 border-none font-bold">
                                            <SelectValue placeholder="Escolha um vendededor..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            {team.map((t) => (
                                                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground dark:text-off-white">Objetivo (Vendas)</Label>
                                <div className="relative">
                                    <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="Ex: 25"
                                        className="pl-10 h-11 rounded-xl bg-black/5 dark:bg-white/5 border-none font-extrabold focus-visible:ring-electric-blue"
                                    />
                                </div>
                            </div>

                            <Button onClick={handleSave} disabled={!amount} className="w-full h-11 rounded-xl font-bold bg-electric-blue text-white shadow-lg hover:bg-electric-blue/90 transition-all active:scale-95">
                                Definir Objetivo
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-gradient-to-br from-electric-blue to-blue-700 rounded-3xl p-6 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <h4 className="text-lg font-extrabold mb-1">Dica de Performance</h4>
                        <p className="text-xs font-medium opacity-80 leading-relaxed">Vendedores com metas individuais claras tendem a converter 24% mais leads do que aqueles com metas apenas globais.</p>
                        <ArrowUpRight className="absolute bottom-4 right-4 w-6 h-6 opacity-40" />
                    </Card>
                </div>

                <div className="lg:col-span-8">
                    <Card className="border-none bg-white dark:bg-pure-black shadow-xl rounded-3xl overflow-hidden min-h-[500px] flex flex-col">
                        <CardHeader className="p-8 border-b border-black/5 dark:border-white/5 flex flex-row items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]">
                            <div>
                                <CardTitle className="text-xl font-extrabold text-pure-black dark:text-off-white">Metas Ativas</CardTitle>
                                <CardDescription className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Monitoramento de progresso real</CardDescription>
                            </div>
                            <Badge variant="outline" className="rounded-lg border-black/10 dark:border-white/10 font-bold px-3 py-1">Março 2024</Badge>
                        </CardHeader>
                        <CardContent className="p-0 flex-1">
                            <div className="divide-y divide-black/5 dark:divide-white/5">
                                {goals.map((g) => {
                                    const progress = getProgress(g.id)
                                    const current = Math.round((progress / 100) * g.amount)
                                    return (
                                        <div key={g.id} className="p-8 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", g.type === 'Equipe' ? "bg-electric-blue/10 text-electric-blue" : "bg-amber-500/10 text-amber-500")}>
                                                        {g.type === 'Equipe' ? <Users className="w-6 h-6" /> : <User className="w-6 h-6" />}
                                                    </div>
                                                    <div>
                                                        <h5 className="font-extrabold text-lg text-pure-black dark:text-off-white">
                                                            {g.type === 'Equipe' ? 'Toda Equipe' : team.find((t) => t.id === g.targetId)?.name || g.targetId}
                                                        </h5>
                                                        <Badge variant="secondary" className="text-[8px] font-extrabold uppercase bg-black/5 dark:bg-white/5">{g.type}</Badge>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" onClick={() => { deleteGoal(g.id); toast({ title: 'Meta removida' }) }} className="h-8 w-8 rounded-lg hover:bg-mars-orange/10 hover:text-mars-orange">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex justify-between text-xs font-bold mb-1">
                                                    <span className="text-muted-foreground">Progresso: <span className="text-pure-black dark:text-off-white font-mono-numbers">{current} / {g.amount}</span></span>
                                                    <span className={cn(progress > 70 ? "text-emerald-500" : "text-electric-blue", "font-mono-numbers")}>{progress}%</span>
                                                </div>
                                                <div className="relative h-2.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn("h-full transition-all duration-1000", progress > 70 ? "bg-emerald-500" : "bg-electric-blue")}
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                                {goals.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-24 text-muted-foreground animate-in fade-in duration-500">
                                        <Target className="w-16 h-16 mb-4 opacity-10" />
                                        <p className="font-bold text-sm">Nenhuma meta ativa para este período.</p>
                                        <p className="text-xs font-medium">Use o painel lateral para criar o primeiro objetivo.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

