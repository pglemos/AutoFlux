import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider, useAuth } from '@/components/auth-provider'
import { AppStoreProvider } from '@/stores/main'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toaster'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Funnel from './pages/Funnel'
import Leads from './pages/Leads'
import MorningReport from './pages/MorningReport'
import GoalManagement from './pages/GoalManagement'
import Tarefas from './pages/Tarefas'
import Team from './pages/Team'
import CommissionRules from './pages/CommissionRules'
import SellerPerformance from './pages/SellerPerformance'
import SalesPerformance from './pages/SalesPerformance'
import CrossSalesReports from './pages/CrossSalesReports'
import AiDiagnostics from './pages/AiDiagnostics'
import Settings from './pages/Settings'
import Reports from './pages/Reports'
import Agenda from './pages/Agenda'
import Inventory from './pages/Inventory'
import Financeiro from './pages/Financeiro'
import Training from './pages/Training'
import Communication from './pages/Communication'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="autoperf-theme">
      <AuthProvider>
        <AppStoreProvider>
          <TooltipProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="relatorio-matinal" element={<MorningReport />} />
                  <Route path="metas" element={<GoalManagement />} />
                  <Route path="tarefas" element={<Tarefas />} />
                  <Route path="leads" element={<Leads />} />
                  <Route path="funnel" element={<Funnel />} />
                  <Route path="agenda" element={<Agenda />} />
                  <Route path="inventory" element={<Inventory />} />
                  <Route path="financeiro" element={<Financeiro />} />
                  <Route path="relatorios/performance-vendas" element={<SalesPerformance />} />
                  <Route path="relatorios/vendas-cruzados" element={<CrossSalesReports />} />
                  <Route path="relatorios/performance-vendedores" element={<SellerPerformance />} />
                  <Route path="reports/stock" element={<Reports />} />
                  <Route path="team" element={<Team />} />
                  <Route path="configuracoes/comissoes" element={<CommissionRules />} />
                  <Route path="training" element={<Training />} />
                  <Route path="communication" element={<Communication />} />
                  <Route path="ia-diagnostics" element={<AiDiagnostics />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Router>
            <Toaster />
          </TooltipProvider>
        </AppStoreProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
