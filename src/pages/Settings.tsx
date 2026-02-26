import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Building2, Users, CreditCard, Sparkles, User as UserIcon, Mail, Phone, Moon, Sun, Shield, Plug, Zap, CheckCircle2, Key, Bot } from 'lucide-react'
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

    // AI Integrations
    const [openRouterKey, setOpenRouterKey] = useState('')
    const [aiModel, setAiModel] = useState('google/gemini-2.5-flash-free')
    const [aiConnected, setAiConnected] = useState(false)

    // Load saved settings on mount
    useEffect(() => {
        const savedKey = localStorage.getItem('openRouterKey')
        const savedModel = localStorage.getItem('aiModel')
        if (savedKey) {
            setOpenRouterKey(savedKey)
            setAiConnected(true)
        }
        if (savedModel) setAiModel(savedModel)
    }, [])

    const handleSaveAI = () => {
        if (!openRouterKey) {
            setAiConnected(false)
            localStorage.removeItem('openRouterKey')
            toast({ title: 'Integração Removida', description: 'Chave da API OpenRouter foi removida.', variant: 'destructive' })
            return
        }
        localStorage.setItem('openRouterKey', openRouterKey)
        localStorage.setItem('aiModel', aiModel)
        setAiConnected(true)
        toast({ title: 'Integração Salva', description: 'Credenciais de IA conectadas com sucesso.' })
    }

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
                    <TabsTrigger value="integrations" className="rounded-xl font-bold text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-pure-black data-[state=active]:text-pure-black dark:data-[state=active]:text-white data-[state=active]:shadow-sm px-6 py-2.5 transition-all">
                        <Plug className="w-4 h-4 mr-2" />Integrações
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

                <TabsContent value="integrations">
                    <Card className="border-none bg-white dark:bg-pure-black shadow-sm rounded-3xl overflow-hidden">
                        <CardHeader className="border-b border-black/5 dark:border-white/5 pb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-electric-blue/10 flex items-center justify-center">
                                    <Sparkles className="h-6 w-6 text-electric-blue" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-extrabold text-pure-black dark:text-off-white">Performance Intelligence (IA)</CardTitle>
                                    <CardDescription className="font-semibold text-muted-foreground mt-1">Conecte o motor de Inteligência Artificial para habilitar diagnósticos automáticos.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-8 pt-8 lg:px-10">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-1 space-y-6">
                                    <div className="space-y-4">
                                        <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                            <Key className="w-4 h-4" /> Chave de API (OpenRouter)
                                        </Label>
                                        <Input
                                            type="password"
                                            value={openRouterKey}
                                            onChange={(e) => setOpenRouterKey(e.target.value)}
                                            className="h-14 rounded-2xl bg-black/5 dark:bg-white/5 border-none font-medium focus-visible:ring-electric-blue"
                                            placeholder="sk-or-v1-..."
                                        />
                                        <p className="text-xs font-semibold text-muted-foreground">
                                            A chave é armazenada de forma segura localmente. Obtenha a sua em <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:underline">openrouter.ai</a>.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                            <Bot className="w-4 h-4" /> Modelo de IA Principal
                                        </Label>
                                        <Select value={aiModel} onValueChange={setAiModel}>
                                            <SelectTrigger className="h-14 rounded-2xl bg-black/5 dark:bg-white/5 border-none font-bold">
                                                <SelectValue placeholder="Selecione um modelo..." />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-black/5 dark:border-white/5 shadow-2xl">
                                                <SelectItem value="google/gemini-2.5-flash-free" className="font-bold py-3"><span className="text-xs text-muted-foreground mr-2 font-black uppercase">FREE</span>Google: Gemini 2.5 Flash</SelectItem>
                                                <SelectItem value="cognitivecomputations/dolphin3.0-r1-mistral-24b:free" className="font-bold py-3"><span className="text-xs text-muted-foreground mr-2 font-black uppercase">FREE</span>Dolphin 3.0 (Mistral)</SelectItem>
                                                <SelectItem value="anthropic/claude-3.5-sonnet:beta" className="font-bold py-3"><span className="text-xs bg-mars-orange text-white px-2 py-0.5 rounded-full mr-2 font-black uppercase tracking-widest">PRO</span>Claude 3.5 Sonnet</SelectItem>
                                                <SelectItem value="openai/gpt-4o" className="font-bold py-3"><span className="text-xs bg-mars-orange text-white px-2 py-0.5 rounded-full mr-2 font-black uppercase tracking-widest">PRO</span>OpenAI GPT-4o</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button
                                        onClick={handleSaveAI}
                                        className="w-full h-14 rounded-2xl font-bold bg-pure-black text-white hover:bg-pure-black/80 dark:bg-white dark:text-pure-black transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <Zap className="w-5 h-5 mr-2" /> Salvar Configurações de IA
                                    </Button>
                                </div>

                                <div className="w-full md:w-80 p-6 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex flex-col justify-center gap-4 text-center shrink-0">
                                    <div className="w-20 h-20 mx-auto rounded-full bg-white dark:bg-pure-black shadow-sm flex items-center justify-center border-4 border-black/5 dark:border-white/5">
                                        <Sparkles className="w-10 h-10 text-electric-blue" />
                                    </div>
                                    <h3 className="font-extrabold text-xl text-pure-black dark:text-off-white leading-tight">Status do Agente</h3>
                                    {aiConnected ? (
                                        <Badge className="mx-auto w-max px-4 py-1.5 rounded-full bg-green-500/10 text-green-600 border-none font-bold flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" /> Conectado e Ativo
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="mx-auto w-max px-4 py-1.5 rounded-full bg-black/10 dark:bg-white/10 text-muted-foreground border-none font-bold">
                                            Desconectado
                                        </Badge>
                                    )}
                                    <p className="text-xs font-semibold text-muted-foreground mt-2 px-4 leading-relaxed">
                                        Conecte sua API para liberar diagnósticos em tempo real, respostas inteligentes e sugestões de comunicação no funil de vendas.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
