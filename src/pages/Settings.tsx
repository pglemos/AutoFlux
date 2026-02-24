import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Moon, Sun, Shield, Users, Plug, Link2, Zap, UserPlus, ShieldCheck, Target, FileSignature } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/theme-provider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useAuth, Role } from '@/components/auth-provider'
import { mockIntegrations } from '@/lib/mock-data'
import { navItems } from '@/components/Navigation'
import useAppStore from '@/stores/main'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import GoalManagement from './GoalManagement'
import CommissionRules from './CommissionRules'
import { Plus, Building2, Pencil, Trash2, ChevronRight, UserPlus2 } from 'lucide-react'

export default function Settings() {
    const { theme, setTheme } = useTheme()
    const { role, setRole } = useAuth()
    const { chainedFunnel, setChainedFunnel, calendarIntegrations, setCalendarIntegration, users, addUser, deleteUser, permissions, togglePermission } = useAppStore()
    const [userOpen, setUserOpen] = useState(false)
    const [agencyOpen, setAgencyOpen] = useState(false)
    const [editAgencyOpen, setEditAgencyOpen] = useState(false)
    const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(null)
    const [agencyName, setAgencyName] = useState('')
    const [editingAgency, setEditingAgency] = useState<{ id: string, name: string } | null>(null)
    const [newName, setNewName] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [newRole, setNewRole] = useState<Role>('Seller')
    const [newAgencyId, setNewAgencyId] = useState<string>('')

    const [whatsappStatus, setWhatsappStatus] = useState<{ connected: boolean; qr: string | null }>({ connected: false, qr: null })
    const [pollingWhatsApp, setPollingWhatsApp] = useState(false)

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (pollingWhatsApp || !whatsappStatus.connected) {
            interval = setInterval(async () => {
                try {
                    const res = await fetch('http://localhost:3001/api/whatsapp/status')
                    if (res.ok) {
                        const data = await res.json()
                        setWhatsappStatus(data)
                        if (data.connected && !whatsappStatus.connected) {
                            toast({ title: 'WhatsApp Conectado!', description: 'O dispositivo foi pareado com sucesso.' })
                        }
                    }
                } catch (error) {
                    console.error('WhatsApp API indisponível', error)
                }
            }, 3000)
        }
        return () => clearInterval(interval)
    }, [pollingWhatsApp, whatsappStatus.connected])

    const { agencies, addAgency, updateAgency, deleteAgency } = useAppStore()

    const handleAddUser = () => {
        if (!newName || !newEmail) return
        addUser({ name: newName, email: newEmail, role: newRole, agencyId: newAgencyId || undefined })
        toast({ title: 'Usuário Criado', description: `${newName} foi adicionado ao time.` }); setUserOpen(false); setNewName(''); setNewEmail(''); setNewAgencyId('')
    }

    const handleAddAgency = () => {
        if (!agencyName) return
        addAgency({ name: agencyName })
        toast({ title: 'Agência Criada', description: `Agência ${agencyName} foi adicionada.` })
        setAgencyOpen(false)
        setAgencyName('')
    }

    const handleUpdateAgency = () => {
        if (!editingAgency || !agencyName) return
        updateAgency(editingAgency.id, { name: agencyName })
        toast({ title: 'Agência Atualizada', description: `Agência ${agencyName} foi atualizada.` })
        setEditAgencyOpen(false)
        setEditingAgency(null)
        setAgencyName('')
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-electric-blue"></div>
                    <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">SISTEMA</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-pure-black dark:text-off-white">
                    <span className="text-electric-blue">Configurações</span>
                </h1>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-muted-foreground font-medium">Gerencie preferências, usuários e permissões do AutoGestão.</p>
                    <span className="text-3xl font-signature text-[#94785C] opacity-60">Luz Direção Consultoria</span>
                </div>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="bg-white/50 dark:bg-black/50 p-1 rounded-2xl border border-white/30 dark:border-white/5 mb-8 backdrop-blur-xl">
                    <TabsTrigger value="general" className="rounded-xl font-bold text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-pure-black data-[state=active]:text-white data-[state=active]:shadow-sm px-6">
                        <SettingsIcon className="w-4 h-4 mr-2" />Geral
                    </TabsTrigger>
                    <TabsTrigger value="users" className="rounded-xl font-bold text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-pure-black data-[state=active]:text-white data-[state=active]:shadow-sm px-6">
                        {role === 'Admin' ? <Building2 className="w-4 h-4 mr-2" /> : <Users className="w-4 h-4 mr-2" />}
                        {role === 'Admin' ? 'Agência' : 'Usuários'}
                    </TabsTrigger>
                    <TabsTrigger value="permissions" className="rounded-xl font-bold text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-pure-black data-[state=active]:text-white data-[state=active]:shadow-sm px-6">
                        <ShieldCheck className="w-4 h-4 mr-2" />Permissões
                    </TabsTrigger>
                    <TabsTrigger value="integrations" className="rounded-xl font-bold text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-pure-black data-[state=active]:text-white data-[state=active]:shadow-sm px-6">
                        <Plug className="w-4 h-4 mr-2" />Integrações
                    </TabsTrigger>
                    <TabsTrigger value="goals" className="rounded-xl font-bold text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-pure-black data-[state=active]:text-white data-[state=active]:shadow-sm px-6">
                        <Target className="w-4 h-4 mr-2" />Metas
                    </TabsTrigger>
                    <TabsTrigger value="commissions" className="rounded-xl font-bold text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-pure-black data-[state=active]:text-white data-[state=active]:shadow-sm px-6">
                        <FileSignature className="w-4 h-4 mr-2" />Comissões
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6 animate-in fade-in-50 duration-500">
                    <Card className="border-none bg-white dark:bg-pure-black shadow-sm rounded-3xl overflow-hidden group hover:shadow-md transition-all">
                        <CardHeader>
                            <CardTitle className="text-lg font-extrabold flex items-center gap-2">
                                <Moon className="w-5 h-5 text-electric-blue" /> Aparência
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-white/5 group-hover:bg-electric-blue/5 transition-colors">
                                <div>
                                    <Label className="font-bold text-sm dark:text-white">Modo Escuro</Label>
                                    <p className="text-xs text-muted-foreground font-medium mt-0.5">Alternar entre temas claro e escuro</p>
                                </div>
                                <Switch checked={theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)} onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none bg-white dark:bg-pure-black shadow-sm rounded-3xl overflow-hidden group hover:shadow-md transition-all">
                        <CardHeader>
                            <CardTitle className="text-lg font-extrabold flex items-center gap-2">
                                <Shield className="w-5 h-5 text-slate-500" /> Controle de Acesso (RBAC)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-white/5 group-hover:bg-mars-orange/5 transition-colors">
                                <div>
                                    <Label className="font-bold text-sm dark:text-white">Perfil Ativo de Teste</Label>
                                    <p className="text-xs text-muted-foreground font-medium mt-0.5">Simular diferentes perfis de acesso</p>
                                </div>
                                <Select value={role} onValueChange={(v) => { setRole(v as Role); toast({ title: 'Perfil Alterado', description: `Agora você é: ${v}` }) }}>
                                    <SelectTrigger className="w-[180px] rounded-xl font-bold border-none bg-white dark:bg-black shadow-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-xl">
                                        <SelectItem value="Owner" className="font-bold">Dono</SelectItem>
                                        <SelectItem value="Manager" className="font-bold">Gestor</SelectItem>
                                        <SelectItem value="Seller" className="font-bold">Vendedor</SelectItem>
                                        <SelectItem value="RH" className="font-bold">RH</SelectItem>
                                        <SelectItem value="Admin" className="font-bold">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none bg-white dark:bg-pure-black shadow-sm rounded-3xl overflow-hidden group hover:shadow-md transition-all">
                        <CardHeader>
                            <CardTitle className="text-lg font-extrabold flex items-center gap-2">
                                <Zap className="w-5 h-5 text-electric-blue" /> Regras de Negócio
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-white/5 group-hover:bg-electric-blue/5 transition-colors">
                                <div>
                                    <Label className="font-bold text-sm dark:text-white">Chained Funnel (Funil Encadeado)</Label>
                                    <p className="text-xs text-muted-foreground font-medium mt-0.5">Impede que leads pulem etapas do funil</p>
                                </div>
                                <Switch checked={chainedFunnel} onCheckedChange={(v) => { setChainedFunnel(v); toast({ title: v ? 'Funil Encadeado Ativado' : 'Funil Encadeado Desativado' }) }} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users" className="space-y-6 animate-in fade-in-50 duration-500">
                    {role === 'Admin' ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="md:col-span-1 border-none bg-white dark:bg-pure-black shadow-xl rounded-3xl overflow-hidden border border-black/5 dark:border-white/5">
                                <CardHeader className="flex flex-row items-center justify-between border-b border-black/5 dark:border-white/5 pb-6">
                                    <div>
                                        <CardTitle className="text-lg font-extrabold text-electric-blue">Agências</CardTitle>
                                        <CardDescription className="font-medium">Selecione uma agência</CardDescription>
                                    </div>
                                    <Button size="icon" variant="ghost" onClick={() => setAgencyOpen(true)} className="rounded-xl text-electric-blue hover:bg-electric-blue/10">
                                        <Plus className="w-5 h-5" />
                                    </Button>
                                </CardHeader>
                                <div className="p-2 space-y-1">
                                    {agencies.map((agency) => (
                                        <div
                                            key={agency.id}
                                            onClick={() => setSelectedAgencyId(agency.id)}
                                            className={cn(
                                                "flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all group",
                                                selectedAgencyId === agency.id
                                                    ? "bg-electric-blue text-white shadow-lg"
                                                    : "hover:bg-black/5 dark:hover:bg-white/5"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Building2 className={cn("w-5 h-5", selectedAgencyId === agency.id ? "text-white" : "text-muted-foreground")} />
                                                <span className="font-bold text-sm">{agency.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className={cn("h-8 w-8 rounded-lg", selectedAgencyId === agency.id ? "text-white hover:bg-white/20" : "text-muted-foreground hover:bg-black/10")}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingAgency(agency);
                                                        setAgencyName(agency.name);
                                                        setEditAgencyOpen(true);
                                                    }}
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className={cn("h-8 w-8 rounded-lg", selectedAgencyId === agency.id ? "text-white hover:bg-white/20" : "text-muted-foreground hover:bg-mars-orange/10 hover:text-mars-orange")}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteAgency(agency.id);
                                                        if (selectedAgencyId === agency.id) setSelectedAgencyId(null);
                                                        toast({ title: 'Agência Removida' });
                                                    }}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {agencies.length === 0 && (
                                        <div className="p-8 text-center text-muted-foreground">
                                            <Building2 className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                            <p className="text-xs font-bold">Nenhuma agência cadastrada</p>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            <Card className="md:col-span-2 border-none bg-white dark:bg-pure-black shadow-xl rounded-3xl overflow-hidden min-h-[500px]">
                                {selectedAgencyId ? (
                                    <>
                                        <CardHeader className="flex flex-row items-center justify-between border-b border-black/5 dark:border-white/5 pb-6">
                                            <div>
                                                <CardTitle className="text-lg font-extrabold flex items-center gap-2">
                                                    <Users className="w-5 h-5 text-electric-blue" />
                                                    Usuários: {agencies.find(a => a.id === selectedAgencyId)?.name}
                                                </CardTitle>
                                                <CardDescription className="font-medium">Gerencie os membros desta agência.</CardDescription>
                                            </div>
                                            <Button onClick={() => setUserOpen(true)} className="rounded-xl font-bold bg-electric-blue text-white shadow-lg hover:bg-electric-blue/90">
                                                <UserPlus2 className="w-4 h-4 mr-2" /> Novo Usuário
                                            </Button>
                                        </CardHeader>
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader className="bg-black/5 dark:bg-white/5">
                                                    <TableRow className="border-none hover:bg-transparent">
                                                        <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 pl-6">Nome</TableHead>
                                                        <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4">Email</TableHead>
                                                        <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 text-center">Perfil</TableHead>
                                                        <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 text-right pr-6">Ações</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {users.filter(u => u.agencyId === selectedAgencyId).map((u) => (
                                                        <TableRow key={u.id} className="border-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                                            <TableCell className="font-extrabold text-sm py-5 pl-6">{u.name}</TableCell>
                                                            <TableCell className="text-sm py-5 text-muted-foreground font-bold">{u.email}</TableCell>
                                                            <TableCell className="py-5 text-center">
                                                                <Badge variant="secondary" className="font-bold uppercase text-[10px] bg-electric-blue/10 text-electric-blue border-none">
                                                                    {u.role}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="py-5 text-right pr-6">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => { deleteUser(u.id); toast({ title: 'Usuário removido' }) }}
                                                                    className="rounded-xl text-mars-orange font-bold text-xs hover:bg-mars-orange/10"
                                                                >
                                                                    Remover
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                    {users.filter(u => u.agencyId === selectedAgencyId).length === 0 && (
                                                        <TableRow>
                                                            <TableCell colSpan={4} className="py-20 text-center">
                                                                <Users className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                                                <p className="text-muted-foreground font-bold">Nenhum usuário nesta agência</p>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-12">
                                        <div className="w-20 h-20 rounded-full bg-electric-blue/5 flex items-center justify-center mb-6">
                                            <ChevronRight className="w-10 h-10 text-electric-blue/30" />
                                        </div>
                                        <h3 className="text-xl font-extrabold mb-2">Selecione uma Agência</h3>
                                        <p className="text-muted-foreground max-w-xs mx-auto font-medium">Escolha uma agência no menu lateral para gerenciar seus usuários ou crie uma nova.</p>
                                    </div>
                                )}
                            </Card>
                        </div>
                    ) : (
                        <Card className="border-none bg-white dark:bg-pure-black shadow-xl rounded-3xl overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-black/5 dark:border-white/5 pb-6">
                                <div>
                                    <CardTitle className="text-lg font-extrabold">Gerenciamento de Time</CardTitle>
                                    <CardDescription className="font-medium">Lista de usuários com acesso à plataforma.</CardDescription>
                                </div>
                                <Button onClick={() => setUserOpen(true)} className="rounded-xl font-bold bg-electric-blue text-white shadow-lg hover:bg-electric-blue/90">
                                    <UserPlus className="w-4 h-4 mr-2" /> Novo Usuário
                                </Button>
                            </CardHeader>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-black/5 dark:bg-white/5">
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 pl-6">Nome</TableHead>
                                            <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4">Email</TableHead>
                                            <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 text-center">Agência</TableHead>
                                            <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 text-center">Perfil</TableHead>
                                            <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 text-right pr-6">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((u) => (
                                            <TableRow key={u.id} className="border-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                                <TableCell className="font-extrabold text-sm py-5 pl-6">{u.name}</TableCell>
                                                <TableCell className="text-sm py-5 text-muted-foreground font-bold">{u.email}</TableCell>
                                                <TableCell className="py-5 text-center">
                                                    <Badge variant="outline" className="font-bold text-[10px] border-black/10 dark:border-white/10">
                                                        {agencies.find(a => a.id === u.agencyId)?.name || '-'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-5 text-center">
                                                    <Badge variant="secondary" className="font-bold uppercase text-[10px] bg-electric-blue/10 text-electric-blue border-none">
                                                        {u.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-5 text-right pr-6">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={u.role === 'Admin'}
                                                        onClick={() => { deleteUser(u.id); toast({ title: 'Usuário removido' }) }}
                                                        className="rounded-xl text-mars-orange font-bold text-xs hover:bg-mars-orange/10"
                                                    >
                                                        Remover
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="agencies" className="space-y-6 animate-in fade-in-50 duration-500">
                    <Card className="border-none bg-white dark:bg-pure-black shadow-xl rounded-3xl overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-black/5 dark:border-white/5 pb-6">
                            <div>
                                <CardTitle className="text-lg font-extrabold">Unidades / Agências</CardTitle>
                                <CardDescription className="font-medium">Gerencie as filiais e centros de distribuição.</CardDescription>
                            </div>
                            <Button onClick={() => setAgencyOpen(true)} className="rounded-xl font-bold bg-electric-blue text-white shadow-lg hover:bg-electric-blue/90">
                                <Building2 className="w-4 h-4 mr-2" /> Nova Unidade
                            </Button>
                        </CardHeader>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-black/5 dark:bg-white/5">
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 pl-6">ID</TableHead>
                                        <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4">Nome da Unidade</TableHead>
                                        <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 text-center">Membros</TableHead>
                                        <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 text-right pr-6">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {agencies.map((agency) => (
                                        <TableRow key={agency.id} className="border-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                            <TableCell className="text-[10px] font-bold text-muted-foreground py-5 pl-6 font-mono">{agency.id}</TableCell>
                                            <TableCell className="font-extrabold text-sm py-5">{agency.name}</TableCell>
                                            <TableCell className="py-5 text-center">
                                                <Badge variant="secondary" className="font-bold text-[10px] bg-electric-blue/5 text-electric-blue border-none">
                                                    {users.filter(u => u.agencyId === agency.id).length} usuários
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-5 text-right pr-6">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    disabled={users.some(u => u.agencyId === agency.id)}
                                                    onClick={() => { deleteAgency(agency.id); toast({ title: 'Unidade removida' }) }}
                                                    className="rounded-xl text-mars-orange font-bold text-xs hover:bg-mars-orange/10"
                                                >
                                                    Remover
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="permissions" className="space-y-6 animate-in fade-in-50 duration-500">
                    <Card className="border-none bg-white dark:bg-pure-black shadow-xl rounded-3xl overflow-hidden">
                        <CardHeader className="border-b border-black/5 dark:border-white/5 pb-6">
                            <CardTitle className="text-lg font-extrabold flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-mars-orange" /> Matriz de Permissões
                            </CardTitle>
                            <CardDescription className="font-medium">Defina o nível de acesso para cada função do sistema.</CardDescription>
                        </CardHeader>
                        {role === 'Admin' ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-black/5 dark:bg-white/5">
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableHead className="font-bold text-[10px] uppercase tracking-widest py-5 pl-6">Funcionalidade</TableHead>
                                            <TableHead className="font-bold text-[10px] uppercase tracking-widest py-5 text-center">Dono</TableHead>
                                            <TableHead className="font-bold text-[10px] uppercase tracking-widest py-5 text-center">Gestor</TableHead>
                                            <TableHead className="font-bold text-[10px] uppercase tracking-widest py-5 text-center">Vendedor</TableHead>
                                            <TableHead className="font-bold text-[10px] uppercase tracking-widest py-5 text-center">RH</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {navItems.map((item) => (
                                            <TableRow key={item.path} className="border-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                                <TableCell className="font-bold text-sm py-5 pl-6">{item.title}</TableCell>
                                                {['Owner', 'Manager', 'Seller', 'RH'].map((rl) => (
                                                    <TableCell key={rl} className="py-5 text-center">
                                                        <Switch
                                                            checked={permissions[rl]?.includes(item.path)}
                                                            onCheckedChange={() => togglePermission(rl, item.path)}
                                                        />
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="p-12 text-center bg-black/5 dark:bg-white/5 mx-6 my-8 rounded-3xl border-2 border-dashed border-black/5 dark:border-white/5">
                                <Shield className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">Acesso Restrito ao Admin</h3>
                                <p className="text-sm text-muted-foreground max-w-xs mx-auto">Apenas o perfil Admin tem privilégios para gerenciar permissões de acesso.</p>
                            </div>
                        )}
                    </Card>
                </TabsContent>

                <TabsContent value="integrations" className="space-y-6 animate-in fade-in-50 duration-500">
                    <Card className="border-none bg-white dark:bg-pure-black shadow-xl rounded-3xl overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-lg font-extrabold flex items-center gap-2">
                                <Link2 className="w-5 h-5 text-electric-blue" /> Ecossistema Conectado
                            </CardTitle>
                            <CardDescription className="font-medium">Integrações ativas e serviços de terceiros.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* WhatsApp Integration Panel */}
                            <div className="flex flex-col p-5 rounded-3xl bg-black/5 dark:bg-white/5 group transition-all border border-transparent hover:border-green-500/20">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className={cn('w-2 h-2 rounded-full', whatsappStatus.connected ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-400 animate-pulse')}></div>
                                        <div>
                                            <span className="font-extrabold text-sm text-pure-black dark:text-off-white flex items-center gap-2">
                                                WhatsApp Web
                                            </span>
                                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                                                {whatsappStatus.connected ? 'Sessão Ativa' : 'Aguardando QR Code'}
                                            </span>
                                        </div>
                                    </div>
                                    <Badge variant={whatsappStatus.connected ? 'default' : 'secondary'} className={cn("font-bold text-[10px] uppercase border-none px-3", whatsappStatus.connected ? "bg-green-500/10 text-green-500" : "bg-black/10 dark:bg-white/10 text-muted-foreground")}>
                                        {whatsappStatus.connected ? 'Conectado' : 'Desconectado'}
                                    </Badge>
                                </div>

                                {!whatsappStatus.connected && (
                                    <div className="mt-2 p-4 bg-white dark:bg-black/40 rounded-2xl flex flex-col items-center justify-center border border-dashed border-black/10 dark:border-white/10">
                                        {whatsappStatus.qr ? (
                                            <>
                                                <img src={whatsappStatus.qr} alt="WhatsApp QR Code" className="w-48 h-48 rounded-lg shadow-sm mb-4" />
                                                <p className="text-xs font-bold text-muted-foreground text-center">Escaneie o QR Code com seu WhatsApp para conectar.</p>
                                            </>
                                        ) : (
                                            <div className="py-8 text-center flex flex-col items-center">
                                                <Plug className="w-8 h-8 text-muted-foreground/30 mb-2" />
                                                <p className="text-xs font-bold text-muted-foreground">Iniciando servidor do WhatsApp...</p>
                                                <Button variant="link" size="sm" onClick={() => setPollingWhatsApp(true)} className="text-[10px] mt-2 h-auto py-0">Tentar Novamente</Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {mockIntegrations.map((int) => (
                                <div key={int.name} className="flex items-center justify-between p-5 rounded-3xl bg-black/5 dark:bg-white/5 group hover:bg-electric-blue/5 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={cn('w-2 h-2 rounded-full', int.status === 'connected' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-400')}></div>
                                        <div>
                                            <span className="font-extrabold text-sm text-pure-black dark:text-off-white block">{int.name}</span>
                                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Última Sincronização: 12min atrás</span>
                                        </div>
                                    </div>
                                    <Badge variant={(int.status === 'connected' ? 'default' : 'secondary') as any} className={cn("font-bold text-[10px] uppercase border-none px-3", int.status === 'connected' ? "bg-green-500/10 text-green-500" : "bg-black/10 dark:bg-white/10 text-muted-foreground")}>
                                        {int.status === 'connected' ? 'Ativo' : 'Pendente'}
                                    </Badge>
                                </div>
                            ))}
                            <div className="pt-4 space-y-3">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2">Agendas Externas</h4>
                                <div className="flex items-center justify-between p-5 rounded-3xl bg-black/5 dark:bg-white/5 group hover:bg-electric-blue/5 transition-all">
                                    <div>
                                        <Label className="font-bold text-sm dark:text-white">Google Calendar</Label>
                                        <p className="text-[10px] text-muted-foreground font-medium">Sincronizar visitas automaticamente</p>
                                    </div>
                                    <Switch checked={calendarIntegrations.google} onCheckedChange={(v) => setCalendarIntegration('google', v)} />
                                </div>
                                <div className="flex items-center justify-between p-5 rounded-3xl bg-black/5 dark:bg-white/5 group hover:bg-electric-blue/5 transition-all">
                                    <div>
                                        <Label className="font-bold text-sm dark:text-white">Outlook Calendar</Label>
                                        <p className="text-[10px] text-muted-foreground font-medium">Integração com ecossistema Microsoft</p>
                                    </div>
                                    <Switch checked={calendarIntegrations.outlook} onCheckedChange={(v) => setCalendarIntegration('outlook', v)} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="goals" className="animate-in fade-in-50 duration-500">
                    <GoalManagement standalone={false} />
                </TabsContent>

                <TabsContent value="commissions" className="animate-in fade-in-50 duration-500">
                    <CommissionRules standalone={false} />
                </TabsContent>
            </Tabs>

            <Dialog open={userOpen} onOpenChange={setUserOpen}>
                <DialogContent className="sm:max-w-[420px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                    <div className="p-6 bg-electric-blue text-white">
                        <DialogTitle className="font-extrabold text-2xl">Novo Usuário</DialogTitle>
                        <p className="text-white/70 text-sm font-medium">Convide um novo membro para o time.</p>
                    </div>
                    <div className="p-8 space-y-5">
                        <div className="space-y-2">
                            <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Nome Completo</Label>
                            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ex: Ricardo Silva" className="rounded-xl h-11 border-black/10 dark:border-white/10" />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Endereço de Email</Label>
                            <Input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="ricardo@loja.com.br" className="rounded-xl h-11 border-black/10 dark:border-white/10" />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Perfil de Acesso</Label>
                            <Select value={newRole} onValueChange={(v) => setNewRole(v as Role)}>
                                <SelectTrigger className="rounded-xl h-11 border-black/10 dark:border-white/10 font-bold">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-2xl">
                                    <SelectItem value="Owner" className="font-bold">Dono (Full Admin)</SelectItem>
                                    <SelectItem value="Manager" className="font-bold">Gestor (Controle de Time)</SelectItem>
                                    <SelectItem value="Seller" className="font-bold">Vendedor (Foco em Vendas)</SelectItem>
                                    <SelectItem value="RH" className="font-bold">RH (Monitoramento)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Unidade / Agência</Label>
                            <Select value={newAgencyId} onValueChange={setNewAgencyId}>
                                <SelectTrigger className="rounded-xl h-11 border-black/10 dark:border-white/10 font-bold">
                                    <SelectValue placeholder="Selecione uma unidade" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-2xl">
                                    {agencies.map((a) => (
                                        <SelectItem key={a.id} value={a.id} className="font-bold">{a.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="p-8 bg-black/5 dark:bg-white/5 flex gap-3">
                        <Button variant="ghost" onClick={() => setUserOpen(false)} className="rounded-xl font-bold px-6 border-none hover:bg-black/5">Cancelar</Button>
                        <Button onClick={handleAddUser} disabled={!newName || !newEmail} className="rounded-xl font-bold bg-electric-blue text-white px-8 shadow-lg hover:bg-electric-blue/90">Criar Acesso</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={agencyOpen} onOpenChange={setAgencyOpen}>
                <DialogContent className="sm:max-w-[420px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                    <div className="p-6 bg-electric-blue text-white">
                        <DialogTitle className="font-extrabold text-2xl">Nova Agência</DialogTitle>
                        <p className="text-white/70 text-sm font-medium">Cadastre uma nova agência no sistema.</p>
                    </div>
                    <div className="p-8 space-y-5">
                        <div className="space-y-2">
                            <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Nome da Agência</Label>
                            <Input value={agencyName} onChange={(e) => setAgencyName(e.target.value)} placeholder="Ex: Agência Central" className="rounded-xl h-11 border-black/10 dark:border-white/10" />
                        </div>
                    </div>
                    <DialogFooter className="p-8 bg-black/5 dark:bg-white/5 flex gap-3">
                        <Button variant="ghost" onClick={() => setAgencyOpen(false)} className="rounded-xl font-bold px-6 border-none hover:bg-black/5">Cancelar</Button>
                        <Button onClick={handleAddAgency} disabled={!agencyName} className="rounded-xl font-bold bg-electric-blue text-white px-8 shadow-lg hover:bg-electric-blue/90">Criar Agência</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={editAgencyOpen} onOpenChange={setEditAgencyOpen}>
                <DialogContent className="sm:max-w-[420px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                    <div className="p-6 bg-electric-blue text-white">
                        <DialogTitle className="font-extrabold text-2xl">Editar Agência</DialogTitle>
                        <p className="text-white/70 text-sm font-medium">Atualize os dados da agência.</p>
                    </div>
                    <div className="p-8 space-y-5">
                        <div className="space-y-2">
                            <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Nome da Agência</Label>
                            <Input value={agencyName} onChange={(e) => setAgencyName(e.target.value)} placeholder="Ex: Agência Central" className="rounded-xl h-11 border-black/10 dark:border-white/10" />
                        </div>
                    </div>
                    <DialogFooter className="p-8 bg-black/5 dark:bg-white/5 flex gap-3">
                        <Button variant="ghost" onClick={() => setEditAgencyOpen(false)} className="rounded-xl font-bold px-6 border-none hover:bg-black/5">Cancelar</Button>
                        <Button onClick={handleUpdateAgency} disabled={!agencyName} className="rounded-xl font-bold bg-electric-blue text-white px-8 shadow-lg hover:bg-electric-blue/90">Salvar Alterações</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
