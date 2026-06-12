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

       // guardar el codigo en la base de datos
       const {error: errorcodigo} = await codigorecupera (usuario.id, codigo);
       if (errorcodigo) {
        return res.status(500).json({error:'error al generar el codigo de recuperacion'});
       }
       // creamos el email del codigo
       await transporte.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `tu codigo de recuperacion es: ${codigo}`,
        html:`
        <h2> recuperacin de contraseña </h2>
        <p> hola ${usuario.nombre || 'usuario'}, </p>
        <p> tu codigo de recuperacion es: </p>
        <h1 style="color: #39a; font-size: 36px;">${codigo}</h1>
        <p> este codigo es valido por 15 minutos si no lo solisitaste ignora este correo. </p>
        <p>grasias</p>
        <p> el equipode soporte </p>
        <p> no compartas este codigo con nadie </p>
        `
       });
       return res.status(200).json({ message: 'codigo de recuperacion enviado al correo electronico'});
       
    }catch (error) {
        console.error('Error en forgotPassword:', error);
        return res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
}; 
