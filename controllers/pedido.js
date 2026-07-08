import { crear, obtener, obtenertodosporusuario, actualizarestadopedido, creardetallepedido } from "../model/pedido.js";
import { enviarconfirmacionpedido } from "../utils/sendemail.js";
import { obteid as obtenersuario} from "../model/usuario.js";

export const crearpedidodetalles = async (req, res) => {
    try {
        const { usuario_id, direccion_entrega, telefono, notas, detalles } = req.body;
        if (!usuario_id || !detalles || !detalles.length) {
            return res.status(400).json({ error: 'faltan datos' });
        }

        // calcular total
        let total = 0;
        detalles.forEach (d => {
            total += d.subtotal;
        });

        // crear el pedido
        const { data: pedidoData, error: pedidoError } = await crear({
            usuario_id: usuario_id,
            direccion_entrega: direccion_entrega,
            telefono: telefono,
            notas: notas,
            total: total
        });

        if (pedidoError || !pedidoData) {
            return res.status(500).json({ error: 'error al crear el pedido' });
        }

        // crear los detalles del pedido
        const detallesconpedido = detalles.map(d => ({
            ...d, pedido_id: pedidoData[0].id
        }));

        const { data: detalleData, error: detalleError } = await creardetallepedido(detallesconpedido);

            if (detalleError) {
                return res.status(500).json({ error: 'Error al crear los detalles del pedido' });
            }

        // obtener info del usuario para enviar el correo
        const {data: usuario } = await obtenersuario(usuario_id);

        // enviar el correo de confirmacion
        if (usuario && usuario.email) {
            await enviarconfirmacionpedido(usuario.email, usuario.nombre, pedidoData[0].id, total);
        }

        return res.status(201).json({ message: 'pedido creado correctamente', pedido: pedidoData[0] });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// obtener todos los pedidos de usuario
export const obtenerPedidosusuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error} = await obtener (id);
        if (error || !data) {
            return res.status(404).json({ error: 'no se encontro el pedido' });
        }
        return res.status(200).json({ pedido: data });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// obtener todos los pedidos de usuario
export const mispedidos = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        if (!usuario_id) {
            return res.status(400).json({ error: 'faltan datos' });
        }
        const { data, error } = await obtenertodosporusuario(usuario_id);
        if (error) {
            return res.status(500).json({ error: 'error al obtener los pedidos' });
        }
        return res.status(200).json({ pedidos: data });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};



