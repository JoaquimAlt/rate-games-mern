import express from 'express';

import { loginUser, registerUser } from '../controllers/auth.controller.js';

const router = express.Router();

// Rota de registro
router.post('/register', registerUser);

// Rota de login
router.post('/login', loginUser);

export default router;
