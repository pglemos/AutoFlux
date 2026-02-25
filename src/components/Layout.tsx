import { Outlet } from 'react-router-dom'
import { Navigation } from './Navigation'
import { Header } from './Header'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

export default function Layout() {
  const isMobile = useIsMobile()

  return (
    <div className="flex min-h-screen bg-off-white dark:bg-pure-black text-pure-black dark:text-off-white selection:bg-electric-blue selection:text-white font-sans">
      <Navigation />
      <div
        className={cn(
          'flex-1 flex flex-col min-w-0 transition-all duration-300',
          isMobile ? 'pb-24' : 'ml-64',
        )}
      >
        <Header />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
