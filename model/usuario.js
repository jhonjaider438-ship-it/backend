// importamos la base de datos 
import { supabase } from "../config/supabase.js";

// obtener todos los usuarios
export const UserModel={
    obtenertodos: async () => {
    const {data, error } = await supabase.from('usuarios').select('*')
    return {data, error};
}
};

// crear un nuevo usuario
export const crearuser =  async(nombre,email, contrasena, rol)=>{
    const {data,error} = await supabase
    .from('usuarios')
    .insert([{nombre,email,rol: rol || 'usuarios', contrasena}])
    .select();
    return {data, error};
};

//buscar el usuario por email para el login
export const obteneremail = async(email)=>{
    const {data,error}= await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .single();
    return {data,error};
};

// obtener un usuario por id
export const obteid = async (id) => {
    const {data,error} = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', id)
    .single();
    return {data,error};
};

// actualizar usuarios
export const actualizar = async (id, campos) => {
    const {data,error} = await supabase
    .from('usuarios')
    .update(campos)
    .eq ('id', id)
    .select('id, nombre, email, rol');
    return {data,error};
};

// eliminar usuario
export const eliminar = async (id) => {
    const {data,error} = await supabase
    .from('usuarios')
    .delete()
    .eq('id', id)
    .select('id, nombre, email, rol');
    return {data,error};
};

