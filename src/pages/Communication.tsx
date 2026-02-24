import { useState } from 'react'
import { MessageSquare, Send, CheckCircle2, FileText, Bot } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'

export default function Communication() {
    const [autoConfirm, setAutoConfirm] = useState(true)
    const [dailyReport, setDailyReport] = useState(true)

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        toast({ title: 'Copiado para a área de transferência', description: 'O template está pronto para ser colado no WhatsApp.' })
    }

    const templates = [
        { label: 'Recuperação de No-Show', color: 'mars-orange', text: 'Olá [Nome], tivemos um imprevisto e não nos encontramos hoje. O [Carro] continua aqui reservado. Podemos remarcar para amanhã?' },
        { label: 'Follow-up de Proposta', color: 'electric-blue', text: 'Oi [Nome], consegui uma condição especial na aprovação com a gerência que vale até amanhã. Me dá um retorno para eu segurar o negócio?' },
        { label: 'Pós-Venda / Elogio', color: 'green-500', text: 'Parabéns pela conquista, [Nome]! Que o novo carro traga muitas alegrias. Conta comigo pro que precisar!' },
    ]

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-green-500"></div><span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">COMMUNICATION HUB</span></div>
                <h1 className="text-4xl font-extrabold tracking-tight text-pure-black dark:text-off-white">Automações & <span className="text-green-500">Mensagens</span></h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="hyper-glass border-[0.5px] border-white/40 dark:border-white/10 rounded-3xl">
                    <CardHeader className="pb-6 border-b border-black/5 dark:border-white/5">
                        <div className="flex items-center gap-3"><div className="p-2.5 bg-green-500/10 rounded-xl"><Bot className="h-5 w-5 text-green-600 dark:text-green-500" /></div>
                            <div><CardTitle className="text-xl font-extrabold text-pure-black dark:text-off-white">Workflows Automáticos</CardTitle><CardDescription className="font-semibold text-muted-foreground mt-1">Gatilhos do sistema vinculados ao WhatsApp.</CardDescription></div></div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="flex items-center justify-between p-5 bg-white/60 dark:bg-black/40 rounded-2xl border border-white/30 dark:border-white/10 shadow-sm">
                            <div className="space-y-1.5 pr-4"><Label className="font-extrabold text-base text-pure-black dark:text-off-white">Confirmação Automática de Visita</Label><p className="text-xs font-semibold text-muted-foreground">Envia mensagem 1h antes do horário agendado com link de localização.</p></div>
                            <Switch checked={autoConfirm} onCheckedChange={setAutoConfirm} className="data-[state=checked]:bg-green-500" />
                        </div>
                        <div className="flex items-center justify-between p-5 bg-white/60 dark:bg-black/40 rounded-2xl border border-white/30 dark:border-white/10 shadow-sm">
                            <div className="space-y-1.5 pr-4"><Label className="font-extrabold text-base text-pure-black dark:text-off-white">Relatório Diário via WhatsApp</Label><p className="text-xs font-semibold text-muted-foreground">Envia o resumo de visitas e funil para o Gerente da Loja no início do dia.</p></div>
                            <Switch checked={dailyReport} onCheckedChange={setDailyReport} className="data-[state=checked]:bg-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <div className="space-y-6">
                    <h3 className="text-xl font-extrabold text-pure-black dark:text-off-white mb-2">Templates de Mensagem Baseados em Cenário</h3>
                    {templates.map((t) => (
                        <Card key={t.label} className="border-none bg-white dark:bg-[#111] shadow-sm rounded-3xl overflow-hidden">
                            <CardContent className="p-5">
                                <div className="flex justify-between items-center mb-3">
                                    <Badge variant="outline" className={`font-bold border-${t.color}/30 text-${t.color} bg-${t.color}/10`}>{t.label}</Badge>
                                    <Button variant="ghost" size="sm" onClick={() => handleCopy(t.text)} className="h-8 px-3 font-bold text-xs rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20"><FileText className="w-3 h-3 mr-2" /> Copiar</Button>
                                </div>
                                <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl text-sm font-medium text-muted-foreground italic border border-black/5 dark:border-white/5">"{t.text}"</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
