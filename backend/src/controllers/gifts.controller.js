const pool = require('../config/db');

// [Sprint 1] Criar presente — rota privada, usada pelo casal logado
async function criar(req, res) {
  try {
    const { titulo, descricao, valor, imagem_url } = req.body;

    if (!titulo || !valor) {
      return res.status(400).json({ erro: 'Preencha ao menos título e valor' });
    }

    const resultado = await pool.query(
      `INSERT INTO gifts (user_id, titulo, descricao, valor, imagem_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.userId, titulo, descricao || null, valor, imagem_url || null]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar presente' });
  }
}

// [Sprint 1] Listar presentes do casal logado (visão de gerenciamento)
async function listarMeus(req, res) {
  try {
    const resultado = await pool.query(
      'SELECT * FROM gifts WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao listar presentes' });
  }
}

// [Sprint 1] Editar presente
async function editar(req, res) {
  try {
    const { id } = req.params;
    const { titulo, descricao, valor, imagem_url } = req.body;

    const resultado = await pool.query(
      `UPDATE gifts
       SET titulo = COALESCE($1, titulo),
           descricao = COALESCE($2, descricao),
           valor = COALESCE($3, valor),
           imagem_url = COALESCE($4, imagem_url)
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [titulo, descricao, valor, imagem_url, id, req.userId]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Presente não encontrado' });
    }

    res.json(resultado.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao editar presente' });
  }
}

// [Sprint 1] Remover presente
async function remover(req, res) {
  try {
    const { id } = req.params;
    const resultado = await pool.query(
      'DELETE FROM gifts WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.userId]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Presente não encontrado' });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao remover presente' });
  }
}

// [Sprint 2] Listagem pública e paginada — convidado acessa sem login via slug do casal
// Ex: GET /api/publico/joao-e-maria/presentes?pagina=1&limite=6
async function listarPublico(req, res) {
  try {
    const { slug } = req.params;
    const pagina = Math.max(parseInt(req.query.pagina) || 1, 1);
    const limite = Math.min(parseInt(req.query.limite) || 6, 50);
    const offset = (pagina - 1) * limite;

    const usuario = await pool.query('SELECT id, nome, slug FROM users WHERE slug = $1', [slug]);
    if (usuario.rows.length === 0) {
      return res.status(404).json({ erro: 'Lista não encontrada' });
    }

    const casal = usuario.rows[0];

    const totalResultado = await pool.query('SELECT COUNT(*) FROM gifts WHERE user_id = $1', [casal.id]);
    const total = parseInt(totalResultado.rows[0].count);

    const presentes = await pool.query(
      `SELECT id, titulo, descricao, valor, imagem_url, status
       FROM gifts
       WHERE user_id = $1
       ORDER BY created_at ASC
       LIMIT $2 OFFSET $3`,
      [casal.id, limite, offset]
    );

    res.json({
      casal: { nome: casal.nome, slug: casal.slug },
      presentes: presentes.rows,
      paginacao: {
        pagina,
        limite,
        total,
        totalPaginas: Math.ceil(total / limite),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao listar presentes' });
  }
}

module.exports = { criar, listarMeus, editar, remover, listarPublico };
