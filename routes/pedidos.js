import express from 'express';
import { crearpedidodetalles, obtenerPedidosusuario, mispedidos } from '../controllers/pedido.js';

const router = express.Router();

// Crear pedido
router.post('/', crearpedidodetalles);

// Mis pedidos
router.get('/mis-pedidos/:usuario_id', mispedidos);

// Obtener pedido por ID
router.get('/:id', obtenerPedidosusuario);

export default router;