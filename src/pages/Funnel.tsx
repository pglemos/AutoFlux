import { useState, useCallback } from 'react'
import { Clock, AlertTriangle, ShieldAlert, Plus, Edit2, Trash2, GripVertical } from 'lucide-react'
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
import { useAuth } from '@/components/auth-provider'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

const STAGES: LeadStage[] = ['Lead', 'Contato', 'Agendamento', 'Visita', 'Proposta', 'Venda']

export default function Funnel() {
  const { role } = useAuth()
  const { leads, addLead, updateLead, deleteLead, team, commissionRules, addCommission, chainedFunnel, activeAgencyId } = useAppStore()
  const [lossDialogOpen, setLossDialogOpen] = useState(false)
  const [blockDialogOpen, setBlockDialogOpen] = useState(false)
  const [leadDialogOpen, setLeadDialogOpen] = useState(false)
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [lossReason, setLossReason] = useState<string>('')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [sellerFilter, setSellerFilter] = useState('all')
  const [form, setForm] = useState<Partial<Lead>>({ name: '', car: '', source: 'Internet', sellerId: '', value: 0 })

  const processMove = useCallback((id: string, newStage: LeadStage) => {
    const lead = leads.find((l) => l.id === id)
    if (!lead) return

    if (chainedFunnel) {
      const currentIndex = STAGES.indexOf(lead.stage)
      const targetIndex = STAGES.indexOf(newStage)
      if (targetIndex > currentIndex + 1) {
        setBlockDialogOpen(true)
        return
      }
    }

    updateLead(id, { stage: newStage, stagnantDays: 0 })
    toast({ title: 'Avanço no Funil', description: `Lead movido para ${newStage}.` })

    if (newStage === 'Venda') {
      const marginPerc = 10
      const marginValue = lead.value * (marginPerc / 100)
      let comissionPerc = 15
      const rule = commissionRules.find((r) =>
        (r.marginMin === undefined || marginPerc >= r.marginMin) &&
        (r.marginMax === undefined || marginPerc <= r.marginMax)
      )
      if (rule) comissionPerc = rule.percentage
      const comission = marginValue * (comissionPerc / 100)
      const sellerName = team.find((t) => t.id === lead.sellerId)?.name || 'Vendedor Desconhecido'
      addCommission({
        seller: sellerName,
        sellerId: lead.sellerId,
        car: lead.car,
        date: new Date().toISOString(),
        margin: `${marginPerc.toFixed(1)}%`,
        comission
      })
      toast({ title: 'Venda Concluída!', description: `Comissão gerada automaticamente.` })
    }
  }, [leads, chainedFunnel, updateLead, commissionRules, team, addCommission])

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const newStage = destination.droppableId as LeadStage
    processMove(draggableId, newStage)
  }

  const handleLost = () => {
    if (selectedLeadId && lossReason) {
      updateLead(selectedLeadId, { stage: 'Perdido', lossReason })
      setLossDialogOpen(false)
      toast({ title: 'Lead Perdido', description: `Motivo: ${lossReason}`, variant: 'destructive' })
    }
  }

  const openLeadDialog = (lead?: Lead) => {
    if (lead) {
      setSelectedLeadId(lead.id)
      setForm(lead)
    } else {
      setSelectedLeadId(null)
      setForm({ name: '', car: '', source: 'Internet', sellerId: '', value: 0, stage: 'Lead' })
    }
    setLeadDialogOpen(true)
  }

  const saveLead = () => {
    if (!form.name || !form.car) return
    if (selectedLeadId) {
      updateLead(selectedLeadId, form)
      toast({ title: 'Lead Atualizado' })
    } else {
      addLead({ ...(form as any), score: 80, slaMinutes: 0 })
      toast({ title: 'Lead Adicionado' })
    }
    setLeadDialogOpen(false)
  }

  const filteredLeads = leads.filter((l) => {
    if (sourceFilter !== 'all' && l.source !== sourceFilter) return false
    if (sellerFilter !== 'all' && l.sellerId !== sellerFilter) return false

    // Filter by active agency if Admin
    if (role === 'Admin' && activeAgencyId) {
      if (l.agencyId !== activeAgencyId) return false
    }

    return true
  })

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col max-w-[1600px] mx-auto pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 shrink-0 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-mars-orange animate-pulse"></div>
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">AUTOPERF CRM</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-pure-black dark:text-off-white">Pipeline de <span className="text-electric-blue">Vendas</span></h1>
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

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 overflow-x-auto overflow-y-hidden no-scrollbar pb-4">
          <div className="flex gap-4 h-full min-w-max px-1">
            {STAGES.map((stage) => {
              const stageLeads = filteredLeads.filter((l) => l.stage === stage)
              return (
                <div key={stage} className="w-[320px] flex flex-col h-full bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-[2.5rem] overflow-hidden shrink-0">
                  <div className="p-6 flex justify-between items-center shrink-0">
                    <h3 className="font-extrabold text-sm uppercase tracking-wider text-pure-black dark:text-off-white">{stage}</h3>
                    <Badge variant="secondary" className="font-mono-numbers bg-black/5 dark:bg-white/10 text-pure-black dark:text-white border-none rounded-xl px-3 py-1">
                      {stageLeads.length}
                    </Badge>
                  </div>

                  <Droppable droppableId={stage}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={cn("flex-1 px-4 pb-4 space-y-4 transition-colors rounded-b-[2.5rem]", snapshot.isDraggingOver ? "bg-electric-blue/5" : "bg-transparent")}
                      >
                        {stageLeads.map((lead, index) => (
                          <Draggable key={lead.id} draggableId={lead.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={snapshot.isDragging ? "z-50" : ""}
                              >
                                <LeadCard
                                  lead={lead}
                                  sellerName={team.find((t) => t.id === lead.sellerId)?.name}
                                  onLost={() => { setSelectedLeadId(lead.id); setLossDialogOpen(true) }}
                                  onEdit={() => openLeadDialog(lead)}
                                  onDelete={() => deleteLead(lead.id)}
                                  isDragging={snapshot.isDragging}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              )
            })}
          </div>
        </div>
      </DragDropContext>

      <Dialog open={leadDialogOpen} onOpenChange={setLeadDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader><DialogTitle>{selectedLeadId ? 'Editar Lead' : 'Novo Lead'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2"><Label>Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl" /></div>
            <div className="space-y-2"><Label>Veículo de Interesse</Label><Input value={form.car} onChange={(e) => setForm({ ...form, car: e.target.value })} className="rounded-xl" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Origem</Label>
                <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}><SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl"><SelectItem value="Internet">Internet</SelectItem><SelectItem value="Porta">Porta</SelectItem><SelectItem value="Carteira">Carteira</SelectItem></SelectContent></Select>
              </div>
              <div className="space-y-2"><Label>Valor (R$)</Label><Input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} className="rounded-xl" /></div>
            </div>
            <div className="space-y-2"><Label>Vendedor Responsável</Label>
              <Select value={form.sellerId} onValueChange={(v) => setForm({ ...form, sellerId: v })}><SelectTrigger className="rounded-xl"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent className="rounded-xl">{team.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setLeadDialogOpen(false)} className="rounded-xl font-bold">Cancelar</Button>
            <Button onClick={saveLead} disabled={!form.name || !form.car} className="rounded-xl font-bold bg-electric-blue text-white shadow-lg shadow-electric-blue/20">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={lossDialogOpen} onOpenChange={setLossDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader><DialogTitle className="flex items-center gap-3 text-mars-orange"><AlertTriangle className="h-6 w-6" /> Registro de Perda</DialogTitle></DialogHeader>
          <div className="py-4 space-y-2">
            <Label className="font-bold text-muted-foreground">Qual o motivo da desistência?</Label>
            <Select onValueChange={setLossReason}><SelectTrigger className="rounded-xl"><SelectValue placeholder="Selecione o motivo" /></SelectTrigger>
              <SelectContent className="rounded-xl"><SelectItem value="Preço">Preço alto</SelectItem><SelectItem value="Financiamento">Reprovado no Financiamento</SelectItem><SelectItem value="Concorrente">Comprou no Concorrente</SelectItem><SelectItem value="Sem Contato">Não atende / Sem Contato</SelectItem></SelectContent></Select>
          </div>
          <DialogFooter><Button onClick={handleLost} disabled={!lossReason} className="rounded-xl font-bold bg-mars-orange text-white w-full shadow-lg shadow-mars-orange/20">Confirmar Perda</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-mars-orange"><ShieldAlert className="h-6 w-6" /> Processo Interrompido</DialogTitle>
            <DialogDescription className="font-semibold text-muted-foreground mt-4 leading-relaxed">
              A política de <strong>Chained Funnel</strong> está ativa. <br /><br />
              A conformidade do processo exige que o lead passe por todas as etapas obrigatórias. Pular etapas compromete a integridade dos dados e o SLA de atendimento.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6"><Button onClick={() => setBlockDialogOpen(false)} className="w-full rounded-xl font-bold bg-pure-black text-white hover:bg-pure-black/90 dark:bg-white dark:text-pure-black">Entendido, vou seguir o fluxo</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function LeadCard({ lead, sellerName, onLost, onEdit, onDelete, isDragging }: {
  lead: Lead; sellerName?: string; onLost: () => void; onEdit: () => void; onDelete: () => void; isDragging?: boolean
}) {
  return (
    <Card className={cn('shadow-elevation transition-all duration-300 group rounded-[2rem] overflow-hidden relative border-none bg-white dark:bg-black',
      isDragging ? 'shadow-2xl scale-105 border-electric-blue/30 ring-2 ring-electric-blue/20' : '',
      lead.stagnantDays && lead.stagnantDays >= 2 ? 'ring-2 ring-mars-orange/50' : '')}>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3 flex-1 overflow-hidden">
            <GripVertical className="w-4 h-4 text-muted-foreground/40 shrink-0" />
            <div className="font-extrabold text-[15px] truncate text-pure-black dark:text-off-white">{lead.name}</div>
          </div>
          <Badge variant="outline" className="text-[10px] px-2.5 py-1 h-7 font-mono-numbers border-none rounded-xl font-bold bg-black/5 dark:bg-white/10 text-muted-foreground shrink-0">
            <Clock className="w-3 h-3 mr-1.5 inline" />
            {lead.slaMinutes}m
          </Badge>
        </div>

        <div className="space-y-3 mb-5">
          <div className="flex justify-between items-center bg-black/[0.03] dark:bg-white/[0.03] p-3 rounded-2xl">
            <span className="text-electric-blue font-bold text-xs">{lead.car}</span>
            <span className="font-mono-numbers font-extrabold text-sm text-pure-black dark:text-off-white">R$ {(lead.value / 1000).toLocaleString()}k</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest px-1">
            <span className="bg-muted px-1.5 py-0.5 rounded italic lowercase">{lead.source}</span>
            <span className="opacity-40">•</span>
            <span>{sellerName || 'S/ Vendedor'}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-black/5 dark:border-white/5">
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={onEdit} className="h-9 w-9 rounded-xl text-muted-foreground hover:text-electric-blue hover:bg-electric-blue/10"><Edit2 className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={onDelete} className="h-9 w-9 rounded-xl text-muted-foreground hover:text-mars-orange hover:bg-mars-orange/10"><Trash2 className="h-4 w-4" /></Button>
          </div>
          <Button size="sm" variant="ghost" className="h-9 text-[11px] px-4 font-extrabold rounded-xl text-mars-orange hover:bg-mars-orange/10 transition-colors" onClick={onLost}>Declarar Perda</Button>
        </div>
      </CardContent>
    </Card>
  )
}
