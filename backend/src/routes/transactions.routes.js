const express = require('express');
const router = express.Router();
const { pagar } = require('../controllers/transactions.controller');

// Pública: o convidado não precisa de login pra presentear
router.post('/pagamentos', pagar);

module.exports = router;
