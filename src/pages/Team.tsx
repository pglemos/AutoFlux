import { useState, useMemo, ReactNode } from 'react'
import {
    UserPlus,
    Trophy,
    TrendingUp,
    Star,
    Edit2,
    Users,
    Target,
    ArrowUpRight,
    Mail,
    Phone,
    MoreHorizontal,
    Trash2,
    MailIcon,
    PhoneCall,
    Search,
    Shield,
    Zap,
    Briefcase
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import useAppStore, { TeamMember } from '@/stores/main'
import { useAuth } from '@/components/auth-provider'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Team() {
    const { role } = useAuth()
    const { team, leads, goals, addTeamMember, updateTeamMember, deleteTeamMember, activeAgencyId } = useAppStore()
    const [open, setOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [form, setForm] = useState({ name: '', role: '', email: '', phone: '' })

    const filteredTeam = useMemo(() => {
        return team.filter(m => {
            const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                m.role.toLowerCase().includes(search.toLowerCase())

            if (!matchesSearch) return false

            // Filter by active agency if Admin
            if (role === 'Admin' && activeAgencyId) {
                if (m.agencyId !== activeAgencyId) return false
            }

            return true
        }).sort((a, b) => b.sales - a.sales)
    }, [team, search, role, activeAgencyId])

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
        <div className="max-w-7xl mx-auto space-y-10 pb-20 px-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-electric-blue animate-pulse"></div>
                        <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">HUMAN OPS</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-pure-black dark:text-off-white">
                        Alta <span className="text-electric-blue">Performance</span>
                    </h1>
                    <p className="text-muted-foreground font-medium">Gestão estratégica de talentos e resultados comerciais.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar consultor..."
                            className="pl-10 h-12 rounded-2xl bg-white dark:bg-black border-black/10 dark:border-white/10 font-bold"
                        />
                    </div>
                    <Button
                        onClick={() => openDialog()}
                        className="rounded-2xl h-12 px-8 font-bold bg-pure-black text-white dark:bg-white dark:text-pure-black shadow-elevation shrink-0"
                    >
                        <UserPlus className="w-4 h-4 mr-2" /> Novo Membro
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard title="Total Vendas" value={stats.totalSales.toString()} trend="+12%" icon={<Trophy className="text-amber-500" />} />
                <SummaryCard title="Conversão Média" value={`${stats.avgConversion.toFixed(1)}%`} trend="+2.4%" icon={<TrendingUp className="text-electric-blue" />} />
                <SummaryCard title="Capacidade Atual" value={team.length.toString()} trend="Full" icon={<Users className="text-emerald-500" />} />
                <SummaryCard title="Atingimento" value={`${((stats.totalSales / stats.teamGoal) * 100).toFixed(0)}%`} trend="Em curso" icon={<Target className="text-mars-orange" />} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                    {filteredTeam.map((member, index) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <MemberCard
                                member={member}
                                rank={index + 1}
                                isLead={index === 0}
                                leadsCount={leads.filter(l => l.sellerId === member.id).length}
                                onEdit={() => openDialog(member)}
                                onDelete={() => deleteTeamMember(member.id)}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[450px] rounded-[2rem] border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
                            {editingId ? <Edit2 className="w-6 h-6 text-electric-blue" /> : <UserPlus className="w-6 h-6 text-electric-blue" />}
                            {editingId ? 'Editar Consultor' : 'Novo Talento'}
                        </DialogTitle>
                        <DialogDescription className="font-medium">Defina as credenciais e o papel do novo membro.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-6">
                        <div className="space-y-2">
                            <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Identificação</Label>
                            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl h-12 bg-black/5 border-none font-bold" placeholder="Nome Completo" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Função</Label>
                                <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="rounded-xl h-12 bg-black/5 border-none font-bold" placeholder="Ex: Closer" />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Telefone</Label>
                                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-xl h-12 bg-black/5 border-none font-bold" placeholder="(00) 00000-0000" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">E-mail Corporativo</Label>
                            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl h-12 bg-black/5 border-none font-bold" placeholder="colaborador@autogestao.com.br" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setOpen(false)} className="rounded-xl h-12 font-bold px-6">Cancelar</Button>
                        <Button onClick={handleSave} disabled={!form.name || !form.role} className="rounded-xl h-12 px-8 font-bold bg-pure-black text-white dark:bg-white dark:text-pure-black">
                            {editingId ? 'Salvar' : 'Confirmar Admissão'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function SummaryCard({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: ReactNode }) {
    return (
        <Card className="border-none shadow-sm bg-white dark:bg-black rounded-[2rem] overflow-hidden group">
            <CardContent className="p-7">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none font-extrabold text-[10px]">
                        {trend}
                    </Badge>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">{title}</p>
                    <h3 className="text-3xl font-extrabold font-mono-numbers text-pure-black dark:text-off-white">{value}</h3>
                </div>
            </CardContent>
        </Card>
    )
}

function MemberCard({ member, rank, isLead, leadsCount, onEdit, onDelete }: {
    member: TeamMember,
    rank: number,
    isLead: boolean,
    leadsCount: number,
    onEdit: () => void,
    onDelete: () => void
}) {
    return (
        <Card className={cn(
            "border-none rounded-[2.5rem] shadow-xl overflow-hidden group transition-all hover:shadow-2xl relative",
            isLead ? "bg-white dark:bg-black ring-2 ring-electric-blue/20" : "bg-white dark:bg-black"
        )}>
            {isLead && (
                <div className="absolute top-6 left-6 flex items-center gap-1.5 bg-electric-blue/10 text-electric-blue px-3 py-1 rounded-full">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-[9px] font-black uppercase tracking-tighter">Líder de Vendas</span>
                </div>
            )}

            <div className="absolute top-6 right-6">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5 h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-2xl p-2 border-none shadow-xl">
                        <DropdownMenuItem onClick={onEdit} className="rounded-xl font-bold gap-2 py-3"><Edit2 className="w-4 h-4" /> Perfil</DropdownMenuItem>
                        <DropdownMenuItem onClick={onDelete} className="rounded-xl font-bold gap-2 py-3 text-mars-orange focus:text-mars-orange"><Trash2 className="w-4 h-4" /> Remover</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <CardContent className="p-8">
                <div className="flex flex-col items-center text-center mt-4">
                    <div className="relative mb-6">
                        <Avatar className="h-24 w-24 rounded-3xl border-4 border-white dark:border-black shadow-lg">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.avatar}`} />
                            <AvatarFallback className="rounded-3xl font-black text-2xl">{member.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 bg-pure-black dark:bg-white dark:text-pure-black text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-md">
                            #{rank}
                        </div>
                    </div>

                    <h3 className="text-xl font-extrabold tracking-tight text-pure-black dark:text-off-white">{member.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                        <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-bold text-muted-foreground">{member.role}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 my-8">
                    <div className="p-4 bg-black/[0.03] dark:bg-white/[0.03] rounded-3xl">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Conversão</p>
                        <p className="text-xl font-extrabold font-mono-numbers text-electric-blue">{member.conversion}%</p>
                    </div>
                    <div className="p-4 bg-black/[0.03] dark:bg-white/[0.03] rounded-3xl">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Volume</p>
                        <p className="text-xl font-extrabold font-mono-numbers text-pure-black dark:text-off-white">{member.sales}un</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                <Shield className="w-3 h-3 text-emerald-500" /> Qualidade
                            </span>
                            <span className="text-xs font-black font-mono-numbers">{member.execution}%</span>
                        </div>
                        <Progress value={member.execution} className="h-2 bg-black/5 dark:bg-white/5" />
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="flex-1 rounded-2xl font-extrabold text-[10px] h-11 uppercase tracking-widest border-black/10 transition-colors hover:bg-black hover:text-white">
                            <Mail className="w-3.5 h-3.5 mr-2" /> E-mail
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 rounded-2xl font-extrabold text-[10px] h-11 uppercase tracking-widest border-black/10 transition-colors hover:bg-emerald-500 hover:border-emerald-500 hover:text-white">
                            <Phone className="w-3.5 h-3.5 mr-2" /> Call
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

