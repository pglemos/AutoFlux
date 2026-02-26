import { useState, useMemo } from 'react';
import { PhoneCall, Calendar, Car, CheckCircle, XCircle, FileText, Clock, AlertTriangle, User } from 'lucide-react';
import clsx from 'clsx';
import { useAuditLogs } from '@/hooks/use-audit-logs';
import useAppStore from '@/stores/main';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth-provider';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const activityIconMap: Record<string, any> = {
  'Tentativa de Contato': PhoneCall,
  'Retorno Agendado': Clock,
  'Agendamento': Calendar,
  'Agendamento Feito': Calendar,
  'Visita Realizada': Car,
  'Proposta Enviada': FileText,
  'Venda Fechada': CheckCircle,
  'Lead Perdido': XCircle,
  'DEFAULT': Clock
};

const activityColorMap: Record<string, string> = {
  'Tentativa de Contato': 'bg-[#2563EB]/10 text-[#2563EB]',
  'Retorno Agendado': 'bg-[#FF4500]/10 text-[#FF4500]',
  'Agendamento': 'bg-[#050505]/10 text-[#050505]',
  'Agendamento Feito': 'bg-[#050505]/10 text-[#050505]',
  'Visita Realizada': 'bg-[#2563EB]/10 text-[#2563EB]',
  'Proposta Enviada': 'bg-[#FF4500]/10 text-[#FF4500]',
  'Venda Fechada': 'bg-[#050505] text-white',
  'Lead Perdido': 'bg-[#FF4500]/10 text-[#FF4500]',
  'DEFAULT': 'bg-gray-100 text-gray-400'
};

