import express from 'express';
import { listarHelados, obtenerHelado, obtenerPorCat, crear, actualizar, eliminar } from '../controllers/helados.js';
import { verificarToken, verificarAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', listarHelados);
router.get('/:id', obtenerHelado);
router.get('/categoria/:categoria', obtenerPorCat);
// rutas privadas para administradores requieren token y rol de admin
router.post('/', verificarToken, verificarAdmin, crear);
router.put('/:id', verificarToken, verificarAdmin, actualizar);
router.delete('/:id', verificarToken, verificarAdmin, eliminar); 

export default router;