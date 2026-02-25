import { useState, useEffect } from 'react'
import { Bot, Save, Clock, Smartphone, MessageSquare, History, Zap, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/hooks/use-toast'
import useAppStore from '@/stores/main'
import { supabase } from '@/lib/supabase'
import { generateAIMessage, FREE_AI_MODELS } from '@/lib/openrouter'

type ReportType = 'morning' | 'weekly' | 'monthly';

interface AutomationConfig {
    id?: string;
    agency_id: string;
    report_type: ReportType;
    is_enabled: boolean;
    time_to_trigger: string;
    target_roles: string[];
    custom_message: string;
    ai_context?: string;
}

interface CommInstance {
    id: string;
    name: string;
    status: 'connected' | 'disconnected' | 'pairing';
    provider: string;
}

export default function Communication() {
    const { activeAgencyId, selectedAiModel } = useAppStore()
    const [configs, setConfigs] = useState<Record<string, AutomationConfig>>({})
    const [instances, setInstances] = useState<CommInstance[]>([])
    const [history, setHistory] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [activeTab, setActiveTab] = useState('automations')
    const [waStatus, setWaStatus] = useState<{ connected: boolean; qr: string | null }>({ connected: false, qr: null })
    const [isConnecting, setIsConnecting] = useState(false)
    const [aiPreview, setAiPreview] = useState<string | null>(null)
    const [isGeneratingAI, setIsGeneratingAI] = useState(false)


    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/whatsapp/status', {
                    headers: { 'x-api-key': import.meta.env.VITE_WHATSAPP_API_KEY }
                })
                const data = await res.json()
                setWaStatus(data)
            } catch (err) {
                // Silently fail if service is down
                setWaStatus({ connected: false, qr: null })
            }
        }

        checkStatus()
        const interval = setInterval(checkStatus, 5000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (!activeAgencyId) {
            setIsLoading(false)
            return
        }


        const fetchData = async () => {
            setIsLoading(true)
            try {
                // Fetch Configs
                const { data: configData, error: configError } = await supabase
                    .from('automation_configs')
                    .select('*')
                    .eq('agency_id', activeAgencyId)

                if (configError) throw configError

                const configMap: Record<string, AutomationConfig> = {}
                configData?.forEach(item => {
                    configMap[item.report_type] = item
                })
                setConfigs(configMap)

                // Fetch Instances
                const { data: instanceData } = await supabase
                    .from('communication_instances')
                    .select('*')
                    .eq('agency_id', activeAgencyId)

                setInstances(instanceData || [])

                // Fetch History
                const { data: historyData } = await supabase
                    .from('report_history')
                    .select('*, automation_configs(report_type)')
                    .order('created_at', { ascending: false })
                    .limit(5)

                setHistory(historyData || [])

            } catch (error) {
                console.error("Erro ao buscar dados:", error)
                toast({ title: 'Erro', description: 'Não foi possível carregar as informações.', variant: 'destructive' })
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [activeAgencyId])

    const handleConfigChange = (type: ReportType, field: keyof AutomationConfig, value: any) => {
        setConfigs(prev => {
            const existing = prev[type] || {
                agency_id: activeAgencyId || '',
                report_type: type,
                is_enabled: false,
                time_to_trigger: '18:00',
                target_roles: ['Manager', 'Owner'],
                custom_message: '',
                ai_context: 'Você é um consultor sênior focado em resultados.'
            }
            return {
                ...prev,
                [type]: { ...existing, [field]: value }
            }
        })
    }

    const toggleRole = (type: ReportType, role: string) => {
        const currentConfig = configs[type] || { target_roles: [] }
        const currentRoles = currentConfig.target_roles || []

        const newRoles = currentRoles.includes(role)
            ? currentRoles.filter(r => r !== role)
            : [...currentRoles, role]

        handleConfigChange(type, 'target_roles', newRoles)
    }

    const saveConfig = async (type: ReportType) => {
        if (!activeAgencyId) {
            toast({ title: 'Aviso', description: 'Selecione uma agência primeiro.' })
            return
        }

        const configData = configs[type]
        if (!configData) return

        setIsSaving(true)

        try {
            const dataToSave = {
                agency_id: activeAgencyId,
                report_type: configData.report_type,
                is_enabled: configData.is_enabled,
                time_to_trigger: configData.time_to_trigger,
                target_roles: configData.target_roles,
                custom_message: configData.custom_message,
                ai_context: configData.ai_context
            }

            if (configData.id) {
                const { error } = await supabase
                    .from('automation_configs')
                    .update(dataToSave)
                    .eq('id', configData.id)
                if (error) throw error
            } else {
                const { data, error } = await supabase
                    .from('automation_configs')
                    .insert(dataToSave)
                    .select()
                if (error) throw error
                if (data && data[0]) {
                    handleConfigChange(type, 'id', data[0].id)
                }
            }
            toast({ title: 'Sucesso', description: 'Configuração salva com perfeição.' })
        } catch (error) {
            console.error(error)
            toast({ title: 'Erro', description: 'Ocorreu um erro ao salvar.', variant: 'destructive' })
        } finally {
            setIsSaving(false)
        }
    }

    const triggerReportNow = async (type: ReportType) => {
        const config = configs[type]
        if (!config?.id) {
            toast({ title: 'Aviso', description: 'Salve a configuração antes de testar.', variant: 'default' })
            return
        }

        toast({ title: 'Processando', description: 'A IA está gerando seu relatório...' })

        try {
            const { data, error } = await supabase.functions.invoke('autonomous-reports', {
                body: { type, configId: config.id }
            })

            if (error) throw error

            toast({
                title: 'Relatório Enviado!',
                description: 'O resumo foi processado pela IA e enviado com sucesso.',
                variant: 'default'
            })

            // Refresh history
            const { data: historyData } = await supabase
                .from('report_history')
                .select('*, automation_configs(report_type)')
                .order('created_at', { ascending: false })
                .limit(5)
            setHistory(historyData || [])

        } catch (error) {
            console.error(error)
            toast({ title: 'Erro no Disparo', description: 'Não foi possível enviar o relatório agora.', variant: 'destructive' })
        }
    }

    const generateAIPreview = async (type: ReportType) => {
        setIsGeneratingAI(true)
        try {
            const message = await generateAIMessage({
                type,
                salesCount: 15,
                leadsCount: 32,
                conversionRate: 18.5,
                topSeller: 'Alex',
                stockValue: 3200000
            }, selectedAiModel)
            setAiPreview(message)
            // Auto-fill the custom_message field
            handleConfigChange(type, 'custom_message', message)
            const modelName = FREE_AI_MODELS.find(m => m.id === selectedAiModel)?.name || selectedAiModel
            toast({ title: '🤖 Mensagem gerada por IA', description: `Texto criado pelo modelo ${modelName}.` })
        } catch (error) {
            console.error(error)
            toast({ title: 'Erro na IA', description: 'Não foi possível gerar. Tente novamente.', variant: 'destructive' })
        } finally {
            setIsGeneratingAI(false)
        }
    }

    const automationCards: Array<{ type: ReportType; title: string; desc: string }> = [
        { type: 'morning', title: 'Start Matinal de Performance', desc: 'Resumo focado nos leads acumulados e diretriz AI para os vendedores.' },
        { type: 'weekly', title: 'Performance Semanal AI', desc: 'Análise estratégica da semana, hotspots de conversão e metas batidas.' },
        { type: 'monthly', title: 'Fechamento & BI Mensal', desc: 'Consolidado de faturamento, comissões e visão macro da agência.' }
    ]

    const allRoles = ['Owner', 'Manager', 'Seller', 'RH']

    if (!activeAgencyId) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center">
                <Bot className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-bold mb-2">Selecione uma Agência</h3>
                <p className="text-muted-foreground">O Hub de Comunicação requer o contexto de uma agência ativa.</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex -space-x-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 opacity-50"></div>
                        </div>
                        <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">COMMUNICATION HUB & AI</span>
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tighter text-pure-black dark:text-off-white">
                        Fluxo de <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">Mensageria</span>
                    </h1>
                    <p className="text-muted-foreground font-medium mt-2 max-w-xl text-lg">
                        Centralize suas integrações e configure o cérebro da AutoFlux para disparar insights automáticos via WhatsApp.
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                    <TabsList className="bg-white/50 dark:bg-black/50 p-1.5 rounded-2xl border border-white/30 dark:border-white/5 backdrop-blur-2xl shadow-xl flex-wrap h-auto">
                        <TabsTrigger value="automations" className="rounded-xl font-bold px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-pure-black data-[state=active]:text-pure-black dark:data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
                            <Bot className="w-4 h-4 mr-2" /> Automações
                        </TabsTrigger>
                        <TabsTrigger value="instances" className="rounded-xl font-bold px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-pure-black data-[state=active]:text-pure-black dark:data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
                            <Smartphone className="w-4 h-4 mr-2" /> Instâncias
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="automations" className="space-y-8 mt-0 border-none p-0 outline-none">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Configuration Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {isLoading ? (
                                <div className="h-64 flex flex-col items-center justify-center bg-black/5 dark:bg-white/5 rounded-3xl border border-dashed border-black/10 dark:border-white/10 text-muted-foreground font-bold italic">
                                    <RefreshCw className="w-8 h-8 animate-spin mb-4 opacity-50" />
                                    Calibrando automações...
                                </div>
                            ) : (
                                automationCards.map((card) => {
                                    const config = configs[card.type] || {
                                        is_enabled: false,
                                        time_to_trigger: '08:00',
                                        target_roles: ['Manager', 'Owner'],
                                        custom_message: '',
                                        ai_context: 'Você é um consultor focado em resultados.'
                                    }
                                    return (
                                        <Card key={card.type} className={`border-none overflow-hidden transition-all duration-500 rounded-[2.5rem] ${config.is_enabled ? 'bg-white dark:bg-pure-black shadow-2xl ring-1 ring-black/5 dark:ring-white/10' : 'bg-black/5 dark:bg-white/5 opacity-70 hover:opacity-100'}`}>
                                            <CardHeader className="pb-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex gap-4">
                                                        <div className={`p-4 rounded-[1.25rem] shadow-inner transition-colors duration-500 ${config.is_enabled ? 'bg-green-500 text-white' : 'bg-black/10 dark:bg-white/10 text-muted-foreground'}`}>
                                                            <Zap className="h-6 w-6" />
                                                        </div>
                                                        <div>
                                                            <CardTitle className="text-xl font-black text-pure-black dark:text-off-white">{card.title}</CardTitle>
                                                            <CardDescription className="text-sm font-semibold text-muted-foreground leading-relaxed">
                                                                {card.desc}
                                                            </CardDescription>
                                                        </div>
                                                    </div>
                                                    <Switch
                                                        checked={config.is_enabled}
                                                        onCheckedChange={(v) => handleConfigChange(card.type, 'is_enabled', v)}
                                                        className="data-[state=checked]:bg-green-500 scale-125"
                                                    />
                                                </div>
                                            </CardHeader>

                                            <div className={`transition-all duration-700 ease-in-out overflow-hidden ${config.is_enabled ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                <CardContent className="pt-4 space-y-8 pb-10">
                                                    <hr className="border-black/5 dark:border-white/5" />

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        <div className="space-y-4">
                                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                                                <Clock className="w-3.5 h-3.5 text-green-500" /> Gatilho Temporal
                                                            </Label>
                                                            <Input
                                                                type="time"
                                                                value={config.time_to_trigger}
                                                                onChange={(e) => handleConfigChange(card.type, 'time_to_trigger', e.target.value)}
                                                                className="rounded-2xl h-14 border-none bg-black/5 dark:bg-white/5 font-black text-lg focus-visible:ring-green-500 transition-shadow transition-colors"
                                                            />
                                                        </div>

                                                        <div className="space-y-4">
                                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                                                Alvos de Recebimento
                                                            </Label>
                                                            <div className="flex flex-wrap gap-2">
                                                                {allRoles.map(r => (
                                                                    <Badge
                                                                        key={r}
                                                                        onClick={() => toggleRole(card.type, r)}
                                                                        className={`cursor-pointer border-none font-bold py-2.5 px-4 uppercase text-[10px] tracking-widest transition-all ${(config.target_roles || []).includes(r)
                                                                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                                                                            : 'bg-black/5 dark:bg-white/10 text-muted-foreground hover:bg-black/10'
                                                                            }`}
                                                                    >
                                                                        {r}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                                            Diretriz da IA (Contexto Personalizado)
                                                        </Label>
                                                        <Input
                                                            value={config.ai_context}
                                                            onChange={(e) => handleConfigChange(card.type, 'ai_context', e.target.value)}
                                                            placeholder="Ex: Seja direto e foque no faturamento de hoje."
                                                            className="rounded-2xl h-14 border-none bg-black/5 dark:bg-white/5 font-semibold focus-visible:ring-green-500"
                                                        />
                                                    </div>

                                                    <div className="space-y-4">
                                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                                            Prefácio da Mensagem
                                                        </Label>
                                                        <Textarea
                                                            value={config.custom_message}
                                                            onChange={(e) => handleConfigChange(card.type, 'custom_message', e.target.value)}
                                                            placeholder="Texto que aparecerá antes dos dados consolidados..."
                                                            className="rounded-[2rem] min-h-[120px] border-none bg-black/5 dark:bg-white/5 font-medium resize-none focus-visible:ring-green-500 p-6"
                                                        />
                                                    </div>

                                                    <div className="flex items-center justify-between gap-4 pt-4">
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => generateAIPreview(card.type)}
                                                                disabled={isGeneratingAI}
                                                                className="rounded-2xl font-bold h-14 px-6 border-electric-blue/20 text-electric-blue hover:bg-electric-blue/5"
                                                            >
                                                                <Bot className="w-4 h-4 mr-2" /> {isGeneratingAI ? 'Gerando...' : 'Gerar com IA'}
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => triggerReportNow(card.type)}
                                                                className="rounded-2xl font-bold h-14 px-8 border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground"
                                                            >
                                                                <MessageSquare className="w-4 h-4 mr-2" /> Testar Agora
                                                            </Button>
                                                        </div>

                                                        <Button
                                                            onClick={() => saveConfig(card.type)}
                                                            disabled={isSaving}
                                                            className="rounded-2xl font-black h-14 px-10 bg-green-500 text-white shadow-xl shadow-green-500/20 hover:bg-green-600 transition-all hover:-translate-y-1"
                                                        >
                                                            <Save className="w-4 h-4 mr-2" /> Salvar Configuração
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </div>
                                        </Card>
                                    )
                                })
                            )}
                        </div>

                        {/* Status Column */}
                        <div className="space-y-8">
                            <Card className="border-none bg-gradient-to-br from-pure-black to-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden p-8 text-white min-h-[300px]">
                                <CardTitle className="text-xl font-black uppercase tracking-widest mb-6 flex items-center gap-3">
                                    <Smartphone className="w-6 h-6 text-green-500" /> Conexão WhatsApp
                                </CardTitle>

                                {instances.length > 0 ? (
                                    instances.map(instance => (
                                        <div key={instance.id} className="bg-white/5 rounded-3xl p-6 border border-white/5">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="font-bold text-lg">{instance.name}</span>
                                                <Badge className={`uppercase text-[10px] font-black px-3 py-1 ${instance.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}>
                                                    {instance.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-white/40 font-bold mb-6">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Integração via Evolution API v2
                                            </div>
                                            <Button
                                                onClick={() => setActiveTab('instances')}
                                                className="w-full rounded-2xl bg-white text-pure-black font-black h-12 hover:bg-white/90"
                                            >
                                                Gerenciar Instância
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/30 border border-white/5 mb-2">
                                            {waStatus.connected ? <Bot className="w-8 h-8 text-green-500" /> : <AlertCircle className="w-8 h-8" />}
                                        </div>
                                        <h4 className="font-bold">{waStatus.connected ? 'Conexão Estabelecida' : 'Nenhuma Instância Ativa'}</h4>
                                        <p className="text-sm text-white/40 font-medium">
                                            {waStatus.connected
                                                ? 'Seu WhatsApp está pronto para processar as automações da AutoFlux.'
                                                : 'Você precisa conectar um número de WhatsApp para processar as automações.'}
                                        </p>
                                        {!waStatus.connected && (
                                            <Button
                                                onClick={() => setActiveTab('instances')}
                                                className="mt-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-black h-14 w-full px-8"
                                            >
                                                Conectar WhatsApp
                                            </Button>
                                        )}
                                    </div>
                                )}

                            </Card>

                            <Card className="border-none bg-white dark:bg-pure-black rounded-[2.5rem] shadow-xl ring-1 ring-black/5 dark:ring-white/10 p-8">
                                <CardTitle className="text-xl font-black uppercase tracking-widest mb-6 flex items-center gap-3 text-pure-black dark:text-off-white">
                                    <History className="w-6 h-6 text-blue-500" /> Últimos Disparos
                                </CardTitle>

                                <div className="space-y-6">
                                    {history.length > 0 ? (
                                        history.map((h, i) => (
                                            <div key={h.id} className={`flex gap-4 ${i !== history.length - 1 ? 'pb-6 border-b border-black/5 dark:border-white/5' : ''}`}>
                                                <div className="h-2 w-2 rounded-full bg-green-500 mt-2 shrink-0 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-black text-sm text-pure-black dark:text-off-white uppercase">
                                                            {h.report_type === 'morning' ? 'Matinal' : h.report_type === 'weekly' ? 'Semanal' : 'Mensal'}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-muted-foreground opacity-60">
                                                            {new Date(h.created_at).toLocaleTimeString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground font-medium line-clamp-2 leading-relaxed">
                                                        {h.ai_insight}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-sm font-bold text-muted-foreground opacity-30">
                                            Aguardando primeiro envio...
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="instances" className="mt-0 border-none p-0 outline-none">
                    <Card className="border-none bg-white dark:bg-pure-black shadow-xl rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 ring-1 ring-black/5 dark:ring-white/10">
                        <div className="max-w-2xl mx-auto text-center space-y-8">
                            <div className="w-24 h-24 bg-green-500 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-green-500/30">
                                <Smartphone className="w-12 h-12" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-4xl font-black tracking-tighter text-pure-black dark:text-off-white">Conexão Estratégica</h2>
                                <p className="text-muted-foreground font-semibold text-lg">Use o WhatsApp para entregar resultados em tempo real para gestores e vendedores.</p>
                            </div>

                            <div className="bg-black/5 dark:bg-white/5 rounded-[2.5rem] p-8 border border-black/5 dark:border-white/5">
                                {waStatus.connected ? (
                                    <div className="space-y-6">
                                        <div className="p-10 bg-green-500/10 rounded-3xl border border-green-500/20 text-green-600 dark:text-green-400">
                                            <CheckCircle2 className="w-12 h-12 mx-auto mb-4" />
                                            <p className="font-black text-xl uppercase tracking-tighter">Sincronizado com Sucesso</p>
                                            <p className="font-medium text-sm opacity-80 mt-2">Sua conta está enviando comandos IA via WhatsApp.</p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={async () => {
                                                await fetch('http://localhost:3001/api/whatsapp/restart', {
                                                    method: 'POST',
                                                    headers: { 'x-api-key': import.meta.env.VITE_WHATSAPP_API_KEY }
                                                })
                                                toast({ title: 'Reiniciando', description: 'O serviço de WhatsApp está sendo reiniciado.' })
                                            }}
                                            className="w-full rounded-2xl h-14 border-black/10 dark:border-white/10 font-bold"
                                        >
                                            <RefreshCw className="w-4 h-4 mr-2" /> Desconectar ou Reiniciar
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {waStatus.qr ? (
                                            <div className="space-y-6">
                                                <div className="bg-white p-4 rounded-3xl inline-block mx-auto shadow-2xl">
                                                    <img src={waStatus.qr} alt="WhatsApp QR Code" className="w-64 h-64" />
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="font-bold text-pure-black dark:text-off-white">Escaneie com seu WhatsApp</p>
                                                    <p className="text-sm text-muted-foreground font-medium">Vá em Configurações &gt; Aparelhos Conectados &gt; Conectar um Aparelho</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                <div className="w-64 h-64 bg-black/5 dark:bg-white/5 rounded-3xl mx-auto flex flex-col items-center justify-center text-muted-foreground border border-dashed border-black/10 dark:border-white/10">
                                                    <RefreshCw className="w-8 h-8 animate-spin mb-4" />
                                                    <p className="text-xs font-bold uppercase tracking-widest">Gerando QR Code...</p>
                                                </div>
                                                <Button
                                                    disabled={isConnecting}
                                                    onClick={async () => {
                                                        setIsConnecting(true)
                                                        try {
                                                            await fetch('http://localhost:3001/api/whatsapp/restart', {
                                                                method: 'POST',
                                                                headers: { 'x-api-key': import.meta.env.VITE_WHATSAPP_API_KEY }
                                                            })
                                                            toast({ title: 'Iniciando', description: 'Aguarde o QR Code ser gerado.' })
                                                        } finally {
                                                            setIsConnecting(false)
                                                        }
                                                    }}
                                                    className="w-full rounded-[2rem] bg-pure-black dark:bg-white text-white dark:text-pure-black font-black h-16 text-lg hover:opacity-90 shadow-2xl"
                                                >
                                                    Gerar QR Code de Conexão
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>


                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-loose">
                                <AlertCircle className="w-3 h-3 inline mr-1 text-amber-500" />
                                Garantimos a conformidade com as diretrizes da plataforma via canais oficiais e APIs de terceiros robustas.
                            </p>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
