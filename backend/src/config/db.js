const { Pool } = require('pg');

// A pool gerencia as conexões com o Postgres.
// As credenciais vêm do .env (veja .env.example).
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'lista_casamento',
});

module.exports = pool;
