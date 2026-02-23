import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Pacientes } from './pages/Pacientes';
import { Prontuarios } from './pages/Prontuarios';
import { ProntuarioDetalhes } from './pages/ProntuarioDetalhes';
import { Agenda } from './pages/Agenda';
import { Financeiro } from './pages/Financeiro';
import { Login } from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function MainLayout() {
  return (
    <div className="app-container hover:bg-transparent">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="page-content" style={{ overflowY: 'auto' }}>
          <div className="container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pacientes" element={<Pacientes />} />
              <Route path="/prontuarios" element={<Prontuarios />} />
              <Route path="/prontuarios/:id" element={<ProntuarioDetalhes />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/financeiro" element={<Financeiro />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <RequireAuth>
                    <MainLayout />
                  </RequireAuth>
                }
              />
            </Routes>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
