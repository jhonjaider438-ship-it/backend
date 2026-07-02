import { obtenerTodos, obtenerPorId, obtenerPorCategoria, crearHelado, actualizarHelado, eliminarHelado } from '../model/helados.js';

// obtener todos los datos 
export const listarHelados = async (req, res) => {
    try {
        const {data, error} = await obtenerTodos();
        if (error) {
            return res.status(500).json({error: 'Error al obtener los datos'});
        }
        return res.status(200).json({data});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};

// obtener datos por id
export const obtenerHelado = async (req, res) => {
    try {
        const {id} = req.params;
        const {data, error} = await obtenerPorId(id);
        if (error || !data) 
            return res.status (404).json({error: 'No se encontro el dato'});
            return res.status(200).json({data});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};

// obtener datos por categoria
export const obtenerPorCat = async (req, res) => {
    try {
        const {categoria} = req.params;
        const {data, error} = await obtenerPorCategoria(categoria);
        if (error) {
            return res.status (500).json({error: 'error'});
        }
            return res.status(200).json({data});
} catch (error) {
    return res.status(500).json({error: error.message});
    }
};

// crear helado
export const crear = async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, imagen_url, categoria, sabor} = req.body;
        if (!nombre || !precio || !imagen_url) {
            return res.status(400).json({error: 'nombre, precio y imagen son requeridos'});
        }
        const {data, error} = await crearHelado({nombre, descripcion, precio, stock, imagen_url, categoria, sabor});
        if (error) {
             return res.status(500).json({error: 'error al crear'});
        } 
            return res.status(201).json({mensaje: 'creado', helado: data[0]});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

// actualizar datos
export const actualizar = async (req, res) => {
    try {
        const {id} = req.params;
        const { data, error } = await actualizarHelado(id, req.body);
        if (error) {
            return res.status(500).json({error: 'error al actualizar'});
        }
            return res.status(200).json({mensaje: 'actualizado', helado: data[0]});
    }catch (error) {
        return res.status(500).json({error: error.message});
    }
};

// eliminar datos
export const eliminar = async (req, res) => {
    try {
        const {id} = req.params;
        const {data, error} = await eliminarHelado(id);
        if (error) {
            return res.status(500).json({error: 'error al eliminar'});
        }
            return res.status(200).json({mensaje: 'eliminado', id});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};