-- Schema do banco de dados — Lista de Casamento Virtual

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL,
  slug VARCHAR(160) UNIQUE NOT NULL, -- usado na URL pública da lista, ex: /lista/joao-e-maria
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gifts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  titulo VARCHAR(160) NOT NULL,
  descricao TEXT,
  valor NUMERIC(10,2) NOT NULL,
  imagem_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'disponivel', -- disponivel | reservado | comprado
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  gift_id INTEGER NOT NULL REFERENCES gifts(id) ON DELETE CASCADE,
  nome_convidado VARCHAR(120) NOT NULL,
  mensagem TEXT,
  valor_pago NUMERIC(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'aprovado', -- simulado: sempre aprovado
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gifts_user_id ON gifts(user_id);
CREATE INDEX IF NOT EXISTS idx_gifts_status ON gifts(status);
CREATE INDEX IF NOT EXISTS idx_transactions_gift_id ON transactions(gift_id);
