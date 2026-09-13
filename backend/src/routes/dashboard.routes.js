const express = require('express');
const router = express.Router();
const { autenticar } = require('../middleware/auth.middleware');
const { resumo } = require('../controllers/dashboard.controller');

router.get('/dashboard', autenticar, resumo);

module.exports = router;
