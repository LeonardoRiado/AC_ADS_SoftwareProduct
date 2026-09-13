import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GiftCard } from '../components/GiftCard';
import { api } from '../api';

export function ListaPublica() {
  const { slug } = useParams();
  const [dados, setDados] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [presenteSelecionado, setPresenteSelecionado] = useState(null);

  async function carregar(p) {
    setCarregando(true);
    try {
      const resultado = await api.listarPublico(slug, p);
      setDados(resultado);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar(pagina);
  }, [slug, pagina]);

  if (erro) {
    return (
      <div className="container" style={{ paddingTop: 80, textAlign: 'center' }}>
        <p className="error-text">{erro}</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <section
        style={{
          background: 'var(--color-forest)',
          color: 'var(--color-paper)',
          padding: '80px 0 60px',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.1rem', opacity: 0.85, marginBottom: 8 }}>
            Estamos nos casando e preparamos uma lista recheada de coisas boas caso queira nos presentear
          </p>
          <h1 style={{ fontSize: '3rem', color: 'var(--color-paper)', marginBottom: 16 }}>
            {dados?.casal?.nome || '...'}
          </h1>
          <p style={{ maxWidth: 480, margin: '0 auto', opacity: 0.85 }}>
            Em vez de presentes físicos, escolham algo da nossa lista para ajudar a construir essa nova fase com a gente.
          </p>
        </div>
      </section>

      <div className="container" style={{ paddingTop: 48, paddingBottom: 64 }}>
        {carregando ? (
          <p>Carregando presentes...</p>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
              {dados.presentes.map((presente) => (
                <GiftCard
                  key={presente.id}
                  presente={presente}
                  acao={
                    presente.status === 'disponivel' ? (
                      <button className="btn btn-rose" onClick={() => setPresenteSelecionado(presente)}>
                        Presentear
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-ink-soft)' }}>
                        Já comprado, obrigado!
                      </span>
                    )
                  }
                />
              ))}
            </div>

            {dados.paginacao.totalPaginas > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 40 }}>
                <button
                  className="btn btn-ghost"
                  disabled={pagina <= 1}
                  onClick={() => setPagina((p) => p - 1)}
                >
                  Anterior
                </button>
                <span style={{ alignSelf: 'center', color: 'var(--color-ink-soft)', fontSize: '0.9rem' }}>
                  Página {dados.paginacao.pagina} de {dados.paginacao.totalPaginas}
                </span>
                <button
                  className="btn btn-ghost"
                  disabled={pagina >= dados.paginacao.totalPaginas}
                  onClick={() => setPagina((p) => p + 1)}
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {presenteSelecionado && (
        <ModalCheckout
          presente={presenteSelecionado}
          onFechar={() => setPresenteSelecionado(null)}
          onSucesso={() => {
            setPresenteSelecionado(null);
            carregar(pagina);
          }}
        />
      )}
    </div>
  );
}

function ModalCheckout({ presente, onFechar, onSucesso }) {
  const [nome, setNome] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setEnviando(true);
    setErro('');
    try {
      await api.pagar({ gift_id: presente.id, nome_convidado: nome, mensagem });
      setSucesso(true);
      setTimeout(onSucesso, 1600);
    } catch (err) {
      setErro(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(38,34,29,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
      onClick={onFechar}
    >
      <div
        style={{ background: 'white', borderRadius: 4, padding: 32, maxWidth: 420, width: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        {sucesso ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <h3 style={{ marginBottom: 12 }}>Muito obrigado! 💛</h3>
            <p style={{ color: 'var(--color-ink-soft)' }}>Seu presente foi confirmado.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 style={{ marginBottom: 4 }}>{presente.titulo}</h3>
            <p style={{ color: 'var(--color-ink-soft)', marginBottom: 20 }}>
              R$ {Number(presente.valor).toFixed(2)}
            </p>

            <div className="field">
              <label>Seu nome</label>
              <input value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>
            <div className="field">
              <label>Mensagem para o casal (opcional)</label>
              <textarea value={mensagem} onChange={(e) => setMensagem(e.target.value)} rows={2} />
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-soft)', marginBottom: 16 }}>
              * Pagamento simulado para fins acadêmicos — nenhuma cobrança real é feita.
            </p>

            {erro && <p className="error-text">{erro}</p>}

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-ghost" type="button" onClick={onFechar}>Cancelar</button>
              <button className="btn btn-rose" type="submit" disabled={enviando} style={{ flex: 1 }}>
                {enviando ? 'Processando...' : 'Confirmar presente'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
