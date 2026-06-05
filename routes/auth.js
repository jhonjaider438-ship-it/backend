import express from 'express';
import { registro, login  } from '../controllers/autt.js';

const router = express.Router();

// rutas de autenticacion
router.post('/register', registro);
router.post('/login', login);

export default router