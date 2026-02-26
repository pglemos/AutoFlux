import React, { useState, useMemo } from 'react';
import { Search, Filter, AlertCircle, Clock, CheckCircle2, MoreVertical, Phone, MessageSquare, Sparkles, TrendingUp } from 'lucide-react';
import clsx from 'clsx';
import useAppStore from '@/stores/main';

export default function LeadOps() {
  const { leads, team } = useAppStore();
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleLead = (id: string) => {
    setExpandedLead(expandedLead === id ? null : id);
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(l =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.car.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [leads, searchTerm]);

  const stats = useMemo(() => {
    const ok = leads.filter(l => l.slaMinutes <= 3).length;
    const alerta = leads.filter(l => l.slaMinutes > 3 && l.slaMinutes <= 5).length;
    const estourado = leads.filter(l => l.slaMinutes > 5).length;
    const quentes = leads.filter(l => (l.score || 0) >= 80).length;
    return { ok, alerta, estourado, quentes };
  }, [leads]);

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-electric-blue animate-pulse"></div>
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">SLA MONITORING</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-pure-black dark:text-off-white">AutoPerf <span className="text-electric-blue">LeadOps</span></h1>
        </div>
        <div className="flex gap-3">
          <button className="hyper-glass px-6 py-2.5 rounded-full text-sm font-bold text-pure-black dark:text-off-white hover:bg-white/80 transition-all flex items-center gap-2">
            <Filter className="h-4 w-4" strokeWidth={2.5} />
            Filtros
          </button>
          <button className="bg-pure-black dark:bg-white dark:text-pure-black text-white px-6 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-all shadow-lg">
            Distribuir Manualmente
          </button>
        </div>
      </div>

      {/* SLA Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="hyper-glass p-6 rounded-3xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-2">SLA Ok ({'<'} 3m)</p>
            <p className="text-4xl font-black text-pure-black dark:text-off-white">{stats.ok}</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" strokeWidth={2.5} />
          </div>
        </div>
        <div className="hyper-glass p-6 rounded-3xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-2">Alerta (3m - 5m)</p>
            <p className="text-4xl font-black text-pure-black dark:text-off-white">{stats.alerta}</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center">
            <Clock className="h-6 w-6 text-amber-500" strokeWidth={2.5} />
          </div>
        </div>
        <div className="hyper-glass p-6 rounded-3xl flex items-center justify-between border-l-4 border-l-mars-orange">
          <div>
            <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-2">Estourado ({'>'} 5m)</p>
            <p className="text-4xl font-black text-pure-black dark:text-off-white">{stats.estourado}</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-mars-orange/10 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-mars-orange" strokeWidth={2.5} />
          </div>
        </div>
        <div className="bg-pure-black dark:bg-white p-6 rounded-3xl shadow-2xl flex items-center justify-between text-white dark:text-pure-black relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/20 to-transparent"></div>
          <div className="relative z-10">
            <p className="text-[10px] font-extrabold uppercase tracking-widest mb-2 opacity-70">Leads Quentes (IA)</p>
            <p className="text-4xl font-black">{stats.quentes}</p>
          </div>
          <div className="relative z-10 h-12 w-12 rounded-2xl bg-white/10 dark:bg-black/10 flex items-center justify-center backdrop-blur-sm">
            <Sparkles className="h-6 w-6 group-hover:animate-pulse" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="hyper-glass rounded-[2.5rem] overflow-hidden border border-black/5 dark:border-white/5">
        <div className="p-8 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-black/[0.02] dark:bg-white/[0.02]">
          <div className="relative w-72">
            <Search className="absolute inset-y-0 left-4 flex items-center pointer-events-none h-full w-5 text-muted-foreground" strokeWidth={2.5} />
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3 border-none rounded-2xl bg-white/50 dark:bg-black/50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue sm:text-sm font-bold shadow-sm"
              placeholder="Buscar leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-pure-black dark:text-off-white font-bold">
            <TrendingUp className="h-5 w-5 text-electric-blue" strokeWidth={2.5} />
            <span className="opacity-60">Ordenado por:</span> <strong>Score IA</strong>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-black/5 dark:divide-white/5">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5">
                <th scope="col" className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Lead</th>
                <th scope="col" className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Veículo</th>
                <th scope="col" className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Score IA</th>
                <th scope="col" className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status / SLA</th>
                <th scope="col" className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Dono</th>
                <th scope="col" className="relative px-8 py-5"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {filteredLeads.map((lead) => (
                <React.Fragment key={lead.id}>
                  <tr
                    className={clsx("hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer group", expandedLead === lead.id && "bg-black/[0.03] dark:bg-white/[0.03]")}
                    onClick={() => toggleLead(lead.id)}
                  >
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-11 w-11 flex-shrink-0 rounded-2xl bg-pure-black dark:bg-white flex items-center justify-center text-white dark:text-pure-black font-black text-sm">
                          {lead.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-extrabold text-pure-black dark:text-off-white">{lead.name}</div>
                          <div className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Via {lead.source}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm font-extrabold text-pure-black dark:text-off-white">{lead.car}</div>
                      <div className="text-[10px] font-bold text-electric-blue uppercase">Interesse Ativo</div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={clsx(
                          "flex items-center justify-center h-9 w-9 rounded-xl font-black text-sm font-mono-numbers shadow-sm",
                          (lead.score || 0) >= 80 ? "bg-pure-black dark:bg-white text-white dark:text-pure-black" :
                            (lead.score || 0) >= 60 ? "bg-black/5 dark:bg-white/10 text-pure-black dark:text-off-white" :
                              "bg-mars-orange/10 text-mars-orange"
                        )}>
                          {lead.score || 0}
                        </div>
                        {(lead.score || 0) >= 80 && <Sparkles className="h-5 w-5 text-electric-blue animate-pulse" strokeWidth={2.5} />}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex flex-col gap-2">
                        <span className="px-3 py-1 inline-flex text-[9px] font-black uppercase tracking-widest rounded-full bg-white dark:bg-black border border-black/5 dark:border-white/10 text-pure-black dark:text-off-white w-fit shadow-sm">
                          {lead.stage}
                        </span>
                        <div className="flex items-center gap-2 text-xs font-black font-mono-numbers">
                          {lead.slaMinutes > 5 ? <AlertCircle className="h-4 w-4 text-mars-orange" strokeWidth={2.5} /> :
                            lead.slaMinutes > 3 ? <Clock className="h-4 w-4 text-amber-500" strokeWidth={2.5} /> :
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" strokeWidth={2.5} />}
                          <span className={clsx(lead.slaMinutes > 5 ? 'text-mars-orange' : lead.slaMinutes > 3 ? 'text-amber-500' : 'text-emerald-500')}>
                            {lead.slaMinutes}m
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-pure-black dark:text-off-white text-[10px] font-black border border-black/5 dark:border-white/5">
                          {(team.find(t => t.id === lead.sellerId)?.name || 'S').charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-pure-black dark:text-off-white">{team.find(t => t.id === lead.sellerId)?.name || 'Sem Dono'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button className="text-muted-foreground hover:text-electric-blue p-2.5 rounded-xl hover:bg-electric-blue/10 transition-colors"><Phone className="h-5 w-5" strokeWidth={2.5} /></button>
                        <button className="text-muted-foreground hover:text-electric-blue p-2.5 rounded-xl hover:bg-electric-blue/10 transition-colors"><MessageSquare className="h-5 w-5" strokeWidth={2.5} /></button>
                      </div>
                    </td>
                  </tr>
                  {expandedLead === lead.id && (
                    <tr className="bg-black/[0.01] dark:bg-white/[0.01]">
                      <td colSpan={6} className="px-8 py-8 border-t border-black/5 dark:border-white/5">
                        <div className="flex items-start gap-6 max-w-4xl">
                          <div className="p-4 bg-pure-black dark:bg-white rounded-2xl shadow-xl">
                            <Sparkles className="h-7 w-7 text-white dark:text-pure-black" strokeWidth={2.5} />
                          </div>
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-[10px] font-black text-electric-blue mb-2 uppercase tracking-widest">Análise Preditiva AutoPerf</h4>
                              <p className="text-lg font-bold text-pure-black dark:text-off-white leading-relaxed">
                                {lead.score >= 80 ? "Alta intenção de compra identificada. Lead interagiu com simulações de financiamento e vídeos do veículo." :
                                  lead.score >= 60 ? "Interesse moderado. O lead solicitou informações técnicas, mas ainda não demonstrou urgência." :
                                    "Lead em fase de descoberta. Prefere contato assíncrono (WhatsApp) inicialmente."}
                              </p>
                            </div>
                            <div className="flex gap-3">
                              <button className="px-6 py-3 bg-electric-blue text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-electric-blue/90 transition-all shadow-lg shadow-electric-blue/20">Executar Ação</button>
                              <button className="px-6 py-3 bg-white dark:bg-[#111] border border-black/5 dark:border-white/10 text-pure-black dark:text-off-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all">Ver Histórico</button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filteredLeads.length === 0 && (
                <tr><td colSpan={6} className="px-8 py-24 text-center text-muted-foreground font-bold">Nenhum lead encontrado com estes critérios.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
