import { useState } from 'react';
import { MoreHorizontal, Calendar, MessageSquare, Phone, User, Clock } from 'lucide-react';
import clsx from 'clsx';

const stages = [
  { id: 'new', name: 'Novo Lead', color: 'bg-[#050505] text-white' },
  { id: 'contacted', name: 'Em Contato', color: 'bg-[#F5F5F7] text-[#050505] border border-gray-200' },
  { id: 'scheduled', name: 'Agendado', color: 'bg-[#2563EB] text-white' },
  { id: 'visited', name: 'Visitou', color: 'bg-[#FF4500] text-white' },
  { id: 'proposal', name: 'Proposta', color: 'bg-[#050505] text-white' },
  { id: 'won', name: 'Vendido', color: 'bg-[#F5F5F7] text-[#050505] border border-gray-200' },
];

const initialLeads = [
  { id: 1, name: 'Carlos Silva', vehicle: 'Jeep Compass 2022', stage: 'new', source: 'Meta Ads', time: '10m', owner: 'João' },
  { id: 2, name: 'Ana Oliveira', vehicle: 'Honda Civic 2021', stage: 'contacted', source: 'RD Station', time: '2h', owner: 'Maria' },
  { id: 3, name: 'Roberto Santos', vehicle: 'VW Nivus 2023', stage: 'scheduled', source: 'WhatsApp', time: '1d', owner: 'João' },
  { id: 4, name: 'Fernanda Lima', vehicle: 'Toyota Corolla 2020', stage: 'visited', source: 'Meta Ads', time: '2d', owner: 'Pedro' },
  { id: 5, name: 'Lucas Souza', vehicle: 'Hyundai Creta 2022', stage: 'proposal', source: 'Site', time: '3d', owner: 'Maria' },
  { id: 6, name: 'Juliana Costa', vehicle: 'Chevrolet Tracker 2023', stage: 'won', source: 'Indicação', time: '5d', owner: 'João' },
  { id: 7, name: 'Marcos Paulo', vehicle: 'Fiat Toro 2021', stage: 'new', source: 'Meta Ads', time: '15m', owner: 'Pedro' },
  { id: 8, name: 'Camila Rocha', vehicle: 'Renault Duster 2022', stage: 'contacted', source: 'Site', time: '4h', owner: 'Maria' },
];

export default function Funnel() {
  const [leads, setLeads] = useState(initialLeads);

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-black tracking-tighter text-[#050505]">Funil Encadeado</h1>
        <div className="flex gap-3">
          <button className="hyper-glass px-6 py-2.5 rounded-full text-sm font-bold text-[#050505] hover:bg-white/80 transition-all">
            Filtros
          </button>
          <button className="bg-[#050505] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#050505]/80 transition-all shadow-lg">
            Novo Lead
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 h-full min-w-max">
          {stages.map((stage) => (
            <div key={stage.id} className="w-80 flex flex-col hyper-glass rounded-3xl">
              <div className="p-5 border-b border-gray-200/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={clsx("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider", stage.color)}>
                    {stage.name}
                  </span>
                  <span className="text-[#050505] font-black">
                    {leads.filter((l) => l.stage === stage.id).length}
                  </span>
                </div>
                <button className="text-gray-400 hover:text-[#050505] transition-colors">
                  <MoreHorizontal className="h-5 w-5" strokeWidth={2.5} />
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {leads
                  .filter((lead) => lead.stage === stage.id)
                  .map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-[#2563EB] hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
                      draggable
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-[#050505] text-sm">{lead.name}</h4>
                        <span className="micro-label flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {lead.time}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-500 mb-4 line-clamp-1">{lead.vehicle}</p>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[#050505] text-xs font-bold border border-gray-200" title={lead.owner}>
                            {lead.owner.charAt(0)}
                          </div>
                          <span className="micro-label">{lead.source}</span>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-gray-400 hover:text-[#2563EB] rounded-lg hover:bg-[#2563EB]/10 transition-colors">
                            <Phone className="h-4 w-4" strokeWidth={2.5} />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-[#2563EB] rounded-lg hover:bg-[#2563EB]/10 transition-colors">
                            <MessageSquare className="h-4 w-4" strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
