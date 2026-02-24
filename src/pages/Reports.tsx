import { BarChart3, LineChart as LineChartIcon, FileText, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { reportLucratividade, reportCiclo, reportDescontos } from '@/lib/mock-data'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export default function Reports() {
    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-electric-blue"></div><span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">PROFIT OPS</span></div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-pure-black dark:text-off-white">Relatórios de <span className="text-electric-blue">Performance</span></h1>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="bg-white/50 dark:bg-black/50 p-1 rounded-2xl hyper-glass border-white/20 shadow-sm flex items-center shrink-0">
                        <Select defaultValue="giro"><SelectTrigger className="w-[180px] rounded-xl h-10 border-none bg-transparent shadow-none font-bold text-sm focus:ring-0"><SelectValue placeholder="Selecione o KPI" /></SelectTrigger>
                            <SelectContent className="rounded-xl"><SelectItem value="giro" className="font-bold">Giro de Estoque</SelectItem><SelectItem value="ticket" className="font-bold">Ticket Médio</SelectItem><SelectItem value="margem" className="font-bold">Margem Líquida</SelectItem></SelectContent></Select>
                    </div>
                    <Button onClick={() => toast({ title: 'Exportando Relatório', description: 'O PDF será baixado em breve.' })} className="rounded-2xl h-12 px-6 font-bold bg-pure-black text-white hover:bg-pure-black/80 dark:bg-white dark:text-pure-black shadow-elevation shrink-0"><Download className="w-4 h-4 mr-2" /> Exportar</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="hyper-glass border-[0.5px] border-white/40 dark:border-white/10 rounded-3xl flex flex-col overflow-hidden">
                    <CardHeader className="pb-6"><div className="flex items-center gap-3 mb-1"><div className="p-2.5 bg-electric-blue/10 rounded-xl"><BarChart3 className="h-5 w-5 text-electric-blue" /></div><CardTitle className="text-xl font-extrabold text-pure-black dark:text-off-white">Lucratividade por Modelo</CardTitle></div><CardDescription className="font-semibold text-muted-foreground ml-[52px]">Mapeamento dos ativos mais rentáveis (Top 5).</CardDescription></CardHeader>
                    <CardContent className="flex-1 min-h-[300px]">
                        <ChartContainer config={{ profit: { label: 'Lucratividade', color: 'var(--electric-blue)' } }} className="h-full w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={reportLucratividade} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="model" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontWeight: 600, fontSize: 10 }} />
                                    <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v / 1000}k`} tick={{ fill: 'hsl(var(--muted-foreground))', fontWeight: 600, fontSize: 10 }} />
                                    <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'var(--muted)', opacity: 0.2 }} />
                                    <Bar dataKey="profit" fill="#2563EB" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card className="hyper-glass border-[0.5px] border-white/40 dark:border-white/10 rounded-3xl flex flex-col overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-mars-orange/5 rounded-full blur-[60px] pointer-events-none"></div>
                    <CardHeader className="pb-6 relative z-10"><div className="flex items-center gap-3 mb-1"><div className="p-2.5 bg-mars-orange/10 rounded-xl"><LineChartIcon className="h-5 w-5 text-mars-orange" /></div><CardTitle className="text-xl font-extrabold text-pure-black dark:text-off-white">Ciclo Médio de Vendas</CardTitle></div><CardDescription className="font-semibold text-muted-foreground ml-[52px]">Tempo de prateleira histórico (Tendência).</CardDescription></CardHeader>
                    <CardContent className="flex-1 min-h-[300px] relative z-10">
                        <ChartContainer config={{ dias: { label: 'Dias', color: 'var(--mars-orange)' } }} className="h-full w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={reportCiclo} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontWeight: 600, fontSize: 10 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontWeight: 600, fontSize: 10 }} />
                                    <Tooltip content={<ChartTooltipContent />} />
                                    <Line type="monotone" dataKey="dias" stroke="#FF4500" strokeWidth={4} dot={{ r: 4, fill: '#FF4500', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#FF4500', stroke: '#fff', strokeWidth: 2 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none bg-white dark:bg-[#111] shadow-sm rounded-3xl overflow-hidden">
                <CardHeader className="border-b border-black/5 dark:border-white/5 pb-5"><div className="flex items-center gap-3"><div className="p-2.5 bg-black/5 dark:bg-white/10 rounded-xl"><FileText className="h-5 w-5 text-pure-black dark:text-off-white" /></div><div><CardTitle className="text-lg font-extrabold text-pure-black dark:text-off-white">Impacto de Descontos na Margem</CardTitle><CardDescription className="font-semibold text-muted-foreground mt-1">Análise de performance financeira por vendedor.</CardDescription></div></div></CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-black/5 dark:bg-white/5 border-none"><TableRow className="hover:bg-transparent border-none">
                            <TableHead className="font-bold text-[10px] uppercase tracking-widest py-5 text-pure-black dark:text-off-white pl-6">Vendedor</TableHead>
                            <TableHead className="text-right font-bold text-[10px] uppercase tracking-widest py-5 text-pure-black dark:text-off-white">Total Vendas</TableHead>
                            <TableHead className="text-right font-bold text-[10px] uppercase tracking-widest py-5 text-pure-black dark:text-off-white">Desconto Médio</TableHead>
                            <TableHead className="text-right font-bold text-[10px] uppercase tracking-widest py-5 text-pure-black dark:text-off-white pr-6">Impacto na Margem</TableHead>
                        </TableRow></TableHeader>
                        <TableBody>
                            {reportDescontos.map((d, i) => (
                                <TableRow key={d.seller} className={cn('hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-none', i % 2 === 0 ? 'bg-transparent' : 'bg-black/[0.02] dark:bg-white/[0.02]')}>
                                    <TableCell className="font-extrabold text-sm py-4 pl-6 text-pure-black dark:text-off-white">{d.seller}</TableCell>
                                    <TableCell className="text-right font-mono-numbers font-bold text-muted-foreground py-4">{d.totalSales}</TableCell>
                                    <TableCell className="text-right font-mono-numbers font-bold text-pure-black dark:text-off-white py-4">{d.avgDiscount}</TableCell>
                                    <TableCell className="text-right font-mono-numbers font-extrabold py-4 pr-6"><span className="bg-mars-orange/10 text-mars-orange px-2.5 py-1 rounded-lg inline-block">{d.marginImpact}</span></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    )
}
