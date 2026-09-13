require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const giftsRoutes = require('./routes/gifts.routes');
const transactionsRoutes = require('./routes/transactions.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

app.use(cors()); // libera acesso do front-end (React em outra porta)
app.use(express.json());

// Todas as rotas da API ficam sob /api
app.use('/api/auth', authRoutes);
app.use('/api', giftsRoutes);
app.use('/api', transactionsRoutes);
app.use('/api', dashboardRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'ok', mensagem: 'API Lista de Casamento Virtual no ar' });
});

const PORTA = process.env.PORT || 3333;
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
