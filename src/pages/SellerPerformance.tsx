import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend, CartesianGrid } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { Badge } from '@/components/ui/badge'
import useAppStore from '@/stores/main'
import { cn } from '@/lib/utils'

const monthlyData = [
    { month: 'Jan', vendas: 18, meta: 20 },
    { month: 'Fev', vendas: 22, meta: 22 },
    { month: 'Mar', vendas: 28, meta: 25 },
    { month: 'Abr', vendas: 19, meta: 25 },
    { month: 'Mai', vendas: 24, meta: 25 },
]

export default function SellerPerformance() {
    const { team, commissions } = useAppStore()
    const [selectedSeller, setSelectedSeller] = useState('all')

    const filteredCommissions = selectedSeller === 'all' ? commissions : commissions.filter((c) => c.seller === team.find((t) => t.id === selectedSeller)?.name)

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-electric-blue"></div><span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">RELATÓRIO</span></div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-pure-black dark:text-off-white">Performance <span className="text-electric-blue">Vendedores</span></h1>
                </div>
                <Select value={selectedSeller} onValueChange={setSelectedSeller}>
                    <SelectTrigger className="w-[200px] rounded-xl h-10 bg-white/50 dark:bg-black/50 font-bold text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-xl"><SelectItem value="all">Todos Vendedores</SelectItem>{team.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="hyper-glass border-[0.5px] border-white/40 dark:border-white/10 rounded-3xl">
                    <CardHeader><CardTitle className="text-lg font-extrabold text-pure-black dark:text-off-white">Vendas vs Meta (Mensal)</CardTitle></CardHeader>
                    <CardContent>
                        <ChartContainer config={{ vendas: { label: 'Vendas', color: '#2563EB' }, meta: { label: 'Meta', color: '#FF4500' } }} className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontWeight: 600, fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontWeight: 600, fontSize: 12 }} />
                                    <Tooltip content={<ChartTooltipContent />} />
                                    <Legend />
                                    <Line type="monotone" dataKey="vendas" stroke="#2563EB" strokeWidth={3} dot={{ r: 5 }} />
                                    <Line type="monotone" dataKey="meta" stroke="#FF4500" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card className="hyper-glass border-[0.5px] border-white/40 dark:border-white/10 rounded-3xl">
                    <CardHeader><CardTitle className="text-lg font-extrabold text-pure-black dark:text-off-white">Ranking de Conversão</CardTitle></CardHeader>
                    <CardContent>
                        <ChartContainer config={{ conversion: { label: 'Conversão %', color: '#2563EB' } }} className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[...team].sort((a, b) => b.conversion - a.conversion)} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontWeight: 600, fontSize: 12 }} width={80} />
                                    <Tooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="conversion" fill="#2563EB" radius={[0, 8, 8, 0]} barSize={28} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none bg-white dark:bg-[#111] shadow-sm rounded-3xl overflow-hidden">
                <CardHeader className="border-b border-black/5 dark:border-white/5">
                    <CardTitle className="text-lg font-extrabold text-pure-black dark:text-off-white">Histórico de Comissões</CardTitle>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-black/5 dark:bg-white/5">
                            <TableRow className="border-none hover:bg-transparent">
                                <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 pl-6">Vendedor</TableHead>
                                <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4">Veículo</TableHead>
                                <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4">Data</TableHead>
                                <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4">Margem</TableHead>
                                <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 pr-6">Comissão (R$)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCommissions.map((c) => (
                                <TableRow key={c.id} className="border-none hover:bg-black/5 dark:hover:bg-white/5">
                                    <TableCell className="font-extrabold text-sm py-4 pl-6">{c.seller}</TableCell>
                                    <TableCell className="font-bold text-sm py-4">{c.car}</TableCell>
                                    <TableCell className="font-bold text-xs py-4 text-muted-foreground">{c.date}</TableCell>
                                    <TableCell className="font-bold text-sm py-4"><Badge variant="secondary" className="bg-electric-blue/10 text-electric-blue border-none font-mono-numbers">{c.margin}</Badge></TableCell>
                                    <TableCell className="font-extrabold text-sm py-4 pr-6 text-electric-blue font-mono-numbers">R$ {c.comission.toLocaleString('pt-BR')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    )
}
