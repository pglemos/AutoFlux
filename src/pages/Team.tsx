import { useState } from 'react'
import { UserPlus, Trophy, TrendingUp, Star, Edit2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import useAppStore from '@/stores/main'

export default function Team() {
    const { team, addTeamMember, updateTeamMember, deleteTeamMember } = useAppStore()
    const [open, setOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [name, setName] = useState('')
    const [role, setRole] = useState('')

    const openDialog = (id?: string) => {
        if (id) { const m = team.find((t) => t.id === id); if (m) { setName(m.name); setRole(m.role); setEditingId(id) } }
        else { setName(''); setRole(''); setEditingId(null) }
        setOpen(true)
    }

    const handleSave = () => {
        if (!name || !role) return
        if (editingId) { updateTeamMember(editingId, { name, role }); toast({ title: 'Membro atualizado' }) }
        else { addTeamMember({ name, role, conversion: 0, execution: 0, sales: 0, avatar: `male&seed=${Math.floor(Math.random() * 100)}` }); toast({ title: 'Membro adicionado' }) }
        setOpen(false)
    }

    const sorted = [...team].sort((a, b) => b.sales - a.sales)

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-electric-blue"></div><span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">GESTÃO</span></div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-pure-black dark:text-off-white">Minha <span className="text-electric-blue">Equipe</span></h1>
                </div>
                <Button onClick={() => openDialog()} className="rounded-full px-6 h-11 font-bold bg-pure-black text-white dark:bg-white dark:text-pure-black shadow-elevation"><UserPlus className="w-4 h-4 mr-2" /> Novo Membro</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sorted.map((member, i) => (
                    <Card key={member.id} className="border-none bg-white dark:bg-[#111] shadow-sm rounded-3xl overflow-hidden group hover:shadow-md transition-all">
                        <CardContent className="p-6 relative">
                            <Button variant="ghost" size="icon" onClick={() => openDialog(member.id)} className="absolute top-4 right-4 h-8 w-8 rounded-full text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 className="h-4 w-4" /></Button>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative"><img src={`https://img.usecurling.com/ppl/thumbnail?gender=${member.avatar}`} className="w-14 h-14 rounded-2xl object-cover shadow" alt="" />
                                    {i < 3 && <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center shadow"><Trophy className="w-3 h-3 text-yellow-900" /></div>}
                                </div>
                                <div><h3 className="font-extrabold text-lg text-pure-black dark:text-off-white">{member.name}</h3><span className="text-xs font-bold text-electric-blue uppercase tracking-wider">{member.role}</span></div>
                            </div>
                            <div className="space-y-4">
                                <MetricRow icon={<TrendingUp className="w-3.5 h-3.5 text-electric-blue" />} label="Conversão" value={`${member.conversion}%`} progress={member.conversion * 4} color="bg-electric-blue" />
                                <MetricRow icon={<Star className="w-3.5 h-3.5 text-mars-orange" />} label="Execução" value={`${member.execution}%`} progress={member.execution} color="bg-mars-orange" />
                                <div className="flex justify-between items-center pt-2 border-t border-black/5 dark:border-white/5 mt-4">
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Vendas</span>
                                    <span className="text-2xl font-extrabold text-pure-black dark:text-off-white font-mono-numbers">{member.sales}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[400px] rounded-3xl">
                    <DialogHeader><DialogTitle className="font-extrabold text-xl">{editingId ? 'Editar Membro' : 'Novo Membro'}</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2"><Label>Nome</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl" /></div>
                        <div className="space-y-2"><Label>Cargo / Função</Label><Input value={role} onChange={(e) => setRole(e.target.value)} className="rounded-xl" placeholder="Ex: Closer, SDR" /></div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setOpen(false)} className="rounded-xl font-bold">Cancelar</Button>
                        <Button onClick={handleSave} disabled={!name || !role} className="rounded-xl font-bold bg-electric-blue text-white">Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function MetricRow({ icon, label, value, progress, color }: { icon: React.ReactNode; label: string; value: string; progress: number; color: string }) {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2"><span className="opacity-80">{icon}</span><span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{label}</span></div>
                <span className="text-sm font-extrabold text-pure-black dark:text-off-white font-mono-numbers">{value}</span>
            </div>
            <Progress value={Math.min(progress, 100)} className={`h-1.5 bg-black/5 dark:bg-white/10 rounded-full [&>div]:${color} [&>div]:rounded-full`} />
        </div>
    )
}
