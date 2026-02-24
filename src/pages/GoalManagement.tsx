import { useState } from 'react'
import { Target, Plus, Trash2, Users, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/hooks/use-toast'
import useAppStore from '@/stores/main'

export default function GoalManagement() {
    const { goals, setGoal, deleteGoal, team } = useAppStore()
    const [type, setType] = useState<'Equipe' | 'Individual'>('Equipe')
    const [targetId, setTargetId] = useState('')
    const [amount, setAmount] = useState('')

    const handleSave = () => {
        if (!amount) return
        setGoal({ type, targetId: type === 'Equipe' ? 'team' : targetId, amount: Number(amount) })
        toast({ title: 'Meta Salva', description: `Meta de ${amount} vendas definida.` })
        setAmount('')
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-electric-blue"></div><span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">CONFIGURAÇÃO</span></div>
                <h1 className="text-4xl font-extrabold tracking-tight text-pure-black dark:text-off-white">Gerenciar <span className="text-electric-blue">Metas</span></h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1 hyper-glass border-[0.5px] border-white/40 dark:border-white/10 rounded-3xl">
                    <CardHeader>
                        <div className="flex items-center gap-3"><div className="p-2.5 bg-electric-blue/10 rounded-xl"><Target className="h-5 w-5 text-electric-blue" /></div>
                            <CardTitle className="text-lg font-extrabold text-pure-black dark:text-off-white">Definir Meta</CardTitle></div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Button variant={type === 'Equipe' ? 'default' : 'outline'} onClick={() => setType('Equipe')} size="sm" className="rounded-xl font-bold flex-1"><Users className="w-4 h-4 mr-1" /> Equipe</Button>
                            <Button variant={type === 'Individual' ? 'default' : 'outline'} onClick={() => setType('Individual')} size="sm" className="rounded-xl font-bold flex-1"><User className="w-4 h-4 mr-1" /> Individual</Button>
                        </div>
                        {type === 'Individual' && (
                            <div className="space-y-2"><Label>Vendedor</Label>
                                <select className="w-full p-2 rounded-xl border bg-white/50 dark:bg-black/50 text-sm font-bold" value={targetId} onChange={(e) => setTargetId(e.target.value)}>
                                    <option value="">Selecione</option>{team.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                        )}
                        <div className="space-y-2"><Label>Meta de Vendas (Mês)</Label><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Ex: 25" className="rounded-xl" /></div>
                        <Button onClick={handleSave} disabled={!amount} className="w-full rounded-xl font-bold bg-electric-blue text-white">Salvar Meta</Button>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2 border-none bg-white dark:bg-[#111] shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader className="border-b border-black/5 dark:border-white/5"><CardTitle className="text-lg font-extrabold text-pure-black dark:text-off-white">Metas Ativas</CardTitle></CardHeader>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-black/5 dark:bg-white/5">
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 pl-6">Tipo</TableHead>
                                    <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4">Alvo</TableHead>
                                    <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4">Vendas</TableHead>
                                    <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 pr-6">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {goals.map((g) => (
                                    <TableRow key={g.id} className="hover:bg-black/5 dark:hover:bg-white/5 border-none">
                                        <TableCell className="font-bold text-sm pl-6">{g.type}</TableCell>
                                        <TableCell className="font-bold text-sm">{g.type === 'Equipe' ? 'Toda Equipe' : team.find((t) => t.id === g.targetId)?.name || g.targetId}</TableCell>
                                        <TableCell className="font-extrabold text-sm font-mono-numbers text-electric-blue">{g.amount}</TableCell>
                                        <TableCell className="pr-6"><Button variant="ghost" size="icon" onClick={() => { deleteGoal(g.id); toast({ title: 'Meta removida' }) }} className="h-8 w-8 rounded-full text-muted-foreground hover:text-mars-orange"><Trash2 className="h-4 w-4" /></Button></TableCell>
                                    </TableRow>
                                ))}
                                {goals.length === 0 && <TableRow><TableCell colSpan={4} className="p-12 text-center text-muted-foreground font-bold">Nenhuma meta definida.</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </div>
        </div>
    )
}
