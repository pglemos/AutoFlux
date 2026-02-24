import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { mockFinance } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import useAppStore from '@/stores/main'

export default function Financeiro() {
    const { commissions } = useAppStore()
    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val)

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-green-500"></div><span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">FINANCEIRO</span></div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-pure-black dark:text-off-white">Fluxo de <span className="text-green-500">Caixa</span></h1>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-white dark:bg-[#111] rounded-3xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none"></div>
                    <CardContent className="p-6 relative z-10">
                        <div className="flex items-center gap-4 mb-4"><div className="p-3 bg-green-500/10 rounded-2xl text-green-500"><TrendingUp className="w-6 h-6" /></div><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Entradas</p></div>
                        <p className="text-3xl font-extrabold font-mono-numbers text-pure-black dark:text-off-white">{formatCurrency(mockFinance.entradas)}</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white dark:bg-[#111] rounded-3xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-mars-orange/10 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none"></div>
                    <CardContent className="p-6 relative z-10">
                        <div className="flex items-center gap-4 mb-4"><div className="p-3 bg-mars-orange/10 rounded-2xl text-mars-orange"><TrendingDown className="w-6 h-6" /></div><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Saídas</p></div>
                        <p className="text-3xl font-extrabold font-mono-numbers text-pure-black dark:text-off-white">{formatCurrency(mockFinance.saidas)}</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-pure-black text-white dark:bg-white dark:text-pure-black rounded-3xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 dark:bg-black/20 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none"></div>
                    <CardContent className="p-6 relative z-10">
                        <div className="flex items-center gap-4 mb-4"><div className="p-3 bg-white/20 dark:bg-black/10 rounded-2xl"><Wallet className="w-6 h-6" /></div><p className="text-xs font-bold uppercase tracking-widest text-white/80 dark:text-black/80">Saldo Projetado</p></div>
                        <p className="text-3xl font-extrabold font-mono-numbers">{formatCurrency(mockFinance.saldoProjetado)}</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none bg-white dark:bg-[#111] shadow-sm rounded-3xl overflow-hidden mt-8">
                <CardHeader className="border-b border-black/5 dark:border-white/5 pb-6">
                    <div className="flex items-center gap-3"><div className="p-2.5 bg-black/5 dark:bg-white/10 rounded-xl"><DollarSign className="h-5 w-5 text-pure-black dark:text-off-white" /></div>
                        <div><CardTitle className="text-xl font-extrabold text-pure-black dark:text-off-white">Controle de Comissões</CardTitle><CardDescription className="font-semibold text-muted-foreground mt-1">Detalhamento de vendas e repasses por vendedor.</CardDescription></div></div>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-black/5 dark:bg-white/5 border-none"><TableRow className="hover:bg-transparent border-none">
                            <TableHead className="font-bold text-[10px] uppercase tracking-widest py-5 text-pure-black dark:text-off-white pl-6">Vendedor</TableHead>
                            <TableHead className="font-bold text-[10px] uppercase tracking-widest py-5 text-pure-black dark:text-off-white">Veículo Vendido</TableHead>
                            <TableHead className="font-bold text-[10px] uppercase tracking-widest py-5 text-pure-black dark:text-off-white">Data da Venda</TableHead>
                            <TableHead className="text-right font-bold text-[10px] uppercase tracking-widest py-5 text-pure-black dark:text-off-white">Margem da Venda</TableHead>
                            <TableHead className="text-right font-bold text-[10px] uppercase tracking-widest py-5 text-pure-black dark:text-off-white pr-6">Comissão (R$)</TableHead>
                        </TableRow></TableHeader>
                        <TableBody>
                            {commissions.map((c, i) => (
                                <TableRow key={c.id} className={cn('hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-none', i % 2 === 0 ? 'bg-transparent' : 'bg-black/[0.02] dark:bg-white/[0.02]')}>
                                    <TableCell className="font-extrabold text-sm py-4 pl-6 text-pure-black dark:text-off-white">{c.seller}</TableCell>
                                    <TableCell className="font-bold text-sm text-muted-foreground py-4">{c.car}</TableCell>
                                    <TableCell className="font-bold text-sm text-muted-foreground py-4">{c.date}</TableCell>
                                    <TableCell className="text-right py-4"><Badge variant="outline" className="font-mono-numbers font-bold border-none bg-black/5 dark:bg-white/10 text-pure-black dark:text-white rounded-lg">{c.margin}</Badge></TableCell>
                                    <TableCell className="text-right font-mono-numbers font-extrabold text-pure-black dark:text-off-white py-4 pr-6">{formatCurrency(c.comission)}</TableCell>
                                </TableRow>
                            ))}
                            {commissions.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground font-bold">Nenhuma comissão registrada.</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    )
}
