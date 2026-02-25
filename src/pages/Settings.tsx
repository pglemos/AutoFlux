import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Settings as SettingsIcon, Moon, Sun, Shield, Users, Plug, Link2, Zap, UserPlus, ShieldCheck, Target, FileSignature, Bot, Sparkles, CheckCircle2, User as UserIcon, Mail, Phone } from 'lucide-react'
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
import useAppStore, { Agency, User } from '@/stores/main'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import GoalManagement from './GoalManagement'
import CommissionRules from './CommissionRules'
import Communication from './Communication'
import { Plus, Building2, Pencil, Trash2, ChevronRight, UserPlus2 } from 'lucide-react'
import { FREE_AI_MODELS } from '@/lib/openrouter'

export default function Settings() {
    const { theme, setTheme } = useTheme()
    const { role, setRole, user } = useAuth()
    const {
        chainedFunnel, setChainedFunnel, calendarIntegrations, setCalendarIntegration,
        users, addUser, updateUser, deleteUser, permissions, togglePermission
    } = useAppStore()

    const [searchParams, setSearchParams] = useSearchParams()
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'general')

    useEffect(() => {
        const tabParam = searchParams.get('tab')
        if (tabParam) {
            setActiveTab(tabParam)
        }
    }, [searchParams])

    const handleTabChange = (value: string) => {
        setActiveTab(value)
        setSearchParams({ tab: value }, { replace: true })
    }
    const [userOpen, setUserOpen] = useState(false)
    const [agencyOpen, setAgencyOpen] = useState(false)
    const [editAgencyOpen, setEditAgencyOpen] = useState(false)
    const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(null)
    const [agencyName, setAgencyName] = useState('')
    const [agencyCnpj, setAgencyCnpj] = useState('')
    const [agencyAddress, setAgencyAddress] = useState('')
    const [agencyPhone, setAgencyPhone] = useState('')
    const [agencyEmail, setAgencyEmail] = useState('')
    const [agencyWebsite, setAgencyWebsite] = useState('')
    const [agencyManager, setAgencyManager] = useState('')

    const [editingAgency, setEditingAgency] = useState<Agency | null>(null)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [editUserOpen, setEditUserOpen] = useState(false)
    const [editingPermissions, setEditingPermissions] = useState(false)

    const [newName, setNewName] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPhone, setNewPhone] = useState('')
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
        addUser({
            name: newName,
            email: newEmail,
            password: newPassword,
            phone: newPhone,
            role: newRole,
            agencyId: newAgencyId || undefined
        })
        toast({ title: 'Usuário Criado', description: `${newName} foi adicionado ao time.` });
        setUserOpen(false);
        setNewName('');
        setNewEmail('');
        setNewPassword('');
        setNewPhone('');
        setNewAgencyId('')
    }

    const handleUpdateUser = () => {
        if (!editingUser || !newName || !newEmail) return
        updateUser(editingUser.id, {
            name: newName,
            email: newEmail,
            role: newRole,
            password: newPassword,
            phone: newPhone,
            agencyId: newAgencyId || undefined
        })
        toast({ title: 'Usuário Atualizado', description: `${newName} foi atualizado.` })
        setEditUserOpen(false)
        setEditingUser(null)
        setNewName(''); setNewEmail(''); setNewPassword(''); setNewPhone(''); setNewAgencyId('')
    }

    const handleAddAgency = () => {
        if (!agencyName) return
        addAgency({
            name: agencyName,
            slug: agencyName.toLowerCase().replace(/\s+/g, '-'),
            cnpj: agencyCnpj,
            address: agencyAddress,
            phone: agencyPhone,
            email: agencyEmail,
            website: agencyWebsite,
            managerName: agencyManager
        })
        toast({ title: 'Agência Criada', description: `Agência ${agencyName} foi adicionada.` })
        setAgencyOpen(false)
        resetAgencyForm()
    }

    const handleUpdateAgency = () => {
        if (!editingAgency || !agencyName) return
        updateAgency(editingAgency.id, {
            name: agencyName,
            cnpj: agencyCnpj,
            address: agencyAddress,
            phone: agencyPhone,
            email: agencyEmail,
            website: agencyWebsite,
            managerName: agencyManager
        })
        toast({ title: 'Agência Atualizada', description: `Agência ${agencyName} foi atualizada.` })
        setEditAgencyOpen(false)
        setEditingAgency(null)
        resetAgencyForm()
    }

    const resetAgencyForm = () => {
        setAgencyName('')
        setAgencyCnpj('')
        setAgencyAddress('')
        setAgencyPhone('')
        setAgencyEmail('')
        setAgencyWebsite('')
        setAgencyManager('')
    }

    const prepareEditAgency = (agency: Agency) => {
        setEditingAgency(agency)
        setAgencyName(agency.name)
        setAgencyCnpj(agency.cnpj || '')
        setAgencyAddress(agency.address || '')
        setAgencyPhone(agency.phone || '')
        setAgencyEmail(agency.email || '')
        setAgencyWebsite(agency.website || '')
        setAgencyManager(agency.managerName || '')
        setEditAgencyOpen(true)
    }

    const prepareEditUser = (user: User) => {
        setEditingUser(user)
        setNewName(user.name)
        setNewEmail(user.email)
        setNewRole(user.role)
        setNewPassword(user.password || '')
        setNewPhone(user.phone || '')
        setNewAgencyId(user.agencyId || '')
        setEditUserOpen(true)
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">
            <div className="mb-0">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-electric-blue animate-pulse"></div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">ADMINISTRATION BOX</span>
                </div>
                <h1 className="text-5xl font-extrabold tracking-tighter text-pure-black dark:text-off-white">
                    Painel de <span className="text-electric-blue">Configurações</span>
                </h1>
                <p className="text-muted-foreground font-medium mt-2 max-w-xl">Gerencie preferências, usuários e permissões do AutoGestão com precisão.</p>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="bg-white/50 dark:bg-black/50 p-1.5 rounded-2xl border border-white/30 dark:border-white/5 mb-10 backdrop-blur-2xl shadow-xl flex-wrap h-auto">
                    <TabsTrigger value="profile" className="rounded-xl font-bold text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-pure-black data-[state=active]:text-pure-black dark:data-[state=active]:text-white data-[state=active]:shadow-lg px-6 py-2.5 transition-all">
                        <UserIcon className="w-4 h-4 mr-2" />Perfil
                    </TabsTrigger>
                    <TabsTrigger value="general" className="rounded-xl font-bold text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-pure-black data-[state=active]:text-pure-black dark:data-[state=active]:text-white data-[state=active]:shadow-lg px-6 py-2.5 transition-all">
                        <SettingsIcon className="w-4 h-4 mr-2" />Geral
                    </TabsTrigger>
                    <TabsTrigger value="users" className="rounded-xl font-bold text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-pure-black data-[state=active]:text-pure-black dark:data-[state=active]:text-white data-[state=active]:shadow-lg px-6 py-2.5 transition-all">
                        {role === 'Admin' ? <Building2 className="w-4 h-4 mr-2" /> : <Users className="w-4 h-4 mr-2" />}
                        {role === 'Admin' ? 'Agência' : 'Usuários'}
                    </TabsTrigger>
                    {['Admin', 'Owner'].includes(role) && (
                        <TabsTrigger value="permissions" className="rounded-xl font-bold text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-pure-black data-[state=active]:text-pure-black dark:data-[state=active]:text-white data-[state=active]:shadow-lg px-6 py-2.5 transition-all">
                            <ShieldCheck className="w-4 h-4 mr-2" />Permissões
                        </TabsTrigger>
                    )}
                    <TabsTrigger value="integrations" className="rounded-xl font-bold text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-pure-black data-[state=active]:text-pure-black dark:data-[state=active]:text-white data-[state=active]:shadow-lg px-6 py-2.5 transition-all">
                        <Plug className="w-4 h-4 mr-2" />Integrações
                    </TabsTrigger>
                    <TabsTrigger value="automations" className="rounded-xl font-bold text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-pure-black data-[state=active]:text-pure-black dark:data-[state=active]:text-white data-[state=active]:shadow-lg px-6 py-2.5 transition-all">
                        <Bot className="w-4 h-4 mr-2" />Automações
                    </TabsTrigger>
                    <TabsTrigger value="goals" className="rounded-xl font-bold text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-pure-black data-[state=active]:text-pure-black dark:data-[state=active]:text-white data-[state=active]:shadow-lg px-6 py-2.5 transition-all">
                        <Target className="w-4 h-4 mr-2" />Metas
                    </TabsTrigger>
                    <TabsTrigger value="commissions" className="rounded-xl font-bold text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-pure-black data-[state=active]:text-pure-black dark:data-[state=active]:text-white data-[state=active]:shadow-lg px-6 py-2.5 transition-all">
                        <FileSignature className="w-4 h-4 mr-2" />Comissões
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6 animate-in fade-in-50 duration-500">
                    <Card className="border-none bg-white dark:bg-pure-black shadow-xl rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500">
                        <CardHeader className="border-b border-black/5 dark:border-white/5 pb-6">
                            <CardTitle className="text-lg font-extrabold flex items-center gap-2 text-pure-black dark:text-off-white">
                                <UserIcon className="w-5 h-5 text-electric-blue" /> Meu Perfil
                            </CardTitle>
                            <CardDescription className="font-medium">Informações da sua conta no sistema.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row items-start gap-8">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-electric-blue to-blue-600 flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-electric-blue/20 ring-4 ring-white dark:ring-pure-black">
                                        {user?.user_metadata?.avatar_url ? (
                                            <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full rounded-[2rem] object-cover" />
                                        ) : (
                                            user?.email?.[0]?.toUpperCase() || 'U'
                                        )}
                                    </div>
                                    <Badge className="bg-electric-blue/10 text-electric-blue border-none font-bold text-xs uppercase px-4 py-1">
                                        {role || 'Sem perfil'}
                                    </Badge>
                                </div>
                                <div className="flex-1 space-y-5 w-full">
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] transition-colors">
                                        <div className="p-2.5 bg-electric-blue/10 rounded-xl">
                                            <UserIcon className="w-5 h-5 text-electric-blue" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nome Completo</p>
                                            <p className="text-sm font-extrabold text-pure-black dark:text-off-white">
                                                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Não informado'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] transition-colors">
                                        <div className="p-2.5 bg-electric-blue/10 rounded-xl">
                                            <Mail className="w-5 h-5 text-electric-blue" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email</p>
                                            <p className="text-sm font-extrabold text-pure-black dark:text-off-white">
                                                {user?.email || 'Não informado'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] transition-colors">
                                        <div className="p-2.5 bg-electric-blue/10 rounded-xl">
                                            <Phone className="w-5 h-5 text-electric-blue" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Telefone</p>
                                            <p className="text-sm font-extrabold text-pure-black dark:text-off-white">
                                                {user?.user_metadata?.phone || user?.phone || 'Não informado'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] transition-colors">
                                        <div className="p-2.5 bg-electric-blue/10 rounded-xl">
                                            <Building2 className="w-5 h-5 text-electric-blue" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Perfil de Acesso</p>
                                            <p className="text-sm font-extrabold text-pure-black dark:text-off-white">
                                                {role || 'Não definido'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="general" className="space-y-6 animate-in fade-in-50 duration-500">
                    <Card className="border-none bg-white dark:bg-pure-black shadow-xl rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500">
                        <CardHeader>
                            <CardTitle className="text-lg font-extrabold flex items-center gap-2 text-pure-black dark:text-off-white">
                                <Moon className="w-5 h-5 text-electric-blue" /> Aparência
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-white/5 group-hover:bg-electric-blue/5 transition-colors">
                                <div>
                                    <Label className="font-bold text-sm text-pure-black dark:text-white">Modo Escuro</Label>
                                    <p className="text-xs text-muted-foreground font-medium mt-0.5">Alternar entre temas claro e escuro</p>
                                </div>
                                <Switch checked={theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)} onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none bg-white dark:bg-pure-black shadow-xl rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500">
                        <CardHeader>
                            <CardTitle className="text-lg font-extrabold flex items-center gap-2 text-pure-black dark:text-off-white">
                                <Shield className="w-5 h-5 text-slate-500" /> Controle de Acesso (RBAC)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-white/5 group-hover:bg-mars-orange/5 transition-colors">
                                <div>
                                    <Label className="font-bold text-sm text-pure-black dark:text-white">Perfil Ativo de Teste</Label>
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

                    <Card className="border-none bg-white dark:bg-pure-black shadow-xl rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500">
                        <CardHeader>
                            <CardTitle className="text-lg font-extrabold flex items-center gap-2 text-pure-black dark:text-off-white">
                                <Zap className="w-5 h-5 text-electric-blue" /> Regras de Negócio
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-white/5 group-hover:bg-electric-blue/5 transition-colors">
                                <div>
                                    <Label className="font-bold text-sm text-pure-black dark:text-white">Chained Funnel (Funil Encadeado)</Label>
                                    <p className="text-xs text-muted-foreground font-medium mt-0.5">Impede que leads pulem etapas do funil</p>
                                </div>
                                <Switch checked={chainedFunnel} onCheckedChange={(v) => { setChainedFunnel(v); toast({ title: v ? 'Funil Encadeado Ativado' : 'Funil Encadeado Desativado' }) }} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="automations" className="space-y-6 animate-in fade-in-50 duration-500">
                    <Communication />
                </TabsContent>

                <TabsContent value="users" className="space-y-6 animate-in fade-in-50 duration-500">
                    {role === 'Admin' ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="md:col-span-1 border-none bg-white dark:bg-pure-black shadow-xl rounded-[2rem] overflow-hidden border border-black/5 dark:border-white/5">
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
                                                        prepareEditAgency(agency);
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

                            <Card className="md:col-span-2 border-none bg-white dark:bg-pure-black shadow-xl rounded-[2rem] overflow-hidden min-h-[500px]">
                                {selectedAgencyId ? (
                                    <>
                                        <CardHeader className="flex flex-row items-center justify-between border-b border-black/5 dark:border-white/5 pb-6">
                                            <div>
                                                <CardTitle className="text-lg font-extrabold flex items-center gap-2 text-pure-black dark:text-off-white">
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
                                                <TableHeader className="bg-black/[0.03] dark:bg-white/[0.03] backdrop-blur-md">
                                                    <TableRow className="border-none hover:bg-transparent">
                                                        <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 pl-6">Nome</TableHead>
                                                        <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4">Email</TableHead>
                                                        <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4">Telefone</TableHead>
                                                        <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 text-center">Perfil</TableHead>
                                                        <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 text-right pr-6">Ações</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {users.filter(u => u.agencyId === selectedAgencyId).map((u) => (
                                                        <TableRow key={u.id} className="border-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                                            <TableCell className="font-extrabold text-sm py-5 pl-6">{u.name}</TableCell>
                                                            <TableCell className="text-sm py-5 text-muted-foreground font-bold">{u.email}</TableCell>
                                                            <TableCell className="text-sm py-5 text-muted-foreground font-bold">{u.phone || '-'}</TableCell>
                                                            <TableCell className="py-5 text-center">
                                                                <Badge variant="secondary" className="font-bold uppercase text-[10px] bg-electric-blue/10 text-electric-blue border-none">
                                                                    {u.role}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="py-5 text-right pr-6">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => prepareEditUser(u)}
                                                                        className="rounded-xl text-electric-blue font-bold text-xs hover:bg-electric-blue/10"
                                                                    >
                                                                        Editar
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => { deleteUser(u.id); toast({ title: 'Usuário removido' }) }}
                                                                        className="rounded-xl text-mars-orange font-bold text-xs hover:bg-mars-orange/10"
                                                                    >
                                                                        Remover
                                                                    </Button>
                                                                </div>
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
                                    <CardTitle className="text-lg font-extrabold text-pure-black dark:text-off-white">Gerenciamento de Time</CardTitle>
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
                                            <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4">Telefone</TableHead>
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
                                                <TableCell className="text-sm py-5 text-muted-foreground font-bold">{u.phone || '-'}</TableCell>
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
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => prepareEditUser(u)}
                                                            className="rounded-xl text-electric-blue font-bold text-xs hover:bg-electric-blue/10"
                                                        >
                                                            Editar
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            disabled={u.role === 'Admin'}
                                                            onClick={() => { deleteUser(u.id); toast({ title: 'Usuário removido' }) }}
                                                            className="rounded-xl text-mars-orange font-bold text-xs hover:bg-mars-orange/10"
                                                        >
                                                            Remover
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="permissions" className="space-y-6 animate-in fade-in-50 duration-500">
                    <Card className="border-none bg-white dark:bg-pure-black shadow-xl rounded-3xl overflow-hidden min-h-[500px]">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-black/5 dark:border-white/5 pb-6">
                            <div>
                                <CardTitle className="text-lg font-extrabold flex items-center gap-2 text-pure-black dark:text-off-white">
                                    <ShieldCheck className="w-5 h-5 text-electric-blue" />
                                    Matriz de Permissões
                                </CardTitle>
                                <CardDescription className="font-medium">Defina os acessos para cada perfil do sistema.</CardDescription>
                            </div>
                            <div>
                                {!editingPermissions ? (
                                    <Button
                                        onClick={() => setEditingPermissions(true)}
                                        className="rounded-xl font-bold bg-white text-pure-black border border-black/10 dark:bg-pure-black dark:text-white dark:border-white/10 shadow-sm hover:bg-black/5 dark:hover:bg-white/5"
                                    >
                                        <Pencil className="w-4 h-4 mr-2" /> Editar
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            onClick={() => setEditingPermissions(false)}
                                            className="rounded-xl font-bold px-6 border-none hover:bg-black/5"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setEditingPermissions(false)
                                                toast({ title: 'Permissões Salvas', description: 'A matriz de acessos foi atualizada com sucesso.' })
                                            }}
                                            className="rounded-xl font-bold bg-electric-blue text-white px-8 shadow-lg hover:bg-electric-blue/90"
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-2" /> Salvar
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-black/5 dark:bg-white/5">
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 pl-6">Módulo / Página</TableHead>
                                            {['Owner', 'Manager', 'Seller', 'RH', 'Admin'].map(r => (
                                                <TableHead key={r} className="font-bold text-[10px] uppercase tracking-widest py-4 text-center">{r}</TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {navItems.map((item) => (
                                            <TableRow key={item.path} className="border-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                                <TableCell className="font-bold text-sm py-4 pl-6 flex items-center gap-3">
                                                    <div className="p-2 bg-black/5 dark:bg-white/5 rounded-lg">
                                                        <item.icon className="w-4 h-4 text-muted-foreground" />
                                                    </div>
                                                    {item.title}
                                                </TableCell>
                                                {['Owner', 'Manager', 'Seller', 'RH', 'Admin'].map((r) => (
                                                    <TableCell key={r} className="py-4 text-center">
                                                        <Switch
                                                            disabled={!editingPermissions || r === 'Owner'}
                                                            checked={(permissions[r] || []).includes(item.path) || r === 'Owner'}
                                                            onCheckedChange={() => togglePermission(r, item.path)}
                                                            className="data-[state=checked]:bg-electric-blue"
                                                        />
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="integrations" className="space-y-6 animate-in fade-in-50 duration-500">
                    <Card className="border-none bg-white dark:bg-pure-black shadow-xl rounded-3xl overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-lg font-extrabold flex items-center gap-2 text-pure-black dark:text-off-white">
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

                    {/* AI Agents Configuration */}
                    <AIAgentsPanel />
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Nome Completo</Label>
                                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ex: Ricardo Silva" className="rounded-xl h-11 border-black/10 dark:border-white/10" />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Endereço de Email</Label>
                                <Input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="ricardo@loja.com.br" className="rounded-xl h-11 border-black/10 dark:border-white/10" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Senha</Label>
                                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="rounded-xl h-11 border-black/10 dark:border-white/10" />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Telefone</Label>
                                <Input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="(11) 99999-9999" className="rounded-xl h-11 border-black/10 dark:border-white/10" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Nome da Agência</Label>
                                <Input value={agencyName} onChange={(e) => setAgencyName(e.target.value)} placeholder="Ex: Agência Central" className="rounded-xl h-11 border-black/10 dark:border-white/10" />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">CNPJ</Label>
                                <Input value={agencyCnpj} onChange={(e) => setAgencyCnpj(e.target.value)} placeholder="00.000.000/0000-00" className="rounded-xl h-11 border-black/10 dark:border-white/10" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Endereço Completo</Label>
                            <Input value={agencyAddress} onChange={(e) => setAgencyAddress(e.target.value)} placeholder="Rua, Número, Bairro, Cidade - UF" className="rounded-xl h-11 border-black/10 dark:border-white/10" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Telefone</Label>
                                <Input value={agencyPhone} onChange={(e) => setAgencyPhone(e.target.value)} placeholder="(11) 99999-9999" className="rounded-xl h-11 border-black/10 dark:border-white/10" />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Email de Contato</Label>
                                <Input value={agencyEmail} onChange={(e) => setAgencyEmail(e.target.value)} placeholder="contato@agencia.com.br" className="rounded-xl h-11 border-black/10 dark:border-white/10" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Website</Label>
                                <Input value={agencyWebsite} onChange={(e) => setAgencyWebsite(e.target.value)} placeholder="www.agencia.com.br" className="rounded-xl h-11 border-black/10 dark:border-white/10" />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Responsável / Gerente</Label>
                                <Input value={agencyManager} onChange={(e) => setAgencyManager(e.target.value)} placeholder="Nome do Responsável" className="rounded-xl h-11 border-black/10 dark:border-white/10" />
                            </div>
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Nome da Agência</Label>
                                <Input value={agencyName} onChange={(e) => setAgencyName(e.target.value)} placeholder="Ex: Agência Central" className="rounded-xl h-11 border-black/10 dark:border-white/10" />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">CNPJ</Label>
                                <Input value={agencyCnpj} onChange={(e) => setAgencyCnpj(e.target.value)} placeholder="00.000.000/0000-00" className="rounded-xl h-11 border-black/10 dark:border-white/10" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Endereço Completo</Label>
                            <Input value={agencyAddress} onChange={(e) => setAgencyAddress(e.target.value)} placeholder="Rua, Número, Bairro, Cidade - UF" className="rounded-xl h-11 border-black/10 dark:border-white/10" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Telefone</Label>
                                <Input value={agencyPhone} onChange={(e) => setAgencyPhone(e.target.value)} placeholder="(11) 99999-9999" className="rounded-xl h-11 border-black/10 dark:border-white/10" />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Email de Contato</Label>
                                <Input value={agencyEmail} onChange={(e) => setAgencyEmail(e.target.value)} placeholder="contato@agencia.com.br" className="rounded-xl h-11 border-black/10 dark:border-white/10" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Website</Label>
                                <Input value={agencyWebsite} onChange={(e) => setAgencyWebsite(e.target.value)} placeholder="www.agencia.com.br" className="rounded-xl h-11 border-black/10 dark:border-white/10" />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Responsável / Gerente</Label>
                                <Input value={agencyManager} onChange={(e) => setAgencyManager(e.target.value)} placeholder="Nome do Responsável" className="rounded-xl h-11 border-black/10 dark:border-white/10" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="p-8 bg-black/5 dark:bg-white/5 flex gap-3">
                        <Button variant="ghost" onClick={() => setEditAgencyOpen(false)} className="rounded-xl font-bold px-6 border-none hover:bg-black/5">Cancelar</Button>
                        <Button onClick={handleUpdateAgency} disabled={!agencyName} className="rounded-xl font-bold bg-electric-blue text-white px-8 shadow-lg hover:bg-electric-blue/90">Salvar Alterações</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={editUserOpen} onOpenChange={setEditUserOpen}>
                <DialogContent className="sm:max-w-[420px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                    <div className="p-6 bg-electric-blue text-white">
                        <DialogTitle className="font-extrabold text-2xl">Editar Usuário</DialogTitle>
                        <p className="text-white/70 text-sm font-medium">Atualize os dados do membro do time.</p>
                    </div>
                    <div className="p-8 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Nome Completo</Label>
                                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ex: Ricardo Silva" className="rounded-xl h-11 border-black/10 dark:border-white/10" />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Endereço de Email</Label>
                                <Input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="ricardo@loja.com.br" className="rounded-xl h-11 border-black/10 dark:border-white/10" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Senha (Opcional)</Label>
                                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="rounded-xl h-11 border-black/10 dark:border-white/10" />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Telefone</Label>
                                <Input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="(11) 99999-9999" className="rounded-xl h-11 border-black/10 dark:border-white/10" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
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
                                        <SelectItem value="Admin" className="font-bold">Admin</SelectItem>
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
                    </div>
                    <DialogFooter className="p-8 bg-black/5 dark:bg-white/5 flex gap-3">
                        <Button variant="ghost" onClick={() => { setEditUserOpen(false); setEditingUser(null); }} className="rounded-xl font-bold px-6 border-none hover:bg-black/5">Cancelar</Button>
                        <Button onClick={handleUpdateUser} disabled={!newName || !newEmail} className="rounded-xl font-bold bg-electric-blue text-white px-8 shadow-lg hover:bg-electric-blue/90">Salvar Alterações</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function AIAgentsPanel() {
    const { selectedAiModel, setSelectedAiModel } = useAppStore()

    return (
        <Card className="border-none bg-white dark:bg-pure-black shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="border-b border-black/5 dark:border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-electric-blue/10 rounded-xl">
                            <Bot className="h-5 w-5 text-electric-blue" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-extrabold text-pure-black dark:text-off-white">Agentes de IA</CardTitle>
                            <CardDescription className="font-medium">Selecione o modelo gratuito do OpenRouter para diagnósticos e relatórios.</CardDescription>
                        </div>
                    </div>
                    <Badge className="bg-green-500/10 text-green-600 border-none font-bold text-[10px] uppercase px-3">Free Tier</Badge>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {FREE_AI_MODELS.map((model) => {
                        const isActive = selectedAiModel === model.id
                        return (
                            <button
                                key={model.id}
                                onClick={() => {
                                    setSelectedAiModel(model.id)
                                    toast({ title: '🤖 Modelo Atualizado', description: `Agente de IA alterado para ${model.name} (${model.provider}).` })
                                }}
                                className={cn(
                                    'relative text-left p-5 rounded-2xl border-2 transition-all duration-300 group cursor-pointer',
                                    isActive
                                        ? 'border-electric-blue bg-electric-blue/5 dark:bg-electric-blue/10 shadow-lg shadow-electric-blue/10'
                                        : 'border-transparent bg-black/[0.03] dark:bg-white/[0.03] hover:bg-black/[0.06] dark:hover:bg-white/[0.06] hover:border-black/10 dark:hover:border-white/10'
                                )}
                            >
                                {isActive && (
                                    <div className="absolute top-3 right-3">
                                        <CheckCircle2 className="w-5 h-5 text-electric-blue" />
                                    </div>
                                )}
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles className={cn('w-4 h-4', isActive ? 'text-electric-blue' : 'text-muted-foreground/50')} />
                                    <span className="font-extrabold text-sm text-pure-black dark:text-off-white">{model.name}</span>
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge variant="outline" className="text-[9px] font-bold px-2 py-0.5 border-black/10 dark:border-white/10 rounded-lg">
                                        {model.provider}
                                    </Badge>
                                    <Badge variant="secondary" className="text-[9px] font-mono-numbers px-2 py-0.5 bg-black/5 dark:bg-white/5 border-none rounded-lg">
                                        {model.context}
                                    </Badge>
                                </div>
                                <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">{model.desc}</p>
                            </button>
                        )
                    })}
                </div>
                <div className="mt-6 p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] flex items-center gap-3">
                    <Bot className="w-5 h-5 text-electric-blue shrink-0" />
                    <div>
                        <p className="text-xs font-bold text-pure-black dark:text-off-white">
                            Modelo ativo: <span className="text-electric-blue">{FREE_AI_MODELS.find(m => m.id === selectedAiModel)?.name || selectedAiModel}</span>
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium">Todos os modelos são 100% gratuitos via OpenRouter. Sem custos adicionais.</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
