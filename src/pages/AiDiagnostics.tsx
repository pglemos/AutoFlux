import { useState } from 'react'
import { Bot, Sparkles, ClipboardList, ShieldAlert, ArrowRight, Thermometer, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { mockAuditLogs } from '@/lib/mock-data'
import useAppStore from '@/stores/main'
import { cn } from '@/lib/utils'

export default function AiDiagnostics() {
    const { team } = useAppStore()
    const [isGenerating, setIsGenerating] = useState(false)
    const [diagnostic, setDiagnostic] = useState<{ text: string; actions: string[]; message: string } | null>(null)
    const [selectedSeller, setSelectedSeller] = useState('team')

    const generateDiagnostic = () => {
        setIsGenerating(true)
        setTimeout(() => {
            setDiagnostic({
                text: 'A equipe apresenta uma taxa de conversão saudável em visitas, mas há um acúmulo de leads "Sem Contato" no início do funil (gargalo de D0). A margem média está 2% abaixo da meta estipulada.',
                actions: [
                    'Redistribuir leads estagnados há mais de 48h para a equipe de SDR.',
                    'Revisar a política de descontos no fechamento para proteger a margem mínima.',
                ],
                message: 'Olá [Nome], vi que você demonstrou interesse no [Carro] ontem mas não conseguimos nos falar. Ele acabou de entrar em uma condição especial válida até amanhã. Qual o melhor horário para eu te ligar hoje?',
            })
            setIsGenerating(false)
            toast({ title: 'Diagnóstico Gerado', description: 'O AI Sales Analyst concluiu a análise.' })
        }, 1500)
    }

    const copyMessage = () => {
        if (diagnostic) {
            navigator.clipboard.writeText(diagnostic.message)
            toast({ title: 'Copiado para a área de transferência', description: 'A mensagem está pronta para uso.' })
        }
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-electric-blue"></div>
                    <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">INTELIGÊNCIA ARTIFICIAL</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-pure-black dark:text-off-white">Sales <span className="text-electric-blue">Analyst</span></h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <Card className="hyper-glass border-[0.5px] border-white/40 dark:border-white/10 rounded-3xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-electric-blue/10 rounded-full blur-[60px] pointer-events-none -mt-32 -mr-32"></div>
                        <CardHeader className="pb-6 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-electric-blue/10 rounded-xl"><Bot className="h-5 w-5 text-electric-blue" /></div>
                                    <div>
                                        <CardTitle className="text-xl font-extrabold text-pure-black dark:text-off-white">Motor de Diagnóstico</CardTitle>
                                        <CardDescription className="font-semibold text-muted-foreground mt-1">Prompt Mestre de análise comportamental e funil.</CardDescription>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="font-mono-numbers bg-black/5 dark:bg-white/10 text-muted-foreground border-none"><Thermometer className="w-3 h-3 mr-1" /> Temp: 0.3</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10 space-y-6">
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Alvo da Análise</label>
                                <div className="flex gap-3">
                                    <Select value={selectedSeller} onValueChange={setSelectedSeller}>
                                        <SelectTrigger className="w-full rounded-xl bg-white/50 dark:bg-black/50 border-white/20 font-bold h-12"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="team">Visão Geral (Equipe)</SelectItem>
                                            {team.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <Button onClick={generateDiagnostic} disabled={isGenerating} className="h-12 px-6 rounded-xl font-bold bg-pure-black text-white hover:bg-pure-black/80 dark:bg-white dark:text-pure-black shadow-elevation shrink-0 transition-transform active:scale-95">
                                        {isGenerating ? <span className="animate-pulse flex items-center gap-2">Analisando...</span> : <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Gerar</span>}
                                    </Button>
                                </div>
                            </div>
                            {diagnostic && (
                                <div className="p-5 bg-white/60 dark:bg-black/60 border border-white/30 dark:border-white/10 rounded-2xl shadow-sm animate-fade-in space-y-5">
                                    <div><h4 className="text-[10px] font-bold uppercase tracking-widest text-electric-blue mb-2">1. Diagnóstico</h4><p className="text-sm font-semibold text-pure-black dark:text-off-white leading-relaxed">{diagnostic.text}</p></div>
                                    <div><h4 className="text-[10px] font-bold uppercase tracking-widest text-electric-blue mb-2">2. Ações Prioritárias</h4>
                                        <ul className="space-y-2">{diagnostic.actions.map((act, i) => (<li key={i} className="flex items-start gap-2 text-sm font-semibold text-pure-black dark:text-off-white"><ArrowRight className="w-4 h-4 text-electric-blue shrink-0 mt-0.5" /><span>{act}</span></li>))}</ul></div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-electric-blue">3. Mensagem Sugerida</h4>
                                            <Button variant="ghost" size="sm" onClick={copyMessage} className="h-6 px-2 text-[10px] font-bold rounded-md bg-electric-blue/10 text-electric-blue hover:bg-electric-blue/20"><FileText className="w-3 h-3 mr-1" /> Copiar</Button>
                                        </div>
                                        <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl text-sm font-medium text-muted-foreground italic border border-black/5 dark:border-white/5">"{diagnostic.message}"</div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card className="border-none bg-white dark:bg-[#111] shadow-sm rounded-3xl overflow-hidden h-full flex flex-col">
                        <CardHeader className="border-b border-black/5 dark:border-white/5 pb-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-mars-orange/10 rounded-xl"><ClipboardList className="h-5 w-5 text-mars-orange" /></div>
                                <div>
                                    <CardTitle className="text-lg font-extrabold text-pure-black dark:text-off-white">Trilha de Auditoria (Data Audit)</CardTitle>
                                    <CardDescription className="font-semibold text-muted-foreground mt-1">Prevenção contra manipulação de KPIs e burla de regras.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <div className="overflow-x-auto flex-1">
                            <Table>
                                <TableHeader className="bg-black/5 dark:bg-white/5 border-none">
                                    <TableRow className="hover:bg-transparent border-none">
                                        <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 text-pure-black dark:text-off-white pl-6">Data/Hora</TableHead>
                                        <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 text-pure-black dark:text-off-white">Usuário</TableHead>
                                        <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 text-pure-black dark:text-off-white pr-6">Ação Registrada</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockAuditLogs.map((log, index) => (
                                        <TableRow key={log.id} className={cn('hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-none', index % 2 === 0 ? 'bg-transparent' : 'bg-black/[0.02] dark:bg-white/[0.02]')}>
                                            <TableCell className="font-bold text-xs text-muted-foreground py-4 pl-6 whitespace-nowrap">{log.date}</TableCell>
                                            <TableCell className="font-extrabold text-sm text-pure-black dark:text-off-white py-4 whitespace-nowrap">{log.user}</TableCell>
                                            <TableCell className="py-4 pr-6">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {log.action.includes('Bloqueado') || log.action.includes('Alerta') ? <ShieldAlert className="w-3.5 h-3.5 text-mars-orange shrink-0" /> : <div className="w-1.5 h-1.5 rounded-full bg-electric-blue shrink-0"></div>}
                                                    <span className={cn('font-bold text-xs', log.action.includes('Bloqueado') || log.action.includes('Alerta') ? 'text-mars-orange' : 'text-pure-black dark:text-off-white')}>{log.action}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground font-medium leading-tight">{log.detail}</p>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
