import { useState } from 'react'
import { Plus, Trash2, CheckSquare, Clock, AlertTriangle, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import useAppStore, { TaskPriority, TaskStatus } from '@/stores/main'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export default function Tarefas() {
    const { tasks, addTask, updateTask, deleteTask, leads } = useAppStore()
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState<TaskPriority>('Média')
    const [leadId, setLeadId] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [filter, setFilter] = useState<'all' | TaskStatus>('all')

    const handleSave = () => {
        if (!title) return
        addTask({ title, description, priority, leadId, dueDate: dueDate || new Date().toISOString() })
        toast({ title: 'Tarefa Criada', description: `"${title}" adicionada.` })
        setOpen(false); setTitle(''); setDescription(''); setLeadId(''); setDueDate('')
    }

    const toggleStatus = (id: string, current: TaskStatus) => {
        const next = current === 'Pendente' ? 'Concluída' : 'Pendente'
        updateTask(id, { status: next })
        toast({ title: next === 'Concluída' ? '✅ Tarefa Concluída' : 'Tarefa reaberta' })
    }

    const filtered = tasks.filter((t) => filter === 'all' || t.status === filter)

    const priorityColor = (p: TaskPriority) => p === 'Alta' ? 'text-mars-orange bg-mars-orange/10' : p === 'Baixa' ? 'text-muted-foreground bg-black/5 dark:bg-white/10' : 'text-electric-blue bg-electric-blue/10'

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-mars-orange"></div><span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">GESTÃO</span></div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-pure-black dark:text-off-white">Minhas <span className="text-electric-blue">Tarefas</span></h1>
                </div>
                <div className="flex gap-3">
                    <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
                        <SelectTrigger className="w-[140px] rounded-xl h-10 bg-white/50 dark:bg-black/50 font-bold"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="all">Todas</SelectItem><SelectItem value="Pendente">Pendentes</SelectItem><SelectItem value="Concluída">Concluídas</SelectItem><SelectItem value="Atrasada">Atrasadas</SelectItem></SelectContent>
                    </Select>
                    <Button onClick={() => setOpen(true)} className="rounded-full px-6 h-10 font-bold bg-pure-black text-white dark:bg-white dark:text-pure-black shadow-elevation"><Plus className="w-4 h-4 mr-2" /> Nova Tarefa</Button>
                </div>
            </div>

            <div className="space-y-3">
                {filtered.map((task) => (
                    <Card key={task.id} className={cn('border-none shadow-sm rounded-2xl transition-all group hover:shadow-md', task.status === 'Concluída' && 'opacity-60')}>
                        <CardContent className="p-5 flex items-center gap-4">
                            <button onClick={() => toggleStatus(task.id, task.status)}
                                className={cn('w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all', task.status === 'Concluída' ? 'bg-electric-blue border-electric-blue' : 'border-black/20 dark:border-white/20 hover:border-electric-blue')}>
                                {task.status === 'Concluída' && <CheckSquare className="w-4 h-4 text-white" />}
                            </button>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className={cn('font-extrabold text-sm text-pure-black dark:text-off-white truncate', task.status === 'Concluída' && 'line-through')}>{task.title}</h3>
                                    <Badge className={cn('text-[9px] px-1.5 py-0 font-bold border-none rounded-md shrink-0', priorityColor(task.priority))}>{task.priority}</Badge>
                                </div>
                                {task.description && <p className="text-xs text-muted-foreground truncate font-medium">{task.description}</p>}
                                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground font-bold">
                                    {task.leadId && <span className="text-electric-blue">Lead: {task.leadId}</span>}
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => { deleteTask(task.id); toast({ title: 'Tarefa removida' }) }}
                                className="h-8 w-8 rounded-full text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-mars-orange"><Trash2 className="h-4 w-4" /></Button>
                        </CardContent>
                    </Card>
                ))}
                {filtered.length === 0 && <div className="text-center py-16 text-muted-foreground font-bold text-sm">Nenhuma tarefa encontrada.</div>}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[400px] rounded-3xl">
                    <DialogHeader><DialogTitle className="font-extrabold text-xl">Nova Tarefa</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2"><Label>Título</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl" /></div>
                        <div className="space-y-2"><Label>Descrição</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="rounded-xl" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Prioridade</Label><Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}><SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="Alta">Alta</SelectItem><SelectItem value="Média">Média</SelectItem><SelectItem value="Baixa">Baixa</SelectItem></SelectContent></Select></div>
                            <div className="space-y-2"><Label>Data Limite</Label><Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="rounded-xl" /></div>
                        </div>
                        <div className="space-y-2"><Label>Lead Associado</Label><Select value={leadId} onValueChange={setLeadId}><SelectTrigger className="rounded-xl"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                            <SelectContent>{leads.map((l) => <SelectItem key={l.id} value={l.id}>{l.name} ({l.id})</SelectItem>)}</SelectContent></Select></div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setOpen(false)} className="rounded-xl font-bold">Cancelar</Button>
                        <Button onClick={handleSave} disabled={!title} className="rounded-xl font-bold bg-electric-blue text-white">Criar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
