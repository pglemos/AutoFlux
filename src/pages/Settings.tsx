import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Building2, Users, CreditCard, Sparkles, User as UserIcon, Mail, Phone, Moon, Sun, Shield, Plug, Link2, Zap, UserPlus, ShieldCheck, Target, FileSignature } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/components/auth-provider'
import { useUI, useUsers, useFinance } from '@/stores/main'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export default function Settings() {
    const { user, role } = useAuth()
    const { dashboardWidgets, setDashboardWidgets, chainedFunnel, setChainedFunnel } = useUI()
    const { users, addUser, updateUser, deleteUser, agencies, addAgency, updateAgency, deleteAgency } = useUsers()

    const [theme, setTheme] = useState<'light' | 'dark'>('light')
    const [newUserOpen, setNewUserOpen] = useState(false)
    const [newAgencyOpen, setNewAgencyOpen] = useState(false)
    const [editAgencyOpen, setEditAgencyOpen] = useState(false)
    const [editingAgency, setEditingAgency] = useState<any>(null)

    const [newName, setNewName] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [newRole, setNewRole] = useState<any>('Seller')
    const [newAgencyId, setNewAgencyId] = useState('')
    const [agencyName, setAgencyName] = useState('')

    const handleAddUser = () => {
        if (!newName || !newEmail) return
        addUser({ name: newName, email: newEmail, role: newRole, agencyId: newAgencyId || undefined })
        toast({ title: 'Usuário Adicionado', description: `O perfil de ${newName} foi criado com sucesso.` })
        setNewUserOpen(false)
        setNewName(''); setNewEmail(''); setNewRole('Seller'); setNewAgencyId('')
    }

    const handleAddAgency = () => {
        if (!agencyName) return
        addAgency({ name: agencyName })
        toast({ title: 'Agência Criada', description: `Agência ${agencyName} foi adicionada ao sistema.` })
        setNewAgencyOpen(false)
        setAgencyName('')
    }

    const handleEditAgency = (agency: any) => {
        setEditingAgency(agency)
        setAgencyName(agency.name)
        setEditAgencyOpen(true)
    }

    const handleUpdateAgency = () => {
        if (!editingAgency || !agencyName) return
        updateAgency(editingAgency.id, { name: agencyName })
        toast({ title: 'Agência Atualizada', description: `Agência ${agencyName} foi modificada.` })
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
                    Configurações do <span className="text-electric-blue">AutoPerf</span>
                </h1>
                <p className="text-muted-foreground font-medium mt-1">Gerencie preferências, usuários e permissões da plataforma.</p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="bg-black/5 dark:bg-white/5 p-1 rounded-2xl border border-black/5 dark:border-white/5 mb-8 backdrop-blur-xl">
                    <TabsTrigger value="general" className="rounded-xl font-bold text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-pure-black data-[state=active]:text-pure-black dark:data-[state=active]:text-white data-[state=active]:shadow-sm px-6 py-2.5 transition-all">
                        <SettingsIcon className="w-4 h-4 mr-2" />Geral
                    </TabsTrigger>
                    <TabsTrigger value="users" className="rounded-xl font-bold text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-pure-black data-[state=active]:text-pure-black dark:data-[state=active]:text-white data-[state=active]:shadow-sm px-6 py-2.5 transition-all">
                        {role === 'Admin' ? <Building2 className="w-4 h-4 mr-2" /> : <Users className="w-4 h-4 mr-2" />}
                        {role === 'Admin' ? 'Agências' : 'Usuários'}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                    <Card className="border-none bg-white dark:bg-pure-black shadow-sm rounded-3xl overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-xl font-extrabold">Perfil e Personalização</CardTitle>
                            <CardDescription className="font-semibold">Suas informações e preferências de interface.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-electric-blue/10 flex items-center justify-center">
                                        <UserIcon className="w-6 h-6 text-electric-blue" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-pure-black dark:text-off-white">
                                            {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário'}
                                        </p>
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-tight">{role}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold">Tema da Interface</p>
                                        <p className="text-sm text-muted-foreground font-semibold">Alternar entre modo claro e escuro.</p>
                                    </div>
                                    <div className="flex items-center gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-xl">
                                        <Button variant={theme === 'light' ? 'secondary' : 'ghost'} size="sm" onClick={() => setTheme('light')} className="rounded-lg font-bold h-8"><Sun className="w-3.5 h-3.5 mr-1" />Claro</Button>
                                        <Button variant={theme === 'dark' ? 'secondary' : 'ghost'} size="sm" onClick={() => setTheme('dark')} className="rounded-lg font-bold h-8"><Moon className="w-3.5 h-3.5 mr-1" />Escuro</Button>
                                    </div>
                                </div>

                                <Separator className="opacity-50" />

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold">Funil Encadeado</p>
                                        <p className="text-sm text-muted-foreground font-semibold">Exibir todas as etapas do processo sincronizadas.</p>
                                    </div>
                                    <Switch checked={chainedFunnel} onCheckedChange={setChainedFunnel} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users">
                    <Card className="border-none bg-white dark:bg-pure-black shadow-sm rounded-3xl overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-extrabold">{role === 'Admin' ? 'Gestão de Agências' : 'Equipe'}</CardTitle>
                                <CardDescription className="font-semibold">Gerencie os acessos e estruturas da plataforma.</CardDescription>
                            </div>
                            {role === 'Admin' ? (
                                <Button onClick={() => setNewAgencyOpen(true)} className="rounded-full bg-electric-blue hover:bg-electric-blue/90 font-bold px-6">
                                    Nova Agência
                                </Button>
                            ) : (
                                <Button onClick={() => setNewUserOpen(true)} className="rounded-full bg-electric-blue hover:bg-electric-blue/90 font-bold px-6">
                                    Novo Usuário
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            {/* Content grid for users/agencies here */}
                            <p className="text-center py-12 text-muted-foreground font-bold">Configure os dados conforme as permissões de {role}.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
