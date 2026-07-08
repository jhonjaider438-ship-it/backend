import {supabase} from "../config/supabase.js"

export const crear = async (pedido) => {
    const { data, error } = await supabase
        .from('pedidos')
        .insert(pedido)
        .select();
        return { data, error };
};

export const obtener = async (id) => {
    const { data, error } = await supabase
        .from('pedidos')
        .select(`*, usuario:usuario_id (id, nombre, email),
            detalles:detalle_pedido(id, cantidad, precio_unitario, subtotal,
            helado:helado_id(id, nombre, imagen_url)
            )
    `)
    .eq('id', id)
    .single();

    return { data, error };
};

export const obtenertodosporusuario = async (usuarioid) => {
    const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .eq('usuario_id', usuarioid)
        .order('fecha_pedido', { ascending: false });
        return { data, error };
};

export const actualizarestadopedido = async (id, pedido) => {
    const { data, error } = await supabase
        .from('pedidos')
        .update({estado, actualizado_en: new Date()})
        .eq('id', id)
        .select();
    return { data, error };
};

export const creardetallepedido = async (detalledata) => {
    const { data, error } = await supabase
        .from('detalle_pedido')
        .insert(detalledata)
        .select();
    return { data, error };
};


