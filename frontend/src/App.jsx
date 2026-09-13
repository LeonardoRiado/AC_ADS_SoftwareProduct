import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RotaProtegida } from './components/RotaProtegida';
import { Login } from './pages/Login';
import { Cadastro } from './pages/Cadastro';
import { MeusPresentes } from './pages/MeusPresentes';
import { ListaPublica } from './pages/ListaPublica';
import { Painel } from './pages/Painel';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/lista/:slug" element={<ListaPublica />} />

          <Route
            path="/meus-presentes"
            element={
              <RotaProtegida>
                <MeusPresentes />
              </RotaProtegida>
            }
          />
          <Route
            path="/painel"
            element={
              <RotaProtegida>
                <Painel />
              </RotaProtegida>
            }
          />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
