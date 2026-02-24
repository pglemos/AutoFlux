import { useState } from 'react'
import { Clock, AlertTriangle, ShieldAlert, Plus, Edit2, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { toast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import useAppStore, { LeadStage, Lead } from '@/stores/main'

const STAGES: LeadStage[] = ['Lead', 'Contato', 'Agendamento', 'Visita', 'Proposta', 'Venda']

export default function Funnel() {
  const { leads, addLead, updateLead, deleteLead, team, commissionRules, addCommission, chainedFunnel } = useAppStore()
  const [lossDialogOpen, setLossDialogOpen] = useState(false)
  const [blockDialogOpen, setBlockDialogOpen] = useState(false)
  const [leadDialogOpen, setLeadDialogOpen] = useState(false)
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [lossReason, setLossReason] = useState<string>('')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [sellerFilter, setSellerFilter] = useState('all')
  const [form, setForm] = useState<Partial<Lead>>({ name: '', car: '', source: 'Internet', sellerId: '', value: 0 })

  const moveLead = (id: string, newStage: LeadStage) => {
    const lead = leads.find((l) => l.id === id)
    if (!lead) return
    if (chainedFunnel) {
      const currentIndex = STAGES.indexOf(lead.stage)
      const targetIndex = STAGES.indexOf(newStage)
      if (targetIndex > currentIndex + 1) { setBlockDialogOpen(true); return }
    }
    updateLead(id, { stage: newStage, stagnantDays: 0 })
    toast({ title: 'Avanço no Funil', description: `Lead movido para ${newStage}.` })
    if (newStage === 'Venda') {
      const marginPerc = 10
      const marginValue = lead.value * (marginPerc / 100)
      let comissionPerc = 15
      const rule = commissionRules.find((r) => (r.marginMin === undefined || marginPerc >= r.marginMin) && (r.marginMax === undefined || marginPerc <= r.marginMax))
      if (rule) comissionPerc = rule.percentage
      const comission = marginValue * (comissionPerc / 100)
      const sellerName = team.find((t) => t.id === lead.sellerId)?.name || 'Vendedor Desconhecido'
      addCommission({ seller: sellerName, car: lead.car, date: new Date().toLocaleDateString('pt-BR'), margin: `${marginPerc.toFixed(1)}%`, comission })
      toast({ title: 'Venda Concluída!', description: `Comissão gerada automaticamente.` })
    }
  }

  const handleLost = () => {
    if (selectedLeadId && lossReason) {
      updateLead(selectedLeadId, { stage: 'Perdido', lossReason })
      setLossDialogOpen(false)
      toast({ title: 'Lead Perdido', description: `Motivo: ${lossReason}`, variant: 'destructive' })
    }
  }

  const openLeadDialog = (lead?: Lead) => {
    if (lead) { setSelectedLeadId(lead.id); setForm(lead) }
    else { setSelectedLeadId(null); setForm({ name: '', car: '', source: 'Internet', sellerId: '', value: 0, stage: 'Lead' }) }
    setLeadDialogOpen(true)
  }

  const saveLead = () => {
    if (!form.name || !form.car) return
    if (selectedLeadId) { updateLead(selectedLeadId, form); toast({ title: 'Lead Atualizado' }) }
    else { addLead({ ...(form as any), score: 80, slaMinutes: 0 }); toast({ title: 'Lead Adicionado' }) }
    setLeadDialogOpen(false)
  }

  const filteredLeads = leads.filter((l) => {
    if (sourceFilter !== 'all' && l.source !== sourceFilter) return false
    if (sellerFilter !== 'all' && l.sellerId !== sellerFilter) return false
    return true
  })

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 shrink-0 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-mars-orange animate-pulse"></div>
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">CHAINED FUNNEL</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-pure-black dark:text-off-white">Fluidez do <span className="text-electric-blue">Funil</span></h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[140px] rounded-xl h-10 border-white/20 bg-white/50 dark:bg-black/50 font-bold text-sm"><SelectValue placeholder="Origem" /></SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Todas Origens</SelectItem>
              <SelectItem value="Internet">Internet</SelectItem>
              <SelectItem value="Porta">Porta</SelectItem>
              <SelectItem value="Carteira">Carteira</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sellerFilter} onValueChange={setSellerFilter}>
            <SelectTrigger className="w-[150px] rounded-xl h-10 border-white/20 bg-white/50 dark:bg-black/50 font-bold text-sm"><SelectValue placeholder="Vendedor" /></SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Todos Vendedores</SelectItem>
              {team.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={() => openLeadDialog()} className="rounded-full px-6 font-bold bg-pure-black text-white dark:bg-white dark:text-pure-black shadow-elevation">
            <Plus className="w-4 h-4 mr-2" /> Novo Lead
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 w-full whitespace-nowrap pb-4">
        <div className="flex gap-4 h-full inline-flex items-start p-1">
          {STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.stage === stage)
            return (
              <div key={stage} className="w-[320px] flex flex-col h-full bg-white/30 dark:bg-black/30 backdrop-blur-md rounded-3xl border border-white/50 dark:border-white/5 shadow-sm">
                <div className="p-5 flex justify-between items-center shrink-0">
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-pure-black dark:text-off-white">{stage}</h3>
                  <Badge variant="secondary" className="font-mono-numbers bg-black/5 dark:bg-white/10 text-pure-black dark:text-white border-none rounded-lg px-2.5">{stageLeads.length}</Badge>
                </div>
                <ScrollArea className="flex-1 px-4 pb-4">
                  <div className="space-y-3">
                    {stageLeads.map((lead) => (
                      <LeadCard key={lead.id} lead={lead} sellerName={team.find((t) => t.id === lead.sellerId)?.name}
                        onMove={(s) => moveLead(lead.id, s)} onLost={() => { setSelectedLeadId(lead.id); setLossDialogOpen(true) }}
                        onEdit={() => openLeadDialog(lead)} onDelete={() => deleteLead(lead.id)} />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <Dialog open={leadDialogOpen} onOpenChange={setLeadDialogOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-3xl">
          <DialogHeader><DialogTitle className="font-extrabold text-xl">{selectedLeadId ? 'Editar Lead' : 'Novo Lead'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2"><Label>Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl" /></div>
            <div className="space-y-2"><Label>Veículo de Interesse</Label><Input value={form.car} onChange={(e) => setForm({ ...form, car: e.target.value })} className="rounded-xl" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Origem</Label>
                <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}><SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Internet">Internet</SelectItem><SelectItem value="Porta">Porta</SelectItem><SelectItem value="Carteira">Carteira</SelectItem></SelectContent></Select>
              </div>
              <div className="space-y-2"><Label>Valor (R$)</Label><Input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} className="rounded-xl" /></div>
            </div>
            <div className="space-y-2"><Label>Vendedor Responsável</Label>
              <Select value={form.sellerId} onValueChange={(v) => setForm({ ...form, sellerId: v })}><SelectTrigger className="rounded-xl"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>{team.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setLeadDialogOpen(false)} className="rounded-xl font-bold">Cancelar</Button>
            <Button onClick={saveLead} disabled={!form.name || !form.car} className="rounded-xl font-bold bg-electric-blue text-white">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={lossDialogOpen} onOpenChange={setLossDialogOpen}>
        <DialogContent className="rounded-3xl sm:max-w-[400px]">
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-mars-orange font-extrabold text-xl"><AlertTriangle className="h-5 w-5" /> Motivo de Perda</DialogTitle></DialogHeader>
          <div className="py-4 space-y-2">
            <Select onValueChange={setLossReason}><SelectTrigger className="rounded-xl"><SelectValue placeholder="Selecione o motivo" /></SelectTrigger>
              <SelectContent><SelectItem value="Preço">Preço alto</SelectItem><SelectItem value="Financiamento">Reprovado no Financiamento</SelectItem><SelectItem value="Concorrente">Comprou no Concorrente</SelectItem><SelectItem value="Sem Contato">Não atende / Sem Contato</SelectItem></SelectContent></Select>
          </div>
          <DialogFooter><Button onClick={handleLost} disabled={!lossReason} className="rounded-xl font-bold bg-mars-orange text-white w-full">Confirmar Perda</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent className="rounded-3xl sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-mars-orange font-extrabold text-xl"><ShieldAlert className="h-5 w-5" /> Avanço Bloqueado</DialogTitle>
            <DialogDescription className="font-semibold text-muted-foreground mt-2">A política de <strong>Chained Funnel</strong> está ativa. Você não pode pular etapas.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4"><Button onClick={() => setBlockDialogOpen(false)} className="w-full rounded-xl font-bold bg-pure-black text-white">Entendido</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function LeadCard({ lead, sellerName, onMove, onLost, onEdit, onDelete }: {
  lead: Lead; sellerName?: string; onMove: (s: LeadStage) => void; onLost: () => void; onEdit: () => void; onDelete: () => void
}) {
  return (
    <Card className={cn('shadow-sm transition-all duration-300 group rounded-2xl overflow-hidden relative',
      lead.stagnantDays && lead.stagnantDays >= 2 ? 'border border-mars-orange/50 bg-mars-orange/[0.02]' : 'border-none bg-white dark:bg-[#111] hover:shadow-md')}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="font-extrabold text-sm truncate pr-2 text-pure-black dark:text-off-white">{lead.name}</div>
          <Badge variant="outline" className="text-[10px] px-2 py-0.5 h-6 font-mono-numbers border-none rounded-lg font-bold bg-black/5 dark:bg-white/10 text-muted-foreground">
            <Clock className="w-3 h-3 mr-1 inline" />{lead.slaMinutes}m
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground mb-3 font-bold flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <span className="text-electric-blue bg-electric-blue/10 px-1.5 py-0.5 rounded-md">{lead.car}</span>
            <span className="font-mono-numbers text-pure-black dark:text-off-white">R$ {lead.value / 1000}k</span>
          </div>
          <span className="text-[9px] uppercase tracking-widest">Resp: {sellerName || 'N/A'} • {lead.source}</span>
        </div>
        <div className="flex justify-between items-center mt-2 pt-3 border-t border-black/5 dark:border-white/5">
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit() }} className="h-7 w-7 rounded-full text-muted-foreground hover:text-electric-blue"><Edit2 className="h-3 w-3" /></Button>
            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onDelete() }} className="h-7 w-7 rounded-full text-muted-foreground hover:text-mars-orange"><Trash2 className="h-3 w-3" /></Button>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="ghost" className="h-7 text-[10px] px-2 font-bold rounded-lg text-mars-orange hover:bg-mars-orange/10" onClick={(e) => { e.stopPropagation(); onLost() }}>Perda</Button>
            {lead.stage !== 'Venda' && (
              <Button size="sm" variant="secondary" className="h-7 text-[10px] px-3 font-bold rounded-lg bg-electric-blue text-white hover:bg-electric-blue/90 shadow-sm"
                onClick={(e) => { e.stopPropagation(); const currentIndex = STAGES.indexOf(lead.stage); if (currentIndex < STAGES.length - 1) onMove(STAGES[currentIndex + 1]) }}>Avançar</Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
