import express from 'express';
import { listarHelados, obtenerHelado, obtenerPorCat, crear, actualizar, eliminar } from '../controllers/helados.js';

const router = express.Router();

router.get('/', listarHelados);
router.get('/:id', obtenerHelado);
router.get('/categoria/:categoria', obtenerPorCat);
router.post('/', crear);
router.put('/:id', actualizar);
router.delete('/:id', eliminar);

export default router;