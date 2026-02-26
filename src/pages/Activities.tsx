import { useState } from 'react';
import { PhoneCall, Calendar, Car, CheckCircle, XCircle, FileText, Clock, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

const activities = [
  { id: 1, type: 'attempt', label: 'Tentativa de Contato', icon: PhoneCall, color: 'bg-[#2563EB]/10 text-[#2563EB]', lead: 'Carlos Silva', time: '10:30', result: 'Sem sucesso' },
  { id: 2, type: 'scheduled', label: 'Retorno Agendado', icon: Clock, color: 'bg-[#FF4500]/10 text-[#FF4500]', lead: 'Ana Oliveira', time: '11:15', result: 'Para amanhã 14h' },
  { id: 3, type: 'appointment', label: 'Agendamento Feito', icon: Calendar, color: 'bg-[#050505]/10 text-[#050505]', lead: 'Roberto Santos', time: '14:00', result: 'Sábado 10h' },
  { id: 4, type: 'visit', label: 'Visita Realizada', icon: Car, color: 'bg-[#2563EB]/10 text-[#2563EB]', lead: 'Fernanda Lima', time: '15:45', result: 'Test-drive feito' },
  { id: 5, type: 'proposal', label: 'Proposta Enviada', icon: FileText, color: 'bg-[#FF4500]/10 text-[#FF4500]', lead: 'Lucas Souza', time: '16:20', result: 'Aguardando aprovação' },
  { id: 6, type: 'won', label: 'Venda Fechada', icon: CheckCircle, color: 'bg-[#050505] text-white', lead: 'Juliana Costa', time: '17:00', result: 'R$ 120.000' },
  { id: 7, type: 'lost', label: 'Lead Perdido', icon: XCircle, color: 'bg-[#FF4500]/10 text-[#FF4500]', lead: 'Marcos Paulo', time: '17:30', result: 'Comprou concorrente' },
];

export default function Activities() {
  const [selectedLead, setSelectedLead] = useState('Carlos Silva');

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black tracking-tighter text-[#050505]">Activity Tracking</h1>
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
                value={selectedLead}
                onChange={(e) => setSelectedLead(e.target.value)}
              >
                <option>Carlos Silva</option>
                <option>Ana Oliveira</option>
                <option>Roberto Santos</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/50 hover:bg-[#2563EB]/10 border border-transparent hover:border-[#2563EB]/20 transition-all group">
                <PhoneCall className="h-6 w-6 text-gray-400 group-hover:text-[#2563EB] mb-3" strokeWidth={2.5} />
                <span className="text-xs font-bold text-[#050505] text-center">Tentei Contato</span>
              </button>
              <button className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/50 hover:bg-[#FF4500]/10 border border-transparent hover:border-[#FF4500]/20 transition-all group">
                <Clock className="h-6 w-6 text-gray-400 group-hover:text-[#FF4500] mb-3" strokeWidth={2.5} />
                <span className="text-xs font-bold text-[#050505] text-center">Retorno Agendado</span>
              </button>
              <button className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/50 hover:bg-[#050505]/10 border border-transparent hover:border-[#050505]/20 transition-all group">
                <Calendar className="h-6 w-6 text-gray-400 group-hover:text-[#050505] mb-3" strokeWidth={2.5} />
                <span className="text-xs font-bold text-[#050505] text-center">Agendamento</span>
              </button>
              <button className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/50 hover:bg-[#2563EB]/10 border border-transparent hover:border-[#2563EB]/20 transition-all group">
                <Car className="h-6 w-6 text-gray-400 group-hover:text-[#2563EB] mb-3" strokeWidth={2.5} />
                <span className="text-xs font-bold text-[#050505] text-center">Visita Feita</span>
              </button>
              <button className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/50 hover:bg-[#FF4500]/10 border border-transparent hover:border-[#FF4500]/20 transition-all group">
                <FileText className="h-6 w-6 text-gray-400 group-hover:text-[#FF4500] mb-3" strokeWidth={2.5} />
                <span className="text-xs font-bold text-[#050505] text-center">Proposta</span>
              </button>
              <button className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/50 hover:bg-[#FF4500]/10 border border-transparent hover:border-[#FF4500]/20 transition-all group">
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
                  <span className="text-[#2563EB]">24 / 30</span>
                </div>
                <div className="w-full bg-gray-200/50 rounded-full h-3 overflow-hidden">
                  <div className="bg-[#2563EB] h-3 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-[#FF4500]/10 rounded-2xl border border-[#FF4500]/20">
                <AlertTriangle className="h-6 w-6 text-[#FF4500] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <p className="text-sm font-medium text-[#050505]">
                  Você tem 3 leads estagnados há mais de 48h. A cadência D+3 exige contato hoje.
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
                {activities.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== activities.length - 1 ? (
                        <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200/50" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-4">
                        <div>
                          <span className={clsx(activity.color, 'h-10 w-10 rounded-2xl flex items-center justify-center ring-8 ring-[#F5F5F7]')}>
                            <activity.icon className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500 font-medium">
                              <span className="font-bold text-[#050505] mr-2">{activity.label}</span>
                              para <span className="font-bold text-[#050505]">{activity.lead}</span>
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-500">{activity.result}</p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap font-bold text-[#050505]">
                            <time dateTime={activity.time}>{activity.time}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
