import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './context/UserContext';
import Dashboard from './pages/Dashboard';
import MySkills from './pages/MySkills';
import NewSkill from './pages/NewSkill';
import Ranking from './pages/Ranking';
import Settings from './pages/Settings';
import SkillDetail from './pages/SkillDetail';
import Welcome from './pages/Welcome';
import './styles/index.css';

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/skills" element={<MySkills />} />
              <Route path="/skills/nueva" element={<NewSkill />} />
              <Route path="/skills/:id" element={<SkillDetail />} />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/configuracion" element={<Settings />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
