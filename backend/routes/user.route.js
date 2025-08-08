const express = require('express');
const authMiddleware = require("../middleware/auth.js");
const { getUser, loginUser, registerUser, changePassword } = require('../controllers/user.controller.js');

const router = express.Router();

// Rota de registro
router.post('/register', registerUser);

// Rota de login
router.post('/login', loginUser);

// Rota de usuário logado
router.get('/me', authMiddleware, getUser);

// Rota de alteração de senha
router.put('/change-password', changePassword);

module.exports = router;
