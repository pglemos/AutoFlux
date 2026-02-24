import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Cockpit from './pages/Cockpit';
import Funnel from './pages/Funnel';
import LeadOps from './pages/LeadOps';
import Activities from './pages/Activities';
import Gamification from './pages/Gamification';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/cockpit" replace />} />
          <Route path="cockpit" element={<Cockpit />} />
          <Route path="funnel" element={<Funnel />} />
          <Route path="leads" element={<LeadOps />} />
          <Route path="activities" element={<Activities />} />
          <Route path="gamification" element={<Gamification />} />
        </Route>
      </Routes>
    </Router>
  );
}
