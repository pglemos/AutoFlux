import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Users, Calendar, Car, DollarSign, AlertTriangle } from 'lucide-react';

const data = [
  { name: 'Seg', leads: 40, vendas: 24, amt: 2400 },
  { name: 'Ter', leads: 30, vendas: 13, amt: 2210 },
  { name: 'Qua', leads: 20, vendas: 98, amt: 2290 },
  { name: 'Qui', leads: 27, vendas: 39, amt: 2000 },
  { name: 'Sex', leads: 18, vendas: 48, amt: 2181 },
  { name: 'Sáb', leads: 23, vendas: 38, amt: 2500 },
  { name: 'Dom', leads: 34, vendas: 43, amt: 2100 },
];

const stats = [
  { name: 'Total de Leads', stat: '71.897', icon: Users, change: '12%', changeType: 'increase' },
  { name: 'Agendamentos', stat: '58.16%', icon: Calendar, change: '2.02%', changeType: 'increase' },
  { name: 'Visitas Validadas', stat: '24.57%', icon: Car, change: '3.2%', changeType: 'decrease' },
  { name: 'Vendas (Run-rate)', stat: '12', icon: DollarSign, change: '4', changeType: 'increase' },
];

export default function Cockpit() {
  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="micro-label"><span className="micro-label-dot"></span>LIVE PREVIEW</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[#050505] leading-[0.9]">
          Harmony between <br/>
          <span className="text-[#2563EB]">performance</span> and execution.
        </h1>
      </div>

      {/* Alertas */}
      <div className="hyper-glass border-l-4 border-l-[#FF4500] p-6 rounded-3xl flex items-start gap-4">
        <AlertTriangle className="h-6 w-6 text-[#FF4500] mt-0.5" strokeWidth={2.5} />
        <div>
          <h3 className="text-sm font-bold text-[#050505] uppercase tracking-wider">Atenção: Risco de Meta</h3>
          <p className="mt-1 text-[#050505]/70 font-medium">
            A projeção atual (run-rate) indica fechamento de 42 carros. A meta é 50. O funil está vazando na etapa de Agendamento → Visita (gap de 15% vs benchmark).
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="hyper-glass p-6 rounded-3xl relative overflow-hidden group"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="p-3 bg-white/50 rounded-2xl">
                <item.icon className="h-6 w-6 text-[#050505]" strokeWidth={2.5} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${item.changeType === 'increase' ? 'text-[#2563EB]' : 'text-[#FF4500]'}`}>
                {item.changeType === 'increase' ? <ArrowUpRight className="h-4 w-4" strokeWidth={3} /> : <ArrowDownRight className="h-4 w-4" strokeWidth={3} />}
                {item.change}
              </div>
            </div>
            <div>
              <p className="text-4xl font-black tracking-tighter text-[#050505]">{item.stat}</p>
              <p className="micro-label mt-2">{item.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1 */}
        <div className="hyper-glass p-8 rounded-3xl">
          <h3 className="text-xl font-bold text-[#050505] mb-6 tracking-tight">Leads vs Vendas (Semana)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#050505', fontWeight: 600, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#050505', fontWeight: 600, fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}
                />
                <Bar dataKey="leads" fill="#050505" radius={[8, 8, 0, 0]} />
                <Bar dataKey="vendas" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2 */}
        <div className="hyper-glass p-8 rounded-3xl">
          <h3 className="text-xl font-bold text-[#050505] mb-6 tracking-tight">Projeção de Vendas (Run-rate)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#050505', fontWeight: 600, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#050505', fontWeight: 600, fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}
                />
                <Line type="monotone" dataKey="vendas" stroke="#FF4500" strokeWidth={4} dot={{ r: 6, fill: '#FF4500', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="leads" stroke="#050505" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* IA Diagnóstico */}
      <div className="bg-[#050505] rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2563EB] rounded-full filter blur-[100px] opacity-30 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF4500] rounded-full filter blur-[100px] opacity-20 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <AlertTriangle className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Diagnóstico Semanal (IA)</h3>
          </div>
          <div className="space-y-6">
            <p className="text-white/80 leading-relaxed text-lg font-medium">
              O funil está vazando na etapa de Agendamento → Visita (conversão de 40%, benchmark é 60%). Os vendedores estão demorando em média 45 minutos para o primeiro contato (SLA é 5 min).
            </p>
            <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-md border border-white/10">
              <h4 className="font-bold mb-4 tracking-wide uppercase text-sm text-[#2563EB]">Ações Recomendadas</h4>
              <ul className="space-y-3 text-white/90 font-medium">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF4500] mt-2"></div>
                  Auditar os 15 leads agendados para hoje e confirmar via ligação.
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF4500] mt-2"></div>
                  Revisar a escala de plantão das 12h às 14h (pico de estouro de SLA).
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
