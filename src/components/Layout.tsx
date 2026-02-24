import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, KanbanSquare, Users, Activity, Trophy, Search, Bell, User } from 'lucide-react';
import clsx from 'clsx';

const navigation = [
  { name: 'Cockpit', href: '/cockpit', icon: LayoutDashboard },
  { name: 'Funil', href: '/funnel', icon: KanbanSquare },
  { name: 'LeadOps', href: '/leads', icon: Users },
  { name: 'Atividades', href: '/activities', icon: Activity },
  { name: 'Gamificação', href: '/gamification', icon: Trophy },
];

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col items-center pt-8 pb-32 px-4 sm:px-6 lg:px-8">
      
      {/* Top Header / Brand */}
      <header className="w-full max-w-7xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#050505] rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm font-mono">OS</span>
          </div>
          <span className="text-2xl font-black tracking-tighter text-[#050505]">HYPERSYSTEM</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hyper-glass px-5 py-2.5 rounded-full flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse"></div>
             <span className="micro-label !text-[#050505] !m-0 tracking-widest">SYSTEM ONLINE</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="w-full max-w-7xl flex-1">
        <Outlet />
      </main>

      {/* Floating Pill Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="hyper-glass rounded-full p-2 flex items-center gap-1 shadow-2xl border border-white/60">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                clsx(
                  'flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300',
                  isActive 
                    ? 'bg-[#050505] text-white shadow-xl scale-105' 
                    : 'text-gray-400 hover:text-[#050505] hover:bg-white/50'
                )
              }
              title={item.name}
            >
              <item.icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
            </NavLink>
          ))}
          <div className="w-px h-8 bg-gray-300/50 mx-3"></div>
          <button className="flex items-center justify-center w-14 h-14 rounded-full text-gray-400 hover:text-[#050505] hover:bg-white/50 transition-all">
            <Search className="h-6 w-6" strokeWidth={2} />
          </button>
          <button className="flex items-center justify-center w-14 h-14 rounded-full text-gray-400 hover:text-[#050505] hover:bg-white/50 transition-all relative">
            <Bell className="h-6 w-6" strokeWidth={2} />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#FF4500] rounded-full border-2 border-[#F5F5F7]"></span>
          </button>
          <button className="flex items-center justify-center w-14 h-14 rounded-full text-gray-400 hover:text-[#050505] hover:bg-white/50 transition-all">
            <User className="h-6 w-6" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
