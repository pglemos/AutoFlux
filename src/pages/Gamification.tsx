import { Trophy, Medal, Target, Star, Award, TrendingUp, Zap } from 'lucide-react';
import clsx from 'clsx';

const ranking = [
  { id: 1, name: 'João Silva', points: 1250, sales: 12, appointments: 45, trend: 'up', avatar: 'https://picsum.photos/seed/joao/200/200' },
  { id: 2, name: 'Maria Oliveira', points: 1100, sales: 10, appointments: 38, trend: 'up', avatar: 'https://picsum.photos/seed/maria/200/200' },
  { id: 3, name: 'Pedro Santos', points: 950, sales: 8, appointments: 30, trend: 'down', avatar: 'https://picsum.photos/seed/pedro/200/200' },
  { id: 4, name: 'Ana Costa', points: 820, sales: 7, appointments: 25, trend: 'up', avatar: 'https://picsum.photos/seed/ana/200/200' },
  { id: 5, name: 'Lucas Lima', points: 750, sales: 6, appointments: 22, trend: 'down', avatar: 'https://picsum.photos/seed/lucas/200/200' },
];

const challenges = [
  { id: 1, title: 'Mestre dos Agendamentos', description: 'Faça 15 agendamentos esta semana.', target: 15, current: 12, reward: '500 pts + Insígnia', icon: Target, color: 'text-blue-500', bg: 'bg-blue-100' },
  { id: 2, title: 'Fechador de Ouro', description: 'Conclua 5 vendas no mês.', target: 5, current: 3, reward: '1000 pts + Medalha', icon: Award, color: 'text-amber-500', bg: 'bg-amber-100' },
  { id: 3, title: 'Flash Follow-up', description: 'Responda 20 leads em menos de 5 minutos.', target: 20, current: 20, reward: '300 pts', icon: Zap, color: 'text-purple-500', bg: 'bg-purple-100', completed: true },
];

const badges = [
  { id: 1, name: 'Top Seller (Jan)', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-100', date: 'Jan 2026' },
  { id: 2, name: 'SLA Master', icon: Zap, color: 'text-purple-500', bg: 'bg-purple-100', date: 'Fev 2026' },
  { id: 3, name: '100 Visitas', icon: Star, color: 'text-emerald-500', bg: 'bg-emerald-100', date: 'Dez 2025' },
];

export default function Gamification() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gamificação & Performance</h1>
        <div className="flex gap-2">
          <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option>Esta Semana</option>
            <option>Este Mês</option>
            <option>Este Ano</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ranking */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                <h3 className="text-lg font-medium text-gray-900">Ranking da Equipe</h3>
              </div>
              <span className="text-sm text-gray-500">Atualizado há 5 min</span>
            </div>
            <ul className="divide-y divide-gray-200">
              {ranking.map((user, index) => (
                <li key={user.id} className={clsx("p-4 hover:bg-gray-50 transition-colors", index === 0 && "bg-amber-50/30")}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 font-bold text-gray-400">
                        {index === 0 ? <Medal className="h-6 w-6 text-amber-500" /> : 
                         index === 1 ? <Medal className="h-6 w-6 text-gray-400" /> : 
                         index === 2 ? <Medal className="h-6 w-6 text-amber-700" /> : 
                         `#${index + 1}`}
                      </div>
                      <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full border border-gray-200" referrerPolicy="no-referrer" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                          <span>{user.sales} vendas</span>
                          <span>•</span>
                          <span>{user.appointments} agendamentos</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-indigo-600">{user.points} pts</p>
                      </div>
                      {user.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Desafios Ativos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Target className="h-5 w-5 text-indigo-500" />
              <h3 className="text-lg font-medium text-gray-900">Desafios Ativos (Suas Metas)</h3>
            </div>
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <div key={challenge.id} className={clsx("p-4 rounded-lg border", challenge.completed ? "border-emerald-200 bg-emerald-50/30" : "border-gray-200")}>
                  <div className="flex items-start gap-4">
                    <div className={clsx("p-3 rounded-lg flex-shrink-0", challenge.bg)}>
                      <challenge.icon className={clsx("h-6 w-6", challenge.color)} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-semibold text-gray-900">{challenge.title}</h4>
                        {challenge.completed ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Concluído
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-indigo-600">{challenge.reward}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{challenge.description}</p>
                      
                      {!challenge.completed && (
                        <div>
                          <div className="flex justify-between text-xs font-medium mb-1">
                            <span className="text-gray-700">Progresso</span>
                            <span className="text-indigo-600">{challenge.current} / {challenge.target}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${(challenge.current / challenge.target) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Perfil e Conquistas */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="relative inline-block">
              <img src="https://picsum.photos/seed/joao/200/200" alt="João Silva" className="h-24 w-24 rounded-full border-4 border-white shadow-md mx-auto" referrerPolicy="no-referrer" />
              <div className="absolute bottom-0 right-0 h-6 w-6 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center">
                <Star className="h-3 w-3 text-white" />
              </div>
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">João Silva</h2>
            <p className="text-sm text-gray-500">Nível 12 • Vendedor Elite</p>
            
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
              <div>
                <p className="text-2xl font-bold text-indigo-600">1.250</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mt-1">Pontos Totais</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-indigo-600">#1</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mt-1">Posição Atual</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-500" />
              Suas Insígnias
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {badges.map((badge) => (
                <div key={badge.id} className="flex flex-col items-center text-center group cursor-pointer">
                  <div className={clsx("h-14 w-14 rounded-full flex items-center justify-center mb-2 transition-transform group-hover:scale-110 shadow-sm", badge.bg)}>
                    <badge.icon className={clsx("h-7 w-7", badge.color)} />
                  </div>
                  <p className="text-xs font-semibold text-gray-900 line-clamp-1">{badge.name}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{badge.date}</p>
                </div>
              ))}
              {/* Empty slot */}
              <div className="flex flex-col items-center text-center opacity-40">
                <div className="h-14 w-14 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mb-2 bg-gray-50">
                  <Star className="h-6 w-6 text-gray-300" />
                </div>
                <p className="text-xs font-medium text-gray-500">Bloqueado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
