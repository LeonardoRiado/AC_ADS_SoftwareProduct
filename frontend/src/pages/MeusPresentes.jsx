import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { GiftCard } from '../components/GiftCard';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export function MeusPresentes() {
  const { usuario } = useAuth();
  const [presentes, setPresentes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [form, setForm] = useState({ titulo: '', descricao: '', valor: '', imagem_url: '' });
  const [enviando, setEnviando] = useState(false);
  const [presenteEditando, setPresenteEditando] = useState(null);
  const [formEdicao, setFormEdicao] = useState({ titulo: '', descricao: '', valor: '', imagem_url: '' });
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

  async function carregar() {
    setCarregando(true);
    try {
      const dados = await api.listarMeusPresentes();
      setPresentes(dados);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleCriar(e) {
    e.preventDefault();
    setEnviando(true);
    setErro('');
    try {
      await api.criarPresente({ ...form, valor: parseFloat(form.valor) });
      setForm({ titulo: '', descricao: '', valor: '', imagem_url: '' });
      carregar();
    } catch (err) {
      setErro(err.message);
    } finally {
      setEnviando(false);
    }
  }

  async function handleRemover(id) {
    if (!confirm('Remover este presente da lista?')) return;
    try {
      await api.removerPresente(id);
      carregar();
    } catch (err) {
      setErro(err.message);
    }
  }

  function abrirEdicao(presente) {
    setPresenteEditando(presente.id);
    setFormEdicao({
      titulo: presente.titulo,
      descricao: presente.descricao || '',
      valor: presente.valor,
      imagem_url: presente.imagem_url || '',
    });
  }

  async function handleSalvarEdicao(e) {
    e.preventDefault();
    setSalvandoEdicao(true);
    setErro('');
    try {
      await api.editarPresente(presenteEditando, { ...formEdicao, valor: parseFloat(formEdicao.valor) });
      setPresenteEditando(null);
      carregar();
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvandoEdicao(false);
    }
  }

  const linkPublico = usuario ? `${window.location.origin}/lista/${usuario.slug}` : '';

  return (
    <>
      <Header />
      <div className="container" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <h2 style={{ fontSize: '2rem', marginBottom: 8 }}>Meus presentes</h2>
        <p style={{ color: 'var(--color-ink-soft)' }}>
          Compartilhe este link com os convidados: <br />
          <a href={linkPublico} target="_blank" rel="noreferrer" style={{ color: 'var(--color-rose)' }}>
            {linkPublico}
          </a>
        </p>

        <form
          onSubmit={handleCriar}
          style={{
            margin: '32px 0',
          }}
        >
          <h3 style={{ marginBottom: 16,
            paddingBottom: 12,
            fontSize: '1.2rem',
            borderBottom: '3px solid var(--color-forest)',
             }}>Adicionar presente</h3>
          <div className="field">
            <label>Título</label>
            <input
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              placeholder="Ex: Lua de mel em Fernando de Noronha"
              required
            />
          </div>
          <div className="field">
            <label>Descrição (opcional)</label>
            <textarea
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              rows={2}
            />
          </div>
          <div className="field">
            <label>Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.valor}
              onChange={(e) => setForm({ ...form, valor: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label>URL da imagem (opcional)</label>
            <input
              value={form.imagem_url}
              onChange={(e) => setForm({ ...form, imagem_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          {erro && <p className="error-text">{erro}</p>}

          <button className="btn btn-primary" type="submit" disabled={enviando}>
            {enviando ? 'Adicionando...' : 'Adicionar presente'}
          </button>
        </form>

        {carregando ? (
          <p>Carregando...</p>
        ) : presentes.length === 0 ? (
          <p style={{ color: 'var(--color-ink-soft)' }}>Nenhum presente cadastrado ainda.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {presentes.map((presente) =>
              presenteEditando === presente.id ? (
                <form
                  key={presente.id}
                  onSubmit={handleSalvarEdicao}
                  style={{ border: '1px solid var(--color-rose)', borderRadius: 4, padding: 20, background: 'white' }}
                >
                  <div className="field">
                    <label>Título</label>
                    <input
                      value={formEdicao.titulo}
                      onChange={(e) => setFormEdicao({ ...formEdicao, titulo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="field">
                    <label>Descrição</label>
                    <textarea
                      value={formEdicao.descricao}
                      onChange={(e) => setFormEdicao({ ...formEdicao, descricao: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="field">
                    <label>Valor (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formEdicao.valor}
                      onChange={(e) => setFormEdicao({ ...formEdicao, valor: e.target.value })}
                      required
                    />
                  </div>
                  <div className="field">
                    <label>URL da imagem</label>
                    <input
                      value={formEdicao.imagem_url}
                      onChange={(e) => setFormEdicao({ ...formEdicao, imagem_url: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      className="btn btn-ghost"
                      type="button"
                      onClick={() => setPresenteEditando(null)}
                    >
                      Cancelar
                    </button>
                    <button className="btn btn-rose" type="submit" disabled={salvandoEdicao} style={{ flex: 1 }}>
                      {salvandoEdicao ? 'Salvando...' : 'Salvar alterações'}
                    </button>
                  </div>
                </form>
              ) : (
                <GiftCard
                  key={presente.id}
                  presente={presente}
                  acao={
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button className="btn btn-ghost" onClick={() => abrirEdicao(presente)}>
                        Editar
                      </button>
                      <button className="btn btn-ghost" onClick={() => handleRemover(presente.id)}>
                        Remover
                      </button>
                    </div>
                  }
                />
              )
            )}
          </div>
        )}
      </div>
    </>
  );
}
