import React, { useState } from 'react';
import { Search, Filter, AlertCircle, Clock, CheckCircle2, MoreVertical, Phone, MessageSquare, Sparkles, TrendingUp } from 'lucide-react';
import clsx from 'clsx';

const leads = [
  { id: 1, name: 'Carlos Silva', phone: '(11) 98765-4321', vehicle: 'Jeep Compass 2022', source: 'Meta Ads', status: 'Novo', sla: 'estourado', time: '15m', owner: 'João', score: 92, aiSuggestion: 'Alta intenção de compra (clicou em financiamento). Ligue imediatamente e ofereça test-drive.' },
  { id: 2, name: 'Ana Oliveira', phone: '(11) 91234-5678', vehicle: 'Honda Civic 2021', source: 'RD Station', status: 'Em Contato', sla: 'ok', time: '2h', owner: 'Maria', score: 75, aiSuggestion: 'Perfil analítico. Envie comparativo com concorrentes via WhatsApp.' },
  { id: 3, name: 'Roberto Santos', phone: '(11) 99876-5432', vehicle: 'VW Nivus 2023', source: 'WhatsApp', status: 'Agendado', sla: 'ok', time: '1d', owner: 'João', score: 88, aiSuggestion: 'Agendamento para sábado. Envie vídeo do carro 1 dia antes para aquecer.' },
  { id: 4, name: 'Fernanda Lima', phone: '(11) 98765-1234', vehicle: 'Toyota Corolla 2020', source: 'Meta Ads', status: 'Novo', sla: 'alerta', time: '4m', owner: 'Pedro', score: 45, aiSuggestion: 'Lead frio (horário atípico, dados genéricos). Tente contato via WhatsApp primeiro.' },
  { id: 5, name: 'Lucas Souza', phone: '(11) 91234-8765', vehicle: 'Hyundai Creta 2022', source: 'Site', status: 'Proposta', sla: 'ok', time: '3d', owner: 'Maria', score: 95, aiSuggestion: 'Negociação avançada. Ofereça bônus na avaliação do usado para fechar hoje.' },
];

