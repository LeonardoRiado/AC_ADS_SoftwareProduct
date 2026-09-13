const pool = require('../config/db');

// [Sprint 4] Dashboard do casal — totais arrecadados e quem comprou o quê.
// Rota privada: só o próprio casal logado vê seus dados.
async function resumo(req, res) {
  try {
    const totalArrecadado = await pool.query(
      `SELECT COALESCE(SUM(t.valor_pago), 0) AS total
       FROM transactions t
       JOIN gifts g ON g.id = t.gift_id
       WHERE g.user_id = $1`,
      [req.userId]
    );

    const compradores = await pool.query(
      `SELECT t.id, t.nome_convidado, t.mensagem, t.valor_pago, t.created_at,
              g.titulo AS presente
       FROM transactions t
       JOIN gifts g ON g.id = t.gift_id
       WHERE g.user_id = $1
       ORDER BY t.created_at DESC`,
      [req.userId]
    );

    const contagemPresentes = await pool.query(
      `SELECT status, COUNT(*) AS quantidade
       FROM gifts
       WHERE user_id = $1
       GROUP BY status`,
      [req.userId]
    );

    res.json({
      totalArrecadado: parseFloat(totalArrecadado.rows[0].total),
      compradores: compradores.rows,
      presentesPorStatus: contagemPresentes.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao carregar dashboard' });
  }
}

module.exports = { resumo };
