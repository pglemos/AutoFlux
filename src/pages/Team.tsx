import { useState, useMemo } from 'react'
import { UserPlus, Trophy, TrendingUp, Star, Edit2, Users, Target, ArrowUpRight, Mail, Phone, MoreHorizontal, Trash2, MailIcon, PhoneCall } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import useAppStore, { TeamMember } from '@/stores/main'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export default function Team() {
    const { team, leads, goals, addTeamMember, updateTeamMember, deleteTeamMember } = useAppStore()
    const [open, setOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState({ name: '', role: '', email: '', phone: '' })

    const sortedTeam = useMemo(() => [...team].sort((a, b) => b.sales - a.sales), [team])

    const stats = useMemo(() => {
        const totalSales = team.reduce((a, m) => a + m.sales, 0)
        const avgConversion = team.length > 0 ? team.reduce((a, m) => a + m.conversion, 0) / team.length : 0
        const teamGoal = goals.find(g => g.type === 'Equipe')?.amount || 25
        return { totalSales, avgConversion, teamGoal }
    }, [team, goals])

    const openDialog = (member?: TeamMember) => {
        if (member) {
            setForm({ name: member.name, role: member.role, email: '', phone: '' })
            setEditingId(member.id)
        } else {
            setForm({ name: '', role: '', email: '', phone: '' })
            setEditingId(null)
        }
        setOpen(true)
    }

    const handleSave = () => {
        if (!form.name || !form.role) return
        if (editingId) {
            updateTeamMember(editingId, form)
            toast({ title: 'Perfil Atualizado', description: `As alterações em ${form.name} foram salvas.` })
        } else {
            addTeamMember({
                ...form,
                conversion: 0,
                execution: 0,
                sales: 0,
                avatar: `male&seed=${Math.floor(Math.random() * 1000)}`
            })
            toast({ title: 'Novo Membro', description: `${form.name} agora faz parte do time.` })
        }
        setOpen(false)
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-fade-in px-4 md:px-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="px-2 py-0.5 bg-electric-blue/10 text-electric-blue rounded text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5">
                            <Users className="w-3 h-3" /> GESTÃO DE PESSOAL
                        </div>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-pure-black dark:text-off-white">
                        Nossa <span className="text-electric-blue">Equipe</span>
                    </h1>
                    <p className="text-muted-foreground font-medium">Gerencie performance, metas e perfis do seu time comercial.</p>
                </div>

                <Button
                    onClick={() => openDialog()}
                    className="rounded-2xl h-12 px-8 font-bold bg-pure-black text-white dark:bg-white dark:text-pure-black shadow-lg hover:shadow-electric-blue/20 transition-all hover:scale-[1.02]"
                >
                    <UserPlus className="w-4 h-4 mr-2" /> Adicionar Membro
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SummaryCard title="Total de Vendas" value={stats.totalSales.toString()} sub={`Meta: ${stats.teamGoal}`} icon={<Trophy className="text-yellow-500" />} />
                <SummaryCard title="Conversão Média" value={`${stats.avgConversion.toFixed(1)}%`} sub="Performance Global" icon={<TrendingUp className="text-electric-blue" />} />
                <SummaryCard title="Time Ativo" value={team.length.toString()} sub="Membros Registrados" icon={<Users className="text-emerald-500" />} />
                <SummaryCard title="Meta do Mês" value={`${((stats.totalSales / stats.teamGoal) * 100).toFixed(0)}%`} sub="Progresso Geral" icon={<Target className="text-mars-orange" />} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                    {sortedTeam.map((member, index) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <MemberCard
                                member={member}
                                isTop={index < 3}
                                rank={index + 1}
                                leadsCount={leads.filter(l => l.sellerId === member.id).length}
                                onEdit={() => openDialog(member)}
                                onDelete={() => deleteTeamMember(member.id)}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight">{editingId ? 'Editar Perfil' : 'Novo Membro'}</DialogTitle>
                        <DialogDescription>Preencha as informações básicas para o cadastro no CRM.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="space-y-2">
                            <Label className="font-bold">Nome Completo</Label>
                            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl h-12" placeholder="Ex: João Silva" />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold">Cargo / Função</Label>
                            <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="rounded-xl h-12" placeholder="Ex: SDR, Closer, Gerente" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="font-bold">E-mail</Label>
                                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl h-12" placeholder="loja@autoflux.com" />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold">Telefone</Label>
                                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-xl h-12" placeholder="(31) 99999-9999" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-3">
                        <Button variant="ghost" onClick={() => setOpen(false)} className="rounded-xl h-12 font-bold">Cancelar</Button>
                        <Button onClick={handleSave} disabled={!form.name || !form.role} className="rounded-xl h-12 px-8 font-bold bg-electric-blue text-white shadow-lg shadow-electric-blue/20">
                            {editingId ? 'Salvar Alterações' : 'Criar Membro'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function SummaryCard({ title, value, sub, icon }: { title: string, value: string, sub: string, icon: React.ReactNode }) {
    return (
        <Card className="hyper-glass border-none rounded-[2rem] overflow-hidden">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-black/5 dark:bg-white/5 rounded-xl">{icon}</div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground/30" />
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
                    <h3 className="text-3xl font-black font-mono-numbers">{value}</h3>
                    <p className="text-[11px] font-semibold text-muted-foreground">{sub}</p>
                </div>
            </CardContent>
        </Card>
    )
}

function MemberCard({ member, isTop, rank, leadsCount, onEdit, onDelete }: {
    member: TeamMember,
    isTop: boolean,
    rank: number,
    leadsCount: number,
    onEdit: () => void,
    onDelete: () => void
}) {
    return (
        <Card className="hyper-glass border-none rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-all">
            <CardContent className="p-8 relative">
                <div className="absolute top-6 right-6">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5 dark:hover:bg-white/5 h-8 w-8"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl">
                            <DropdownMenuItem onClick={onEdit} className="rounded-xl font-bold gap-2"><Edit2 className="w-4 h-4" /> Editar Perfil</DropdownMenuItem>
                            <DropdownMenuItem onClick={onDelete} className="rounded-xl font-bold gap-2 text-mars-orange focus:text-mars-orange"><Trash2 className="w-4 h-4" /> Remover Membro</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex flex-col items-center text-center mb-8">
                    <div className="relative mb-4">
                        <div className={cn("p-1 rounded-3xl", isTop ? "bg-gradient-to-tr from-yellow-400 to-mars-orange" : "bg-black/5 dark:bg-white/10")}>
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.avatar}`}
                                className="w-20 h-20 rounded-[1.25rem] bg-porcelain dark:bg-black object-cover"
                                alt={member.name}
                            />
                        </div>
                        {isTop && (
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-pure-black border-2 border-white dark:border-black text-white text-[10px] font-black flex items-center justify-center">
                                #{rank}
                            </div>
                        )}
                    </div>
                    <h3 className="text-xl font-black tracking-tight">{member.name}</h3>
                    <Badge variant="outline" className="mt-1 border-none bg-black/5 dark:bg-white/5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 py-1">
                        {member.role}
                    </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-8">
                    <div className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl text-center">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Vendas</p>
                        <p className="text-lg font-black font-mono-numbers">{member.sales}</p>
                    </div>
                    <div className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl text-center">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Leads</p>
                        <p className="text-lg font-black font-mono-numbers">{leadsCount}</p>
                    </div>
                    <div className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl text-center">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Conv.</p>
                        <p className="text-lg font-black font-mono-numbers">{member.conversion}%</p>
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <span className="micro-label">Execução de Processos</span>
                            <span className="text-xs font-black font-mono-numbers">{member.execution}%</span>
                        </div>
                        <Progress value={member.execution} className="h-2 bg-black/5 dark:bg-white/5" indicatorClassName="bg-electric-blue" />
                    </div>

                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="flex-1 rounded-xl font-bold text-[11px] h-10 hover:bg-electric-blue/10 hover:text-electric-blue">
                            <MailIcon className="w-3.5 h-3.5 mr-2" /> E-mail
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-1 rounded-xl font-bold text-[11px] h-10 hover:bg-emerald-500/10 hover:text-emerald-500">
                            <PhoneCall className="w-3.5 h-3.5 mr-2" /> Contato
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
