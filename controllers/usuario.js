import { UserModel, obteid, actualizar, eliminar } from "../model/usuario.js";
import bcrypt from 'bcrypt';

// obtener todos los usuarios
export const obteneruser = async (req, res) => {
    try {
        const { data, error } = await UserModel.obtenertodos();
        if (error) {
            return res.status(500).json({
                error: error.message
            });
        }
        return res.status(200).json({
            usuarios: data
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return res.status(500).json({
            error: error.message
        });
    }
};

// obtener un usuario por id 
export const buscarusuarioid = async (req,res) =>{
    try {
        const {id} = req.params;
        const {data,error} = await obteid(id);
        if (error || !data) {
            return res,status(404).json({error: error.message});
        }
        return res.status (200).json({
            usuarios: data
        });
    } catch (error) {
        console.error('error al obtener usuario', error);
        return res.status(500).json({error: error.message});
    }
};

// actualizar usuario 
export const actualizarusuario = async (req, res) => {
    try {
        const { id } = req.params;
        const campos = req.body;
        // encriptar contraseña si se envía
        if (campos.contrasena) {
            campos.contrasena = await bcrypt.hash(campos.contrasena, 10);
        }
        const { data, error } = await actualizar(id, campos);

        if (error || !data) {
            return res.status(404).json({
                error: error?.message || 'usuario no encontrado'
            });
        }
        return res.status(200).json({
            mensaje: 'usuario actualizado correctamente',
            usuario: data
        });

    } catch (error) {
        console.error('error al actualizar usuario', error);

        return res.status(500).json({
            error: error.message
        });
    }
};

// eliminar usuario 
export const eliminarusuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await eliminar(id);
        if (error || !data) {
            return res.status(404).json({
                error: error?.message || 'usuario no encontrado'
            });
        }
        return res.status(200).json({
            mensaje: 'usuario eliminado correctamente',
            usuario: data
        });
    } catch (error) {
        console.error('error al eliminar usuario', error);
        return res.status(500).json({
            error: error.message
        });
    }
};