const pool = require('../config/db');

// [Sprint 3] Checkout simulado — convidado "paga" um presente.
// Não integra gateway real: só grava a transação e marca o presente como comprado.
// Rota pública, pensada pra ser chamada a partir do formulário da lista.
async function pagar(req, res) {
  const client = await pool.connect();
  try {
    const { gift_id, nome_convidado, mensagem } = req.body;

    if (!gift_id || !nome_convidado) {
      return res.status(400).json({ erro: 'Informe o presente e o nome do convidado' });
    }

    await client.query('BEGIN');

    const presenteResultado = await client.query(
      'SELECT * FROM gifts WHERE id = $1 FOR UPDATE',
      [gift_id]
    );
    const presente = presenteResultado.rows[0];

    if (!presente) {
      await client.query('ROLLBACK');
      return res.status(404).json({ erro: 'Presente não encontrado' });
    }

    if (presente.status !== 'disponivel') {
      await client.query('ROLLBACK');
      return res.status(409).json({ erro: 'Esse presente já foi reservado ou comprado' });
    }

    // Simulação: aqui entraria a chamada a um gateway de pagamento real.
    // Como é fictício, consideramos o pagamento sempre aprovado.
    const transacao = await client.query(
      `INSERT INTO transactions (gift_id, nome_convidado, mensagem, valor_pago, status)
       VALUES ($1, $2, $3, $4, 'aprovado')
       RETURNING *`,
      [gift_id, nome_convidado, mensagem || null, presente.valor]
    );

    await client.query(
      "UPDATE gifts SET status = 'comprado' WHERE id = $1",
      [gift_id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      mensagem: 'Pagamento simulado aprovado com sucesso!',
      transacao: transacao.rows[0],
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ erro: 'Erro ao processar pagamento' });
  } finally {
    client.release();
  }
}

module.exports = { pagar };
