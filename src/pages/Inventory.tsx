import { Car } from 'lucide-react'
export default function Inventory() {
    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-electric-blue"></div><span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">EM BREVE</span></div>
                <h1 className="text-4xl font-extrabold tracking-tight text-pure-black dark:text-off-white">Controle de <span className="text-electric-blue">Estoque</span></h1>
            </div>
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <Car className="w-16 h-16 text-electric-blue/30 mb-6" />
                <h2 className="text-2xl font-extrabold text-pure-black dark:text-off-white mb-2">Estoque em Desenvolvimento</h2>
                <p className="text-muted-foreground font-bold max-w-md">Gerencie veículos, aging, entrada/saída e integração com DMS.</p>
            </div>
        </div>
    )
}
