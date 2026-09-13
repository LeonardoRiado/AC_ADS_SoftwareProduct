import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const { usuario, sair } = useAuth();
  const navigate = useNavigate();

  function handleSair() {
    sair();
    navigate('/login');
  }

  return (
    <header style={{ borderBottom: '1px solid var(--color-line)', padding: '20px 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ fontSize: '1.4rem' }}>Nossa Lista</h1>
        </Link>
        {usuario && (
          <nav style={{ display: 'flex', gap: 20, alignItems: 'center', fontSize: '0.9rem' }}>
            <Link to="/meus-presentes">Meus presentes</Link>
            <Link to="/painel">Painel</Link>
            <span style={{ color: 'var(--color-ink-soft)' }}>{usuario.nome}</span>
            <button className="btn btn-ghost" onClick={handleSair}>Sair</button>
          </nav>
        )}
      </div>
    </header>
  );
}
