import { Activity } from 'lucide-react'
export default function CrossSalesReports() {
    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-electric-blue"></div><span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">RELATÓRIO</span></div>
                <h1 className="text-4xl font-extrabold tracking-tight text-pure-black dark:text-off-white">Vendas <span className="text-electric-blue">Cruzadas</span></h1>
            </div>
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <Activity className="w-16 h-16 text-electric-blue/30 mb-6" />
                <h2 className="text-2xl font-extrabold text-pure-black dark:text-off-white mb-2">Em Desenvolvimento</h2>
                <p className="text-muted-foreground font-bold max-w-md">Relatório de oportunidades cruzadas entre canais e modelos.</p>
            </div>
        </div>
    )
}
