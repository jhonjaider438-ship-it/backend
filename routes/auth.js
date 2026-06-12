import express from 'express';
import { registro, login  } from '../controllers/autt.js';
import { recuperarr } from '../controllers/recuperar.js';

const router = express.Router();

// rutas de autenticacion
router.post('/register', registro);
router.post('/login', login);

// ruta para recuperar contraseña
router.post('/forgot-password', recuperarr);

export default router