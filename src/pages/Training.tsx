import { PlayCircle, Target, ShieldCheck, Trophy, Sparkles } from 'lucide-react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'

export default function Training() {
    const handlePlay = (title: string) => {
        toast({
            title: 'Reproduzindo Treinamento',
            description: `Iniciando: ${title}`,
        })
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                        COACHING
                    </span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-pure-black dark:text-off-white">
                    Plataforma de <span className="text-yellow-500">Treinamento</span>
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <Card className="hyper-glass border-[0.5px] border-white/40 dark:border-white/10 rounded-3xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[60px] pointer-events-none -mt-32 -mr-32"></div>
                        <CardHeader className="pb-4 relative z-10">
                            <CardTitle className="flex items-center gap-3 text-xl font-extrabold text-pure-black dark:text-off-white">
                                <div className="p-2.5 bg-yellow-500/20 rounded-xl">
                                    <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                                </div>
                                Missões da Semana
                            </CardTitle>
                            <CardDescription className="font-semibold text-muted-foreground ml-[52px]">
                                Metas gamificadas para engajamento rápido.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="relative z-10 space-y-4">
                            <div className="bg-white/60 dark:bg-black/40 p-4 rounded-2xl border border-white/30 dark:border-white/10 shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="h-5 w-5 text-green-500" />
                                        <span className="font-extrabold text-sm text-pure-black dark:text-off-white">
                                            Resgatar 3 leads "Sem Contato"
                                        </span>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="font-bold border-green-500/30 text-green-600 bg-green-500/10"
                                    >
                                        1/3 Concluído
                                    </Badge>
                                </div>
                                <Progress
                                    value={33}
                                    className="h-2 bg-black/5 dark:bg-white/10 [&>div]:bg-green-500 rounded-full"
                                />
                            </div>

                            <div className="bg-white/60 dark:bg-black/40 p-4 rounded-2xl border border-white/30 dark:border-white/10 shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-3">
                                        <Target className="h-5 w-5 text-electric-blue" />
                                        <span className="font-extrabold text-sm text-pure-black dark:text-off-white">
                                            Converter 2 Visitas em Proposta
                                        </span>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="font-bold border-electric-blue/30 text-electric-blue bg-electric-blue/10"
                                    >
                                        0/2 Concluído
                                    </Badge>
                                </div>
                                <Progress
                                    value={0}
                                    className="h-2 bg-black/5 dark:bg-white/10 [&>div]:bg-electric-blue rounded-full"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="relative mb-8">
                        <Input
                            placeholder="Buscar treinamentos ou playbooks..."
                            className="h-12 pl-12 rounded-2xl bg-white dark:bg-[#111] border-none shadow-sm focus-visible:ring-yellow-500/50"
                        />
                        <PlayCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>

                    <h3 className="text-xl font-extrabold text-pure-black dark:text-off-white mb-4 flex items-center gap-2">
                        Playbooks de Vendas <Badge className="bg-yellow-500 text-white font-bold border-none">PREMIUM</Badge>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            {
                                title: 'Contorno de Objeções: Preço vs Valor',
                                level: 'Intermediário',
                                time: '12 min',
                                progress: 100,
                            },
                            {
                                title: 'Script de Qualificação Rápida (SDR)',
                                level: 'Iniciante',
                                time: '8 min',
                                progress: 45,
                            },
                            {
                                title: 'Técnicas de Fechamento Agressivo',
                                level: 'Avançado',
                                time: '20 min',
                                progress: 0,
                            },
                            {
                                title: 'Como criar senso de urgência autêntico',
                                level: 'Intermediário',
                                time: '15 min',
                                progress: 10,
                            },
                        ].map((playbook, i) => (
                            <Card
                                key={i}
                                className="border-none bg-white dark:bg-[#111] shadow-sm hover:shadow-md transition-shadow rounded-3xl overflow-hidden group cursor-pointer relative"
                                onClick={() => handlePlay(playbook.title)}
                            >
                                {playbook.progress === 100 && (
                                    <div className="absolute top-3 right-3 z-10">
                                        <Badge className="bg-green-500/20 text-green-600 border-none font-bold text-[8px] uppercase tracking-tighter">Concluído</Badge>
                                    </div>
                                )}
                                <CardContent className="p-5 flex flex-col justify-between h-full">
                                    <div className="mb-4">
                                        <Badge
                                            variant="secondary"
                                            className="mb-3 text-[10px] font-bold uppercase tracking-wider bg-black/5 dark:bg-white/10 text-muted-foreground border-none"
                                        >
                                            {playbook.level}
                                        </Badge>
                                        <h4 className="font-extrabold text-sm text-pure-black dark:text-off-white leading-tight">
                                            {playbook.title}
                                        </h4>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground">
                                            <span>Progresso</span>
                                            <span>{playbook.progress}%</span>
                                        </div>
                                        <Progress value={playbook.progress} className="h-1 bg-black/5 dark:bg-white/10 [&>div]:bg-yellow-500" />
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                                                <PlayCircle className="w-3 h-3" /> {playbook.time}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full bg-yellow-500/10 text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition-colors"
                                            >
                                                <PlayCircle className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="hyper-glass border-[0.5px] border-white/40 dark:border-white/10 rounded-3xl">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-electric-blue" /> Microlições
                                Diárias
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-white/50 dark:bg-black/50 border border-white/20 rounded-2xl shadow-sm relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-electric-blue"></div>
                                <h5 className="font-extrabold text-sm text-pure-black dark:text-off-white mb-2">
                                    Padrões de Áudio (WhatsApp)
                                </h5>
                                <p className="text-xs font-semibold text-muted-foreground mb-4 leading-relaxed">
                                    Aprenda a estruturar áudios curtos que aumentam a taxa de
                                    resposta em 30%.
                                </p>
                                <Button
                                    size="sm"
                                    onClick={() => handlePlay('Padrões de Áudio')}
                                    className="w-full rounded-xl font-bold bg-pure-black text-white hover:bg-pure-black/80 dark:bg-white dark:text-pure-black shadow-sm"
                                >
                                    Ouvir Exemplo (1:30)
                                </Button>
                            </div>
                            <div className="p-4 bg-white/50 dark:bg-black/50 border border-white/20 rounded-2xl shadow-sm relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-mars-orange"></div>
                                <h5 className="font-extrabold text-sm text-pure-black dark:text-off-white mb-2">
                                    Gatilho da Escassez
                                </h5>
                                <p className="text-xs font-semibold text-muted-foreground mb-4 leading-relaxed">
                                    Como informar sobre outros interessados sem parecer pressão
                                    falsa.
                                </p>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handlePlay('Gatilho da Escassez')}
                                    className="w-full rounded-xl font-bold border-white/20 hover:bg-white/50 dark:hover:bg-white/10"
                                >
                                    Ler Script
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
