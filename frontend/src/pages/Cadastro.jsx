import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export function Cadastro() {
  const [nome, setNome] = useState('');
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
      const { usuario, token } = await api.cadastrar({ nome, email, senha });
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
      <h2 style={{ fontSize: '2rem', marginBottom: 8 }}>Criar a lista</h2>
      <p style={{ color: 'var(--color-ink-soft)', marginBottom: 32 }}>
        Em poucos minutos vocês têm um link pra compartilhar com os convidados.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="nome">Nome do casal</label>
          <input
            id="nome"
            type="text"
            placeholder="Ex: João e Maria"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            minLength={6}
            required
          />
        </div>

        {erro && <p className="error-text">{erro}</p>}

        <button className="btn btn-primary" type="submit" disabled={carregando} style={{ width: '100%' }}>
          {carregando ? 'Criando...' : 'Criar lista'}
        </button>
      </form>

      <p style={{ marginTop: 20, fontSize: '0.9rem' }}>
        Já têm conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  );
}
