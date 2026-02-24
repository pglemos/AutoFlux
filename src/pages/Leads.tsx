import { useState } from 'react'
import { Search, Filter as FilterIcon, Phone, Mail, Clock, TrendingUp, ArrowUpRight, ArrowDownRight, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useAppStore from '@/stores/main'

export default function Leads() {
    const { leads, team } = useAppStore()
    const [search, setSearch] = useState('')
    const [sourceFilter, setSourceFilter] = useState('all')
    const [selected, setSelected] = useState<string | null>(null)

    const filtered = leads.filter((l) => {
        if (sourceFilter !== 'all' && l.source !== sourceFilter) return false
        if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.car.toLowerCase().includes(search.toLowerCase())) return false
        return true
    })

    const selectedLead = selected ? leads.find((l) => l.id === selected) : null

    return (
        <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-8rem)] max-w-7xl mx-auto">
            <div className="md:w-[380px] flex flex-col shrink-0">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-electric-blue"></div><span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">CRM</span></div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-pure-black dark:text-off-white">Hub de <span className="text-electric-blue">Leads</span></h1>
                </div>
                <div className="flex gap-2 mb-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar lead..." className="w-full pl-10 pr-4 h-10 rounded-xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-black/50 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-electric-blue" />
                    </div>
                    <Select value={sourceFilter} onValueChange={setSourceFilter}>
                        <SelectTrigger className="w-[120px] rounded-xl h-10 border-white/20 bg-white/50 dark:bg-black/50 font-bold text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="all">Todas</SelectItem><SelectItem value="Internet">Internet</SelectItem><SelectItem value="Porta">Porta</SelectItem><SelectItem value="Carteira">Carteira</SelectItem></SelectContent>
                    </Select>
                </div>
                <ScrollArea className="flex-1">
                    <div className="space-y-2 pr-2">
                        {filtered.map((lead) => (
                            <Card key={lead.id} onClick={() => setSelected(lead.id)}
                                className={`cursor-pointer border-none shadow-sm rounded-2xl transition-all hover:shadow-md ${selected === lead.id ? 'ring-2 ring-electric-blue bg-electric-blue/5' : 'bg-white dark:bg-[#111]'}`}>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-extrabold text-sm text-pure-black dark:text-off-white truncate">{lead.name}</h3>
                                        <Badge variant="outline" className="text-[9px] shrink-0 font-bold border-none bg-black/5 dark:bg-white/10 rounded-md">{lead.stage}</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-bold mb-2">{lead.car} • {lead.source}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-mono-numbers font-bold text-electric-blue">R$ {(lead.value / 1000).toFixed(0)}k</span>
                                        <div className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500" /><span className="text-[10px] font-bold text-muted-foreground">{lead.score}</span></div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            <div className="flex-1">
                {selectedLead ? (
                    <Card className="h-full border-none bg-white dark:bg-[#111] shadow-sm rounded-3xl overflow-hidden">
                        <CardContent className="p-8">
                            <div className="mb-8">
                                <div className="flex items-center gap-4 mb-2">
                                    <h2 className="text-2xl font-extrabold text-pure-black dark:text-off-white">{selectedLead.name}</h2>
                                    <Badge className="text-xs font-bold bg-electric-blue/10 text-electric-blue border-none rounded-lg">{selectedLead.stage}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground font-bold">{selectedLead.car} • {selectedLead.source} • Resp: {team.find((t) => t.id === selectedLead.sellerId)?.name || 'N/A'}</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="p-4 rounded-2xl bg-electric-blue/5 border border-electric-blue/10">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Valor</span>
                                    <p className="text-xl font-extrabold text-pure-black dark:text-off-white font-mono-numbers mt-1">R$ {(selectedLead.value / 1000).toFixed(0)}k</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-electric-blue/5 border border-electric-blue/10">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Score</span>
                                    <p className="text-xl font-extrabold text-electric-blue font-mono-numbers mt-1">{selectedLead.score}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-mars-orange/5 border border-mars-orange/10">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">SLA</span>
                                    <p className="text-xl font-extrabold text-mars-orange font-mono-numbers mt-1">{selectedLead.slaMinutes}m</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Estagnação</span>
                                    <p className="text-xl font-extrabold text-pure-black dark:text-off-white font-mono-numbers mt-1">{selectedLead.stagnantDays || 0}d</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button className="rounded-xl font-bold bg-electric-blue text-white"><Phone className="w-4 h-4 mr-2" /> Ligar</Button>
                                <Button variant="outline" className="rounded-xl font-bold"><Mail className="w-4 h-4 mr-2" /> Enviar Mensagem</Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground font-bold text-sm">
                        <span className="text-center">Selecione um lead para ver detalhes</span>
                    </div>
                )}
            </div>
        </div>
    )
}
