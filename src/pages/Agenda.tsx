import { useState, useMemo } from 'react'
import { CalendarDays, Plus, ChevronLeft, ChevronRight, Clock, MapPin, User, MoreVertical, CheckCircle2, AlertCircle, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { useTasks, useLeads, Task } from '@/stores/main'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { format, addDays, startOfWeek, isSameDay, addMonths, subMonths, isToday, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function Agenda() {
    const { tasks, addTask, updateTask } = useTasks()
    const { leads } = useLeads()
    const [viewDate, setViewDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
        title: '',
        type: 'Test-drive',
        date: new Date().toISOString(),
        leadId: ''
    })

    const weekDays = useMemo(() => {
        const start = startOfWeek(viewDate, { weekStartsOn: 0 })
        return Array.from({ length: 7 }, (_, i) => addDays(start, i))
    }, [viewDate])

    const dayAppointments = useMemo(() => {
        return appointments.filter(a => isSameDay(parseISO(a.date), selectedDate))
    }, [appointments, selectedDate])

    const handleAddAppointment = () => {
        if (!newAppointment.title || !newAppointment.leadId) return
        addAppointment({
            title: newAppointment.title as string,
            type: newAppointment.type as any,
            date: newAppointment.date || new Date().toISOString(),
            leadId: newAppointment.leadId as string,
            sellerId: team[0]?.id || ''
        })
        setIsDialogOpen(false)
        setNewAppointment({ title: '', type: 'Test-drive', date: new Date().toISOString(), leadId: '' })
        toast({ title: 'Agendamento Criado', description: 'O compromisso foi adicionado à sua agenda.' })
    }

    const handleVerifyVisit = (appointmentId: string, leadId: string) => {
        const sellerId = team[0]?.id || ''
        recordVisit({ appointmentId, leadId, sellerId } as any)
        toast({ title: 'Visita Iniciada', description: 'O cronômetro de atendimento foi iniciado.' })
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-fade-in px-4 md:px-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="px-2 py-0.5 bg-electric-blue/10 text-electric-blue rounded text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5">
                            <Clock className="w-3 h-3" /> PLANEJAMENTO E VISITAS
                        </div>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-pure-black dark:text-off-white">
                        Minha <span className="text-electric-blue">Agenda</span>
                    </h1>
                    <p className="text-muted-foreground font-medium">Controle de visitas presenciais, test drives e validações reais.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-black/5 dark:bg-white/5 p-1 rounded-2xl">
                        <Button variant="ghost" size="icon" onClick={() => setViewDate(subMonths(viewDate, 1))} className="rounded-xl h-10 w-10 hover:bg-white dark:hover:bg-black">
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="px-4 font-bold text-sm min-w-[140px] text-center uppercase tracking-widest">{format(viewDate, 'MMMM yyyy', { locale: ptBR })}</span>
                        <Button variant="ghost" size="icon" onClick={() => setViewDate(addMonths(viewDate, 1))} className="rounded-xl h-10 w-10 hover:bg-white dark:hover:bg-black">
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                    <Button onClick={() => setIsDialogOpen(true)} className="rounded-2xl h-12 px-8 font-bold bg-pure-black text-white dark:bg-white dark:text-pure-black shadow-lg hover:shadow-electric-blue/20 transition-all hover:scale-[1.02]">
                        <Plus className="w-4 h-4 mr-2" /> Novo Agendamento
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-4">
                {weekDays.map((day, i) => {
                    const isSelected = isSameDay(day, selectedDate)
                    const active = isToday(day)
                    const dayName = format(day, 'EEE', { locale: ptBR })
                    const dayNum = format(day, 'dd')
                    const hasAppointments = appointments.some(a => isSameDay(parseISO(a.date), day))

                    return (
                        <button
                            key={i}
                            onClick={() => setSelectedDate(day)}
                            className={cn(
                                "flex flex-col items-center p-4 rounded-3xl transition-all border-none relative group",
                                isSelected ? "bg-electric-blue text-white shadow-xl shadow-electric-blue/20 scale-105" : "hyper-glass hover:bg-electric-blue/5"
                            )}
                        >
                            <span className={cn("text-[10px] font-bold uppercase tracking-widest mb-2", isSelected ? "text-white/80" : "text-muted-foreground")}>
                                {dayName}
                            </span>
                            <span className="text-2xl font-black font-mono-numbers">{dayNum}</span>
                            {active && !isSelected && <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-electric-blue" />}
                            {hasAppointments && <div className={cn("mt-2 w-1 h-1 rounded-full", isSelected ? "bg-white" : "bg-electric-blue")} />}
                        </button>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-black tracking-tight">{format(selectedDate, "eeee, d 'de' MMMM", { locale: ptBR })}</h3>
                        <Badge variant="outline" className="font-bold border-none bg-black/5 dark:bg-white/5">{dayAppointments.length} Compromissos</Badge>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {dayAppointments.length > 0 ? (
                                dayAppointments.map((app, idx) => {
                                    const visit = visits.find(v => v.appointmentId === app.id)
                                    return (
                                        <motion.div
                                            key={app.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <Card className="hyper-glass border-none rounded-[2rem] group hover:scale-[1.01] transition-all">
                                                <CardContent className="p-6 flex items-center gap-6">
                                                    <div className="flex flex-col items-center justify-center min-w-[60px] h-[60px] bg-black/5 dark:bg-white/5 rounded-2xl">
                                                        <span className="text-xs font-bold text-muted-foreground uppercase">{format(parseISO(app.date), 'HH:mm')}</span>
                                                        <Clock className="w-3 h-3 text-electric-blue mt-1" />
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-extrabold text-lg text-pure-black dark:text-off-white">{app.title}</h4>
                                                            <Badge className="text-[10px] font-bold uppercase px-2 py-0 border-none bg-electric-blue/10 text-electric-blue">
                                                                {app.type}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-4 pt-2">
                                                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase">
                                                                <User className="w-3 h-3" /> {leads.find(l => l.id === app.leadId)?.name || 'Lead Não Vinculado'}
                                                            </div>
                                                            {visit && (
                                                                <div className={cn("flex items-center gap-1.5 text-[11px] font-bold uppercase", visit.verified ? "text-emerald-500" : "text-mars-orange")}>
                                                                    {visit.verified ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                                    {visit.verified ? 'Visita Validada' : 'Em atendimento'}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {!visit && (
                                                            <Button variant="default" className="rounded-xl h-10 px-4 font-bold bg-[#050505] text-white flex items-center gap-2" onClick={() => handleVerifyVisit(app.id, app.leadId)}>
                                                                <QrCode className="w-4 h-4" /> Check-in
                                                            </Button>
                                                        )}
                                                        {visit && !visit.verified && (
                                                            <Button variant="outline" className="rounded-xl h-10 px-4 font-bold border-emerald-500 text-emerald-500 hover:bg-emerald-50" onClick={() => verifyVisit(visit.id)}>
                                                                <CheckCircle2 className="w-4 h-4 mr-2" /> Validar Visita
                                                            </Button>
                                                        )}
                                                        <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="w-5 h-5" /></Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )
                                })
                            ) : (
                                <div className="py-20 flex flex-col items-center justify-center text-center hyper-glass rounded-[3rem] border-dashed border-2 border-black/5 dark:border-white/5">
                                    <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
                                        <CalendarDays className="w-8 h-8 text-muted-foreground/30" />
                                    </div>
                                    <h4 className="font-bold text-lg">Nada agendado para hoje</h4>
                                    <p className="text-muted-foreground text-sm max-w-xs mt-2">Os agendamentos são essenciais para a conversão do funil.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-mars-orange" /> Próximas Visitas
                    </h3>
                    <div className="space-y-4">
                        {appointments.filter(a => parseISO(a.date) > new Date()).slice(0, 3).map((app) => (
                            <div key={app.id} className="p-5 hyper-glass border-l-4 border-l-electric-blue rounded-2xl space-y-2">
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] font-bold text-electric-blue uppercase tracking-widest">{app.type}</span>
                                    <span className="text-[10px] font-bold text-muted-foreground">{format(parseISO(app.date), 'dd/MM HH:mm')}</span>
                                </div>
                                <h5 className="font-bold text-sm">{app.title}</h5>
                                <p className="text-xs text-muted-foreground font-medium">Cliente: {leads.find(l => l.id === app.leadId)?.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight">Novo Agendamento</DialogTitle>
                        <DialogDescription>Reserve um horário para test drive ou reunião presencial.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="space-y-2">
                            <Label className="font-bold">Título do Compromisso</Label>
                            <Input value={newAppointment.title} onChange={(e) => setNewAppointment({ ...newAppointment, title: e.target.value })} className="rounded-xl h-12" placeholder="Ex: Test Drive - Land Rover" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="font-bold">Tipo</Label>
                                <Select value={newAppointment.type} onValueChange={(v) => setNewAppointment({ ...newAppointment, type: v as any })}>
                                    <SelectTrigger className="rounded-xl h-12"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="Test-drive">Test-drive</SelectItem>
                                        <SelectItem value="Visita">Visita</SelectItem>
                                        <SelectItem value="Entrega">Entrega</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold">Vincular Lead</Label>
                                <Select value={newAppointment.leadId} onValueChange={(v) => setNewAppointment({ ...newAppointment, leadId: v })}>
                                    <SelectTrigger className="rounded-xl h-12"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {leads.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold">Data e Hora</Label>
                            <Input type="datetime-local" className="rounded-xl h-12" onChange={(e) => setNewAppointment({ ...newAppointment, date: new Date(e.target.value).toISOString() })} />
                        </div>
                    </div>
                    <DialogFooter className="gap-3">
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl h-12 font-bold">Cancelar</Button>
                        <Button onClick={handleAddAppointment} disabled={!newAppointment.title || !newAppointment.leadId} className="rounded-xl h-12 px-8 font-bold bg-electric-blue text-white shadow-lg shadow-electric-blue/20">
                            Confirmar Agendamento
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
