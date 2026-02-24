import { useState } from 'react'
import { Send, Clipboard, AlertTriangle, TrendingUp, Users, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import useAppStore from '@/stores/main'

export default function MorningReport() {
    const { team, leads, goals } = useAppStore()
    const [isGenerating, setIsGenerating] = useState(false)
    const [report, setReport] = useState<string | null>(null)

    const generateReport = () => {
        setIsGenerating(true)
        setTimeout(() => {
            const teamGoal = goals.find((g) => g.type === 'Equipe')?.amount || 25
            const totalSales = team.reduce((a, t) => a + t.sales, 0)
            const staleLeads = leads.filter((l) => l.stagnantDays && l.stagnantDays >= 2).length
            const d0Leads = leads.filter((l) => l.stage === 'Lead').length

            setReport(`📊 *RELATÓRIO MATINAL — ${new Date().toLocaleDateString('pt-BR')}*

🎯 *Metas*
• Progresso: ${totalSales}/${teamGoal} vendas (${((totalSales / teamGoal) * 100).toFixed(1)}%)
• Projeção: ${Math.round(totalSales * 1.3)} unidades

👥 *Equipe — Top 3*
${[...team].sort((a, b) => b.sales - a.sales).slice(0, 3).map((t, i) => `  ${i + 1}. ${t.name}: ${t.sales} vendas | Conversão: ${t.conversion}%`).join('\n')}

🚨 *Alertas*
• ${staleLeads} lead(s) estagnados há 48h+
• ${d0Leads} lead(s) aguardando primeiro contato (Sem Contato / D0)

💡 *Recomendação*
• Priorizar ligações de follow-up para leads D0 antes das 10h.
• Redistribuir leads estagnados entre SDRs.`)

            setIsGenerating(false)
            toast({ title: 'Relatório Gerado', description: 'Pronto para compartilhar.' })
        }, 1200)
    }

    const copyReport = () => {
        if (report) {
            navigator.clipboard.writeText(report)
            toast({ title: 'Copiado!', description: 'Relatório pronto para enviar.' })
        }
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-12">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-mars-orange animate-pulse"></div><span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">RELATÓRIO DIÁRIO</span></div>
                <h1 className="text-4xl font-extrabold tracking-tight text-pure-black dark:text-off-white">Relatório <span className="text-electric-blue">Matinal</span></h1>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard icon={<TrendingUp className="w-4 h-4" />} label="Vendas Hoje" value={team.reduce((a, t) => a + t.sales, 0).toString()} color="electric-blue" />
                <StatCard icon={<Users className="w-4 h-4" />} label="Leads Ativos" value={leads.filter((l) => l.stage !== 'Perdido' && l.stage !== 'Venda').length.toString()} color="electric-blue" />
                <StatCard icon={<Clock className="w-4 h-4" />} label="Sem Contato" value={leads.filter((l) => l.stage === 'Lead').length.toString()} color="mars-orange" />
                <StatCard icon={<AlertTriangle className="w-4 h-4" />} label="Estagnados" value={leads.filter((l) => l.stagnantDays && l.stagnantDays >= 2).length.toString()} color="mars-orange" />
            </div>

            <div className="flex gap-3 mb-8">
                <Button onClick={generateReport} disabled={isGenerating} className="rounded-xl h-12 px-8 font-bold bg-pure-black text-white dark:bg-white dark:text-pure-black shadow-elevation transition-transform active:scale-95">
                    {isGenerating ? <span className="animate-pulse">Gerando...</span> : <span className="flex items-center gap-2"><Send className="w-4 h-4" /> Gerar Relatório</span>}
                </Button>
                {report && (
                    <Button variant="outline" onClick={copyReport} className="rounded-xl h-12 px-6 font-bold"><Clipboard className="w-4 h-4 mr-2" /> Copiar</Button>
                )}
            </div>

            {report && (
                <div className="p-8 bg-white dark:bg-[#111] rounded-3xl shadow-sm border border-black/5 dark:border-white/5">
                    <pre className="whitespace-pre-wrap text-sm font-bold text-pure-black dark:text-off-white leading-relaxed font-sans">{report}</pre>
                </div>
            )}
        </div>
    )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
    return (
        <div className={`p-4 rounded-2xl bg-${color}/5 border border-${color}/10`}>
            <div className={`flex items-center gap-2 text-${color} mb-2`}>{icon}<span className="text-[9px] font-bold uppercase tracking-widest">{label}</span></div>
            <span className="text-2xl font-extrabold text-pure-black dark:text-off-white font-mono-numbers">{value}</span>
        </div>
    )
}
