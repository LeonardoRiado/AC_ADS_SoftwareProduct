const rotulos = {
  disponivel: 'Disponível',
  reservado: 'Reservado',
  comprado: 'Comprado',
};

export function GiftCard({ presente, acao }) {
  return (
    <div
      style={{
        border: '1px solid var(--color-line)',
        borderRadius: 4,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        background: 'white',
      }}
    >
      {presente.imagem_url && (
        <img
          src={presente.imagem_url}
          alt={presente.titulo}
          style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 3 }}
        />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 8 }}>
        <h3 style={{ fontSize: '1.1rem' }}>{presente.titulo}</h3>
        <span className={`status-tag status-${presente.status}`}>
          {rotulos[presente.status] || presente.status}
        </span>
      </div>
      {presente.descricao && (
        <p style={{ color: 'var(--color-ink-soft)', fontSize: '0.9rem', margin: 0 }}>
          {presente.descricao}
        </p>
      )}
      <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--color-forest)' }}>
        R$ {Number(presente.valor).toFixed(2)}
      </strong>
      {acao}
    </div>
  );
}
