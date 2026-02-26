import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider, useAuth } from '@/components/auth-provider'
import { AppStoreProvider } from '@/stores/main'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toaster'
import Layout from './components/Layout'

// Lazy loaded pages to optimize bundle size and page load time
const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Funnel = lazy(() => import('./pages/Funnel'))
const Leads = lazy(() => import('./pages/Leads'))
const MorningReport = lazy(() => import('./pages/MorningReport'))
const GoalManagement = lazy(() => import('./pages/GoalManagement'))
const Tarefas = lazy(() => import('./pages/Tarefas'))
const Team = lazy(() => import('./pages/Team'))
const CommissionRules = lazy(() => import('./pages/CommissionRules'))
const SellerPerformance = lazy(() => import('./pages/SellerPerformance'))
const SalesPerformance = lazy(() => import('./pages/SalesPerformance'))
const CrossSalesReports = lazy(() => import('./pages/CrossSalesReports'))
const AiDiagnostics = lazy(() => import('./pages/AiDiagnostics'))
const Settings = lazy(() => import('./pages/Settings'))
const Reports = lazy(() => import('./pages/Reports'))
const Agenda = lazy(() => import('./pages/Agenda'))
const Inventory = lazy(() => import('./pages/Inventory'))
const Financeiro = lazy(() => import('./pages/Financeiro'))
const Training = lazy(() => import('./pages/Training'))
const Communication = lazy(() => import('./pages/Communication'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Terms = lazy(() => import('./pages/Terms'))
const NotFound = lazy(() => import('./pages/NotFound'))

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
                <Route
                  path="/login"
                  element={
                    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                      <Login />
                    </Suspense>
                  }
                />
                <Route
                  path="/privacy"
                  element={
                    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                      <Privacy />
                    </Suspense>
                  }
                />
                <Route
                  path="/terms"
                  element={
                    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                      <Terms />
                    </Suspense>
                  }
                />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route
                    path="*"
                    element={
                      <Suspense fallback={<div className="w-full h-full min-h-[50vh] flex items-center justify-center bg-transparent"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                        <Routes>
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
                        </Routes>
                      </Suspense>
                    }
                  />
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
