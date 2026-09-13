const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Transforma "João e Maria" em "joao-e-maria" pra usar na URL pública
function gerarSlug(nome) {
  return nome
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function cadastrar(req, res) {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Preencha nome, email e senha' });
    }

    const jaExiste = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (jaExiste.rows.length > 0) {
      return res.status(409).json({ erro: 'Já existe uma conta com esse email' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    let slugBase = gerarSlug(nome);
    let slug = slugBase;
    let contador = 1;

    // garante slug único caso já exista outro casal com nome parecido
    while ((await pool.query('SELECT id FROM users WHERE slug = $1', [slug])).rows.length > 0) {
      slug = `${slugBase}-${contador}`;
      contador++;
    }

    const resultado = await pool.query(
      `INSERT INTO users (nome, email, senha_hash, slug)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nome, email, slug`,
      [nome, email, senhaHash, slug]
    );

    const usuario = resultado.rows[0];
    const token = jwt.sign({ userId: usuario.id }, process.env.JWT_SECRET || 'segredo_dev', { expiresIn: '7d' });

    res.status(201).json({ usuario, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Preencha email e senha' });
    }

    const resultado = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const usuario = resultado.rows[0];

    if (!usuario) {
      return res.status(401).json({ erro: 'Email ou senha inválidos' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Email ou senha inválidos' });
    }

    const token = jwt.sign({ userId: usuario.id }, process.env.JWT_SECRET || 'segredo_dev', { expiresIn: '7d' });

    res.json({
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, slug: usuario.slug },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao fazer login' });
  }
}

module.exports = { cadastrar, login };
