import express from 'express';
import { obteneruser, buscarusuarioid, actualizarusuario, eliminarusuario } from '../controllers/usuario.js';

const router = express.Router();
// ruta para obtener todos los usuarios
router.get('/', obteneruser);
// ruta para buscar usuario por id
router.get('/obtener/:id', buscarusuarioid);
//ruta para actualizar usuario
router.put('/actualizar/:id', actualizarusuario) 
// ruta ara eliminar usuario
router.delete('/eliminar/:id', eliminarusuario);

export default router;