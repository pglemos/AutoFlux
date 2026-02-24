import { useState } from 'react'
import { Settings as SettingsIcon, Moon, Sun, Shield, Users, Plug, Link2, Zap } from 'lucide-react'
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
import useAppStore from '@/stores/main'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export default function Settings() {
    const { theme, setTheme } = useTheme()
    const { role, setRole } = useAuth()
    const { chainedFunnel, setChainedFunnel, calendarIntegrations, setCalendarIntegration, users, addUser, deleteUser } = useAppStore()
    const [userOpen, setUserOpen] = useState(false)
    const [newName, setNewName] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [newRole, setNewRole] = useState<Role>('Seller')

    const handleAddUser = () => {
        if (!newName || !newEmail) return
        addUser({ name: newName, email: newEmail, role: newRole })
        toast({ title: 'Usuário Criado' }); setUserOpen(false); setNewName(''); setNewEmail('')
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-electric-blue"></div><span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">SISTEMA</span></div>
                <h1 className="text-4xl font-extrabold tracking-tight text-pure-black dark:text-off-white"><span className="text-electric-blue">Configurações</span></h1>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="bg-white/50 dark:bg-black/50 p-1 rounded-2xl border border-white/30 dark:border-white/5 mb-8">
                    <TabsTrigger value="general" className="rounded-xl font-bold text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-[#111] data-[state=active]:shadow-sm px-6"><SettingsIcon className="w-4 h-4 mr-2" />Geral</TabsTrigger>
                    <TabsTrigger value="users" className="rounded-xl font-bold text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-[#111] data-[state=active]:shadow-sm px-6"><Users className="w-4 h-4 mr-2" />Usuários</TabsTrigger>
                    <TabsTrigger value="integrations" className="rounded-xl font-bold text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-[#111] data-[state=active]:shadow-sm px-6"><Plug className="w-4 h-4 mr-2" />Integrações</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                    <Card className="border-none bg-white dark:bg-[#111] shadow-sm rounded-3xl overflow-hidden">
                        <CardHeader><CardTitle className="text-lg font-extrabold flex items-center gap-2"><Moon className="w-5 h-5 text-electric-blue" /> Aparência</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-white/5">
                                <div><Label className="font-bold text-sm">Modo Escuro</Label><p className="text-xs text-muted-foreground font-medium mt-0.5">Alternar entre temas claro e escuro</p></div>
                                <Switch checked={theme === 'dark'} onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none bg-white dark:bg-[#111] shadow-sm rounded-3xl overflow-hidden">
                        <CardHeader><CardTitle className="text-lg font-extrabold flex items-center gap-2"><Shield className="w-5 h-5 text-mars-orange" /> Controle de Acesso (RBAC)</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-white/5">
                                <div><Label className="font-bold text-sm">Perfil Ativo de Teste</Label><p className="text-xs text-muted-foreground font-medium mt-0.5">Simular diferentes perfis de acesso</p></div>
                                <Select value={role} onValueChange={(v) => { setRole(v as Role); toast({ title: 'Perfil Alterado', description: `Agora você é: ${v}` }) }}>
                                    <SelectTrigger className="w-[180px] rounded-xl font-bold"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-xl"><SelectItem value="Owner">Dono</SelectItem><SelectItem value="Manager">Gestor</SelectItem><SelectItem value="Seller">Vendedor</SelectItem><SelectItem value="RH">RH</SelectItem><SelectItem value="Consultoria">Consultoria</SelectItem></SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none bg-white dark:bg-[#111] shadow-sm rounded-3xl overflow-hidden">
                        <CardHeader><CardTitle className="text-lg font-extrabold flex items-center gap-2"><Zap className="w-5 h-5 text-electric-blue" /> Regras de Negócio</CardTitle></CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-white/5">
                                <div><Label className="font-bold text-sm">Chained Funnel (Funil Encadeado)</Label><p className="text-xs text-muted-foreground font-medium mt-0.5">Impede que leads pulem etapas do funil</p></div>
                                <Switch checked={chainedFunnel} onCheckedChange={(v) => { setChainedFunnel(v); toast({ title: v ? 'Funil Encadeado Ativado' : 'Funil Encadeado Desativado' }) }} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users" className="space-y-6">
                    <Card className="border-none bg-white dark:bg-[#111] shadow-sm rounded-3xl overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-black/5 dark:border-white/5">
                            <CardTitle className="text-lg font-extrabold">Usuários do Sistema</CardTitle>
                            <Button onClick={() => setUserOpen(true)} className="rounded-xl font-bold bg-electric-blue text-white">+ Novo Usuário</Button>
                        </CardHeader>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-black/5 dark:bg-white/5"><TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 pl-6">Nome</TableHead>
                                    <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4">Email</TableHead>
                                    <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4">Perfil</TableHead>
                                    <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 pr-6">Ações</TableHead>
                                </TableRow></TableHeader>
                                <TableBody>{users.map((u) => (
                                    <TableRow key={u.id} className="border-none hover:bg-black/5 dark:hover:bg-white/5">
                                        <TableCell className="font-extrabold text-sm py-4 pl-6">{u.name}</TableCell>
                                        <TableCell className="text-sm py-4 text-muted-foreground font-bold">{u.email}</TableCell>
                                        <TableCell className="py-4"><Badge variant="secondary" className="font-bold">{u.role}</Badge></TableCell>
                                        <TableCell className="py-4 pr-6"><Button variant="ghost" size="sm" onClick={() => { deleteUser(u.id); toast({ title: 'Usuário removido' }) }} className="rounded-xl text-mars-orange font-bold text-xs">Remover</Button></TableCell>
                                    </TableRow>
                                ))}</TableBody>
                            </Table>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="integrations" className="space-y-6">
                    <Card className="border-none bg-white dark:bg-[#111] shadow-sm rounded-3xl overflow-hidden">
                        <CardHeader><CardTitle className="text-lg font-extrabold flex items-center gap-2"><Link2 className="w-5 h-5 text-electric-blue" /> Integrações</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            {mockIntegrations.map((int) => (
                                <div key={int.name} className="flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className={cn('w-2 h-2 rounded-full', int.status === 'connected' ? 'bg-green-500' : 'bg-red-400')}></div>
                                        <span className="font-bold text-sm text-pure-black dark:text-off-white">{int.name}</span>
                                    </div>
                                    <Badge variant={int.status === 'connected' ? 'default' : 'secondary'} className="font-bold text-xs">{int.status === 'connected' ? 'Conectado' : 'Desconectado'}</Badge>
                                </div>
                            ))}
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-white/5">
                                <div><Label className="font-bold text-sm">Google Calendar</Label></div>
                                <Switch checked={calendarIntegrations.google} onCheckedChange={(v) => setCalendarIntegration('google', v)} />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-white/5">
                                <div><Label className="font-bold text-sm">Outlook Calendar</Label></div>
                                <Switch checked={calendarIntegrations.outlook} onCheckedChange={(v) => setCalendarIntegration('outlook', v)} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Dialog open={userOpen} onOpenChange={setUserOpen}>
                <DialogContent className="sm:max-w-[400px] rounded-3xl">
                    <DialogHeader><DialogTitle className="font-extrabold text-xl">Novo Usuário</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2"><Label>Nome</Label><Input value={newName} onChange={(e) => setNewName(e.target.value)} className="rounded-xl" /></div>
                        <div className="space-y-2"><Label>Email</Label><Input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="rounded-xl" /></div>
                        <div className="space-y-2"><Label>Perfil</Label>
                            <Select value={newRole} onValueChange={(v) => setNewRole(v as Role)}><SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="Owner">Dono</SelectItem><SelectItem value="Manager">Gestor</SelectItem><SelectItem value="Seller">Vendedor</SelectItem><SelectItem value="RH">RH</SelectItem><SelectItem value="Consultoria">Consultoria</SelectItem></SelectContent></Select></div>
                    </div>
                    <DialogFooter><Button variant="ghost" onClick={() => setUserOpen(false)} className="rounded-xl font-bold">Cancelar</Button><Button onClick={handleAddUser} disabled={!newName || !newEmail} className="rounded-xl font-bold bg-electric-blue text-white">Criar</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
