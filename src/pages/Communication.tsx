import { useState, useEffect } from 'react'
import { Bot, Save, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import useAppStore from '@/stores/main'
import { supabase } from '@/lib/supabase'

type ConfigType = 'daily_report' | 'weekly_report' | 'monthly_report';

interface CommConfig {
    id?: string;
    agency_id: string;
    type: ConfigType;
    is_active: boolean;
    time_to_trigger: string;
    target_roles: string[];
    custom_message: string;
}

export default function Communication() {
    const { activeAgencyId } = useAppStore()
    const [configs, setConfigs] = useState<Record<string, CommConfig>>({})
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (!activeAgencyId) {
            setIsLoading(false)
            return
        }

        const fetchConfigs = async () => {
            setIsLoading(true)
            const { data, error } = await supabase
                .from('communication_configs')
                .select('*')
                .eq('agency_id', activeAgencyId)

            if (error) {
                console.error("Erro ao buscar configurações:", error)
                toast({ title: 'Erro', description: 'Não foi possível carregar as configurações.', variant: 'destructive' })
            } else if (data) {
                const configMap: Record<string, CommConfig> = {}
                data.forEach(item => {
                    configMap[item.type] = item
                })
                setConfigs(configMap)
            }
            setIsLoading(false)
        }
        fetchConfigs()
    }, [activeAgencyId])

    const handleConfigChange = (type: ConfigType, field: keyof CommConfig, value: any) => {
        setConfigs(prev => {
            const existing = prev[type] || {
                agency_id: activeAgencyId || '',
                type,
                is_active: false,
                time_to_trigger: '18:00',
                target_roles: ['Manager', 'Owner'],
                custom_message: ''
            }
            return {
                ...prev,
                [type]: { ...existing, [field]: value }
            }
        })
    }

    const toggleRole = (type: ConfigType, role: string) => {
        const currentConfig = configs[type] || { target_roles: [] }
        const currentRoles = currentConfig.target_roles || []

        const newRoles = currentRoles.includes(role)
            ? currentRoles.filter(r => r !== role)
            : [...currentRoles, role]

        handleConfigChange(type, 'target_roles', newRoles)
    }

    const saveConfig = async (type: ConfigType) => {
        if (!activeAgencyId) {
            toast({ title: 'Aviso', description: 'Selecione uma agência primeiro.' })
            return
        }

        const configData = configs[type]
        if (!configData) return

        setIsSaving(true)

        try {
            if (configData.id) {
                await supabase
                    .from('communication_configs')
                    .update({
                        is_active: configData.is_active,
                        time_to_trigger: configData.time_to_trigger,
                        target_roles: configData.target_roles,
                        custom_message: configData.custom_message
                    })
                    .eq('id', configData.id)
            } else {
                const { data, error } = await supabase
                    .from('communication_configs')
                    .insert({
                        agency_id: activeAgencyId,
                        type: configData.type,
                        is_active: configData.is_active,
                        time_to_trigger: configData.time_to_trigger,
                        target_roles: configData.target_roles,
                        custom_message: configData.custom_message
                    })
                    .select()

                if (data && data[0]) {
                    handleConfigChange(type, 'id', data[0].id)
                }
            }
            toast({ title: 'Sucesso', description: 'Configuração de automação salva.' })
        } catch (error) {
            console.error(error)
            toast({ title: 'Erro', description: 'Ocorreu um erro ao salvar.', variant: 'destructive' })
        } finally {
            setIsSaving(false)
        }
    }

    const automationCards: Array<{ type: ConfigType; title: string; desc: string }> = [
        { type: 'daily_report', title: 'Relatório Diário de Fechamento', desc: 'Envia os totais de leads, vendas e conversão do dia atual.' },
        { type: 'weekly_report', title: 'Relatório Semanal', desc: 'Resumo da semana, performance do time e metas alcançadas.' },
        { type: 'monthly_report', title: 'Fechamento do Mês', desc: 'Consolidado do faturamento mensal e comissões para gestores.' }
    ]

    if (!activeAgencyId) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center">
                <Bot className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-bold mb-2">Nenhuma Agência Selecionada</h3>
                <p className="text-muted-foreground">Selecione uma agência no menu lateral para gerenciar suas automações.</p>
            </div>
        )
    }

    const allRoles = ['Owner', 'Manager', 'Seller', 'RH']

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">WHATSAPP AUTOMATIONS</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-pure-black dark:text-off-white">
                    Automação de <span className="text-green-500">Resultados</span>
                </h1>
                <p className="text-muted-foreground font-medium mt-1">Configure disparos centralizados via WhatsApp para os gestores da agência.</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {isLoading ? (
                    <div className="p-8 text-center text-sm font-bold opacity-50">Carregando automações...</div>
                ) : (
                    automationCards.map((card) => {
                        const config = configs[card.type] || {
                            is_active: false,
                            time_to_trigger: '18:00',
                            target_roles: ['Manager', 'Owner'],
                            custom_message: ''
                        }
                        return (
                            <Card key={card.type} className={`border-none ${config.is_active ? 'bg-white dark:bg-[#111] shadow-xl' : 'bg-black/5 dark:bg-white/5 opacity-80'} rounded-3xl overflow-hidden transition-all duration-300`}>
                                <CardHeader className="border-b border-black/5 dark:border-white/5 pb-5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2.5 rounded-xl ${config.is_active ? 'bg-green-500/10 text-green-500' : 'bg-black/10 dark:bg-white/10 text-muted-foreground'}`}>
                                                <Bot className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg font-extrabold">{card.title}</CardTitle>
                                                <CardDescription className="font-semibold">{card.desc}</CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-full items-center">
                                            <Switch
                                                checked={config.is_active}
                                                onCheckedChange={(v) => handleConfigChange(card.type, 'is_active', v)}
                                                className="data-[state=checked]:bg-green-500 m-1"
                                            />
                                        </div>
                                    </div>
                                </CardHeader>

                                <div className={`transition-all duration-500 overflow-hidden ${config.is_active ? 'max-h-[800px] opacity-100 block' : 'max-h-0 opacity-0 hidden'}`}>
                                    <CardContent className="pt-6 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <Label className="font-extrabold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5" /> Horário de Disparo
                                                </Label>
                                                <Input
                                                    type="time"
                                                    value={config.time_to_trigger}
                                                    onChange={(e) => handleConfigChange(card.type, 'time_to_trigger', e.target.value)}
                                                    className="rounded-xl h-11 border-black/10 dark:border-white/10 font-bold bg-black/5 dark:bg-black w-32"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="font-extrabold text-xs uppercase tracking-widest text-muted-foreground">
                                                    Público Alvo (Perfis Recebedores)
                                                </Label>
                                                <div className="flex flex-wrap gap-2">
                                                    {allRoles.map(r => (
                                                        <Badge
                                                            key={r}
                                                            onClick={() => toggleRole(card.type, r)}
                                                            className={`cursor-pointer border-none font-bold py-1.5 px-3 uppercase text-[10px] tracking-wider transition-colors ${(config.target_roles || []).includes(r)
                                                                    ? 'bg-electric-blue text-white shadow-sm hover:bg-electric-blue/90'
                                                                    : 'bg-black/5 dark:bg-white/10 text-muted-foreground hover:bg-black/10 dark:hover:bg-white/20'
                                                                }`}
                                                        >
                                                            {r}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="font-extrabold text-xs uppercase tracking-widest text-muted-foreground">
                                                Mensagem Adicional / Prefácio (Opcional)
                                            </Label>
                                            <Textarea
                                                value={config.custom_message}
                                                onChange={(e) => handleConfigChange(card.type, 'custom_message', e.target.value)}
                                                placeholder="Insira uma mensagem inicial. O sistema irá concatenar os resultados consolidados (vendas, leads) logo abaixo deste texto."
                                                className="rounded-xl min-h-[100px] border-black/10 dark:border-white/10 resize-none font-medium bg-black/5 dark:bg-black/50"
                                            />
                                            <p className="text-[10px] font-bold text-muted-foreground">* O AutoFlux irá inserir os dados da agência automaticamente ao final destas linhas.</p>
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <Button
                                                onClick={() => saveConfig(card.type)}
                                                disabled={isSaving}
                                                className="rounded-xl font-bold bg-green-500 text-white shadow-lg shadow-green-500/20 hover:bg-green-600 px-6"
                                            >
                                                <Save className="w-4 h-4 mr-2" />
                                                Salvar Configuração
                                            </Button>
                                        </div>
                                    </CardContent>
                                </div>
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    )
}
