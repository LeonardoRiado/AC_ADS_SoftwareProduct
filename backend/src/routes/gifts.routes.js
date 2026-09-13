const express = require('express');
const router = express.Router();
const { autenticar } = require('../middleware/auth.middleware');
const {
  criar,
  listarMeus,
  editar,
  remover,
  listarPublico,
} = require('../controllers/gifts.controller');

// Rotas privadas — precisam de login (o casal gerenciando seus próprios presentes)
router.post('/presentes', autenticar, criar);
router.get('/presentes', autenticar, listarMeus);
router.put('/presentes/:id', autenticar, editar);
router.delete('/presentes/:id', autenticar, remover);

// Rota pública — convidado acessa sem login pelo slug do casal
router.get('/publico/:slug/presentes', listarPublico);

module.exports = router;
