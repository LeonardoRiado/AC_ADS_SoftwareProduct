import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { api } from '../api';

export function Painel() {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api.dashboard()
      .then(setDados)
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <>
      <Header />
      <div className="container" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <h2 style={{ fontSize: '2rem', marginBottom: 32 }}>Painel</h2>

        {carregando && <p>Carregando...</p>}
        {erro && <p className="error-text">{erro}</p>}

        {dados && (
          <>
            <div
              style={{
                background: 'var(--color-forest)',
                color: 'var(--color-paper)',
                borderRadius: 4,
                padding: '32px 28px',
                marginBottom: 40,
              }}
            >
              <p style={{ opacity: 0.8, marginBottom: 8 }}>Total arrecadado até agora</p>
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem' }}>
                R$ {dados.totalArrecadado.toFixed(2)}
              </strong>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 40 }}>
              {dados.presentesPorStatus.map((item) => (
                <div
                  key={item.status}
                  style={{ border: '1px solid var(--color-line)', borderRadius: 4, padding: 20, flex: 1, background: 'white' }}
                >
                  <p className={`status-tag status-${item.status}`} style={{ marginBottom: 8 }}>
                    {item.status}
                  </p>
                  <strong style={{ fontSize: '1.6rem' }}>{item.quantidade}</strong>
                </div>
              ))}
            </div>

            <h3 style={{ marginBottom: 16, fontSize: '1.2rem' }}>Quem já presenteou</h3>
            {dados.compradores.length === 0 ? (
              <p style={{ color: 'var(--color-ink-soft)' }}>Ninguém ainda — compartilhe o link da lista!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {dados.compradores.map((c) => (
                  <div key={c.id} style={{ border: '1px solid var(--color-line)', borderRadius: 4, padding: 16, background: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{c.nome_convidado}</strong>
                      <span>R$ {Number(c.valor_pago).toFixed(2)}</span>
                    </div>
                    <p style={{ color: 'var(--color-ink-soft)', fontSize: '0.9rem', margin: '4px 0 0' }}>
                      presenteou: {c.presente}
                    </p>
                    {c.mensagem && (
                      <p style={{ fontStyle: 'italic', fontSize: '0.9rem', marginTop: 8 }}>"{c.mensagem}"</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
