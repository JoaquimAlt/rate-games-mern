import express from 'express';
import authMiddleware from "../middleware/auth.js"
import { getUser, loginUser, registerUser } from '../controllers/user.controller.js';

const router = express.Router();

// Rota de registro
router.post('/register', registerUser);

// Rota de login
router.post('/login', loginUser);

//rota de usuário logado
router.get('/me', authMiddleware, getUser);

export default router;
