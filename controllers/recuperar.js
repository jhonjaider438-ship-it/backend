import { codigorecupera } from "../model/recuperar.js";
import { obteneremail } from "../model/usuario.js";
import nodemailer from 'nodemailer';

// configuramos el transporte de nodemailer
const transporte = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// configurar la logica para enviar el codigo de recueperacion
export const recuperarr = async (req,res) => {
    try {
        const {email} = req.body;

        if(!email){
            return res.status(400).json({error: 'el correo electronico es requerido'});
        }
        // verificar si el usuario existe
        const {data: usuario,error: errorusuario} = await obteneremail(email);
        if (errorusuario || !usuario) {
            return res.status(404).json({error: 'usuario no encontrado'});
        }

        // generamos el codigo de recuperacion
       const codigo = Math.floor(100000 + Math.random() * 900000).toString(); // codigo de 6 digitos  
    }catch (error) {
        console.error('Error en forgotPassword:', error);
        return res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
}; 