export default function LeadOps() {
  const [expandedLead, setExpandedLead] = useState<number | null>(null);

  const toggleLead = (id: number) => {
    if (expandedLead === id) {
      setExpandedLead(null);
    } else {
      setExpandedLead(id);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black tracking-tighter text-[#050505]">LeadOps</h1>
        <div className="flex gap-3">
          <button className="hyper-glass px-6 py-2.5 rounded-full text-sm font-bold text-[#050505] hover:bg-white/80 transition-all flex items-center gap-2">
            <Filter className="h-4 w-4" strokeWidth={2.5} />
            Filtros
          </button>
          <button className="bg-[#050505] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#050505]/80 transition-all shadow-lg">
            Distribuir Manualmente
          </button>
        </div>
      </div>

      {/* SLA Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="hyper-glass p-6 rounded-3xl flex items-center justify-between">
          <div>
            <p className="micro-label mb-2">SLA Ok ({'<'} 3m)</p>
            <p className="text-4xl font-black text-[#050505]">12</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-white/50 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-[#050505]" strokeWidth={2.5} />
          </div>
        </div>
        <div className="hyper-glass p-6 rounded-3xl flex items-center justify-between">
          <div>
            <p className="micro-label mb-2">Alerta (3m - 5m)</p>
            <p className="text-4xl font-black text-[#050505]">3</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-white/50 flex items-center justify-center">
            <Clock className="h-6 w-6 text-[#FF4500]" strokeWidth={2.5} />
          </div>
        </div>
        <div className="hyper-glass p-6 rounded-3xl flex items-center justify-between border-l-4 border-l-[#FF4500]">
          <div>
            <p className="micro-label mb-2">Estourado ({'>'} 5m)</p>
            <p className="text-4xl font-black text-[#050505]">1</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#FF4500]/10 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-[#FF4500]" strokeWidth={2.5} />
          </div>
        </div>
        <div className="bg-[#050505] p-6 rounded-3xl shadow-2xl flex items-center justify-between text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/20 to-[#FF4500]/20"></div>
          <div className="relative z-10">
            <p className="micro-label !text-white/70 mb-2">Leads Quentes (IA)</p>
            <p className="text-4xl font-black">5</p>
          </div>
          <div className="relative z-10 h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
            <Sparkles className="h-6 w-6 text-white" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="hyper-glass rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-gray-200/50 flex justify-between items-center">
          <div className="relative w-72">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" strokeWidth={2.5} />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3 border-none rounded-full leading-5 bg-white/50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB] sm:text-sm font-medium"
              placeholder="Buscar leads..."
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-[#050505] font-medium">
            <TrendingUp className="h-5 w-5 text-[#2563EB]" strokeWidth={2.5} />
            <span>Ordenado por: <strong>Score IA (Maior)</strong></span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200/50">
            <thead className="bg-white/30">
              <tr>
                <th scope="col" className="px-6 py-4 text-left micro-label">
                  Lead
                </th>
                <th scope="col" className="px-6 py-4 text-left micro-label">
                  Veículo de Interesse
                </th>
                <th scope="col" className="px-6 py-4 text-left micro-label">
                  Score IA
                </th>
                <th scope="col" className="px-6 py-4 text-left micro-label">
                  Status / SLA
                </th>
                <th scope="col" className="px-6 py-4 text-left micro-label">
                  Dono
                </th>
                <th scope="col" className="relative px-6 py-4">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50">
              {leads.sort((a, b) => b.score - a.score).map((lead) => (
                <React.Fragment key={lead.id}>
                  <tr
                    className={clsx("hover:bg-white/50 transition-colors cursor-pointer", expandedLead === lead.id && "bg-white/80")}
                    onClick={() => toggleLead(lead.id)}
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-[#050505] flex items-center justify-center text-white font-bold text-sm">
                          {lead.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-[#050505]">{lead.name}</div>
                          <div className="text-sm font-medium text-gray-500">{lead.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-bold text-[#050505]">{lead.vehicle}</div>
                      <div className="micro-label mt-1">{lead.source}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={clsx(
                          "flex items-center justify-center h-8 w-8 rounded-lg font-black text-sm",
                          lead.score >= 80 ? "bg-[#050505] text-white" :
                          lead.score >= 60 ? "bg-gray-200 text-[#050505]" :
                          "bg-[#FF4500]/10 text-[#FF4500]"
                        )}>
                          {lead.score}
                        </div>
                        {lead.score >= 80 && <Sparkles className="h-5 w-5 text-[#2563EB]" strokeWidth={2.5} />}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex flex-col gap-2">
                        <span className="px-3 py-1 inline-flex text-xs font-bold uppercase tracking-wider rounded-full bg-white border border-gray-200 text-[#050505] w-fit">
                          {lead.status}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                          {lead.sla === 'estourado' && <AlertCircle className="h-4 w-4 text-[#FF4500]" strokeWidth={2.5} />}
                          {lead.sla === 'alerta' && <Clock className="h-4 w-4 text-[#FF4500]" strokeWidth={2.5} />}
                          {lead.sla === 'ok' && <CheckCircle2 className="h-4 w-4 text-[#050505]" strokeWidth={2.5} />}
                          <span className={clsx(
                            lead.sla === 'estourado' && 'text-[#FF4500]',
                            lead.sla === 'alerta' && 'text-[#FF4500]',
                            lead.sla === 'ok' && 'text-[#050505]'
                          )}>
                            {lead.time}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#050505] text-xs font-bold">
                          {lead.owner.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-[#050505]">{lead.owner}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button className="text-gray-400 hover:text-[#2563EB] p-2 rounded-xl hover:bg-[#2563EB]/10 transition-colors">
                          <Phone className="h-5 w-5" strokeWidth={2.5} />
                        </button>
                        <button className="text-gray-400 hover:text-[#2563EB] p-2 rounded-xl hover:bg-[#2563EB]/10 transition-colors">
                          <MessageSquare className="h-5 w-5" strokeWidth={2.5} />
                        </button>
                        <button className="text-gray-400 hover:text-[#050505] p-2 rounded-xl hover:bg-black/5 transition-colors">
                          <MoreVertical className="h-5 w-5" strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedLead === lead.id && (
                    <tr className="bg-white/80">
                      <td colSpan={6} className="px-6 py-6 border-t border-gray-200/50">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-[#050505] rounded-2xl">
                            <Sparkles className="h-6 w-6 text-white" strokeWidth={2.5} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-[#050505] mb-2 uppercase tracking-wider">Análise e Sugestão da IA</h4>
                            <p className="text-base font-medium text-gray-600">{lead.aiSuggestion}</p>
                            <div className="mt-4 flex gap-3">
                              <button className="px-5 py-2.5 bg-[#2563EB] text-white text-sm font-bold rounded-full hover:bg-[#2563EB]/90 transition-colors shadow-lg shadow-[#2563EB]/20">
                                Executar Ação Sugerida
                              </button>
                              <button className="px-5 py-2.5 bg-white border border-gray-200 text-[#050505] text-sm font-bold rounded-full hover:bg-gray-50 transition-colors">
                                Ver Histórico Completo
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
