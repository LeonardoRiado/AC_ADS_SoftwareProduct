import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { entrar } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      const { usuario, token } = await api.login({ email, senha });
      entrar(usuario, token);
      navigate('/meus-presentes');
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 400, paddingTop: 80 }}>
      <h2 style={{ fontSize: '2rem', marginBottom: 8 }}>Bem-vindos de volta</h2>
      <p style={{ color: 'var(--color-ink-soft)', marginBottom: 32 }}>
        Entre para gerenciar a lista do casal.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="senha">Senha</label>
          <input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </div>

        {erro && <p className="error-text">{erro}</p>}

        <button className="btn btn-primary" type="submit" disabled={carregando} style={{ width: '100%' }}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p style={{ marginTop: 20, fontSize: '0.9rem' }}>
        Ainda não têm conta? <Link to="/cadastro">Criar lista</Link>
      </p>
    </div>
  );
}
