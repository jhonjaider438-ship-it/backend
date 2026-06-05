import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { crearuser, obteneremail } from '../model/usuario.js';

// registro
export const registro = async (req, res)=>{
    try {
        const {nombre,email, contrasena,} = req.body
        // validar datos
        if (!nombre || !email || !contrasena){
            return res.status(400).json({
                error: 'faltan datos'
            });
        }
        // verificamos el email si ya esiste en la base de datos
        const {data: usuarioexiste}= await obteneremail (email);
        if (usuarioexiste){
            return res.status(400).json({
                error: 'el email ya  esta registrado'
            });
        }
        // encriptar la contraseña
        const faulcontra = await bcrypt.hash(contrasena, 10);
        // rol por defecto
        const rol = 'usuarios'
        // guardar en la base de datos
        const {data, error} = await crearuser(
            nombre,
            email,
            faulcontra,
            rol
        )  
        if (error) {
            return res.status(500).json({
                error: 'error al crear el usuario',
                error: error
            });
        }

        return res.status(201).json({
            mensagge: 'usuario creado correctamente',
            usuario: {
                id: data[0].id,
                nombre: data[0].nombre,
                email: data [0].email,
                rol: data [0].rol,
            }
        });
    }catch (error){
        console.error('error en el regisro:', error);
        return res.status(500).json({
            error: 'error.menagge'
        });
    }
};

//  creamos el login
export const login = async (req, res) => {
    try {
        const {email,contrasena} = req.body;
        // validar datos
        if (!email || !contrasena) {
             return res.status(400).json({
                error: 'todos los datos son requeridos'
             });
        }

        // validamos si el email existe
        const  {data: usuario} = await obteneremail(email);
        if (!usuario) {
            return res.status(400).json({
                error: 'email no registrado'
            });  
        }

        // verificar la contraseña
        const pasworvalida = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!pasworvalida) {
            return res.status(400).json({
                error: 'contraeña incorrecta'
            });
        }

        // genera un token
        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email,
                rol: usuario.rol
            },
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );
        return res.status(200).json({
            mesaggen: 'login exitoso',
            token
        });
    } catch (error) {
        console.error('error en el login:', error);
        return res.status(500).json({
            error: error.mesage
        });
    }
}