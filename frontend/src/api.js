const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api';

async function requisitar(caminho, opcoes = {}) {
  const token = localStorage.getItem('token');

  const resposta = await fetch(`${BASE_URL}${caminho}`, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opcoes.headers,
    },
  });

  const contentType = resposta.headers.get('content-type') || '';
  const dados = contentType.includes('application/json') ? await resposta.json() : null;

  if (!resposta.ok) {
    throw new Error(dados?.erro || 'Erro ao comunicar com o servidor');
  }

  return dados;
}

export const api = {
  cadastrar: (dados) => requisitar('/auth/cadastro', { method: 'POST', body: JSON.stringify(dados) }),
  login: (dados) => requisitar('/auth/login', { method: 'POST', body: JSON.stringify(dados) }),

  criarPresente: (dados) => requisitar('/presentes', { method: 'POST', body: JSON.stringify(dados) }),
  listarMeusPresentes: () => requisitar('/presentes'),
  editarPresente: (id, dados) => requisitar(`/presentes/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
  removerPresente: (id) => requisitar(`/presentes/${id}`, { method: 'DELETE' }),

  listarPublico: (slug, pagina = 1, limite = 6) =>
    requisitar(`/publico/${slug}/presentes?pagina=${pagina}&limite=${limite}`),

  pagar: (dados) => requisitar('/pagamentos', { method: 'POST', body: JSON.stringify(dados) }),

  dashboard: () => requisitar('/dashboard'),
};