export default function Activities() {
  const { auditLogs, loading: logsLoading } = useAuditLogs(50);
  const { leads, tasks } = useAppStore();
  const { user } = useAuth();
  const [selectedLeadId, setSelectedLeadId] = useState('');

  const handleQuickLog = async (action: string) => {
    if (!selectedLeadId || !user) {
      toast({ title: 'Atenção', description: 'Selecione um lead primeiro.', variant: 'destructive' });
      return;
    }

    const leadName = leads.find(l => l.id === selectedLeadId)?.name || 'Lead';
    const { error } = await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: action,
      details: `Ação rápida registrada para o lead ${leadName}.`
    });

    if (!error) {
      toast({ title: 'Atividade Registrada', description: `${action} salvo com sucesso.` });
    } else {
      toast({ title: 'Erro', description: 'Não foi possível salvar a atividade.', variant: 'destructive' });
    }
  };

  const executionRate = useMemo(() => {
    const today = new Date();
    const todayTasks = tasks.filter(t => {
      const d = new Date(t.dueDate);
      return d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
    });
    if (todayTasks.length === 0) return 100;
    const completed = todayTasks.filter(t => t.status === 'Concluída').length;
    return Math.round((completed / todayTasks.length) * 100);
  }, [tasks]);

  const staleCount = leads.filter(l => l.stagnantDays && l.stagnantDays >= 2).length;

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black tracking-tighter text-[#050505]">Performance Stream</h1>
        <div className="flex gap-3">
          <button className="hyper-glass px-6 py-2.5 rounded-full text-sm font-bold text-[#050505] hover:bg-white/80 transition-all">
            Hoje
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Registro Rápido (1 toque) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="hyper-glass p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-[#050505] mb-6 tracking-tight">Registro Rápido</h3>
            <div className="mb-6">
              <label className="block text-sm font-bold text-[#050505] mb-2 uppercase tracking-wider">Lead Selecionado</label>
              <select
                className="block w-full pl-4 pr-10 py-3 text-base border-none bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#2563EB] sm:text-sm rounded-xl font-medium"
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
              >
                <option value="">Selecione um lead...</option>
                {leads.map(l => (
                  <option key={l.id} value={l.id}>{l.name} - {l.car}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleQuickLog('Tentativa de Contato')}
                className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/50 hover:bg-[#2563EB]/10 border border-transparent hover:border-[#2563EB]/20 transition-all group"
              >
                <PhoneCall className="h-6 w-6 text-gray-400 group-hover:text-[#2563EB] mb-3" strokeWidth={2.5} />
                <span className="text-xs font-bold text-[#050505] text-center">Tentei Contato</span>
              </button>
              <button
                onClick={() => handleQuickLog('Retorno Agendado')}
                className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/50 hover:bg-[#FF4500]/10 border border-transparent hover:border-[#FF4500]/20 transition-all group"
              >
                <Clock className="h-6 w-6 text-gray-400 group-hover:text-[#FF4500] mb-3" strokeWidth={2.5} />
                <span className="text-xs font-bold text-[#050505] text-center">Retorno Agendado</span>
              </button>
              <button
                onClick={() => handleQuickLog('Agendamento Feito')}
                className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/50 hover:bg-[#050505]/10 border border-transparent hover:border-[#050505]/20 transition-all group"
              >
                <Calendar className="h-6 w-6 text-gray-400 group-hover:text-[#050505] mb-3" strokeWidth={2.5} />
                <span className="text-xs font-bold text-[#050505] text-center">Agendamento</span>
              </button>
              <button
                onClick={() => handleQuickLog('Visita Realizada')}
                className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/50 hover:bg-[#2563EB]/10 border border-transparent hover:border-[#2563EB]/20 transition-all group"
              >
                <Car className="h-6 w-6 text-gray-400 group-hover:text-[#2563EB] mb-3" strokeWidth={2.5} />
                <span className="text-xs font-bold text-[#050505] text-center">Visita Feita</span>
              </button>
              <button
                onClick={() => handleQuickLog('Proposta Enviada')}
                className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/50 hover:bg-[#FF4500]/10 border border-transparent hover:border-[#FF4500]/20 transition-all group"
              >
                <FileText className="h-6 w-6 text-gray-400 group-hover:text-[#FF4500] mb-3" strokeWidth={2.5} />
                <span className="text-xs font-bold text-[#050505] text-center">Proposta</span>
              </button>
              <button
                onClick={() => handleQuickLog('Lead Perdido')}
                className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/50 hover:bg-[#FF4500]/10 border border-transparent hover:border-[#FF4500]/20 transition-all group"
              >
                <XCircle className="h-6 w-6 text-gray-400 group-hover:text-[#FF4500] mb-3" strokeWidth={2.5} />
                <span className="text-xs font-bold text-[#050505] text-center">Perdido</span>
              </button>
            </div>
          </div>

          <div className="hyper-glass p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-[#050505] mb-6 tracking-tight">Taxa de Execução</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-gray-500">Ações Realizadas</span>
                  <span className="text-[#2563EB]">{tasks.filter(t => t.status === 'Concluída').length} / {tasks.length}</span>
                </div>
                <div className="w-full bg-gray-200/50 rounded-full h-3 overflow-hidden">
                  <div className="bg-[#2563EB] h-3 rounded-full" style={{ width: `${executionRate}%` }}></div>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-[#FF4500]/10 rounded-2xl border border-[#FF4500]/20">
                <AlertTriangle className="h-6 w-6 text-[#FF4500] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <p className="text-sm font-medium text-[#050505]">
                  Você tem {staleCount} leads estagnados há mais de 48h. A cadência D+3 exige contato hoje.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline de Atividades */}
        <div className="lg:col-span-2">
          <div className="hyper-glass p-8 rounded-3xl h-full">
            <h3 className="text-xl font-bold text-[#050505] mb-8 tracking-tight">Timeline de Hoje</h3>

            <div className="flow-root">
              <ul role="list" className="-mb-8">
                {auditLogs.map((log, logIdx) => {
                  const Icon = activityIconMap[log.action] || activityIconMap['DEFAULT'];
                  const color = activityColorMap[log.action] || activityColorMap['DEFAULT'];
                  const time = format(new Date(log.created_at), 'HH:mm');

                  return (
                    <li key={log.id}>
                      <div className="relative pb-8">
                        {logIdx !== auditLogs.length - 1 ? (
                          <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200/50" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-4">
                          <div>
                            <span className={clsx(color, 'h-10 w-10 rounded-2xl flex items-center justify-center ring-8 ring-[#F5F5F7]')}>
                              <Icon className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500 font-medium">
                                <span className="font-bold text-[#050505] mr-2">{log.action}</span>
                                por <span className="font-bold text-[#050505]">{log.profiles?.name || 'Sistema'}</span>
                              </p>
                              <p className="mt-1 text-sm font-medium text-gray-500">{log.details || log.resource}</p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap font-bold text-[#050505]">
                              <time dateTime={time}>{time}</time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
