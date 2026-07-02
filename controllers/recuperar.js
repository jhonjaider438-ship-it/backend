import { codigorecupera, marcarCodigoComoUsado, obtenerCodigoValido } from "../model/recuperar.js";
import { obteneremail, actualizar } from "../model/usuario.js";
import nodemailer from 'nodemailer';
import bcrypt from "bcrypt";

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

// cambiar contraseña y verificar el codigo de recuperacion
export const verifycode = async (req, res) => {
    try {
        const { email, codigo, nuevacontrasena } = req.body;

        //verfificamos las entradas
        if (!email || !codigo || !nuevacontrasena) {
            return res.status(400).json({error: 'todos los datos son requeridos'});
        }
        // verificamos si el usuario ya esta en la base de datos 
        const { data: usuario} = await obteneremail(email);
        if (!usuario) {
            return res.status(404).json({error: 'usuario no encontrado'});
        }

        // verificamos que el correo sea correcto
        const {data: codigorecupera} = await obtenerCodigoValido(usuario.id, codigo);
        if (!codigorecupera) {
            return res.status(400).json({error: 'codigo de recuperacion invalido o expirado'});
        }

        // encriptamos la contraseña
        const hashedcontrasena = await bcrypt.hash(nuevacontrasena, 10);

        // actualizamos la contraseña del usuario en la base de datos
        const {error: updateerror} = await actualizar(
            usuario.id, { contrasena: hashedcontrasena}
        );
        if (updateerror) throw updateerror;

        //  marcamos el codigo como usado
        await marcarCodigoComoUsado(codigorecupera.id);

        // respondeos al cliemte que la contraseña se cambio correctamente
        await transporte.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Contraseña actualizada correctamente',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
                    <h2 style="color: #333;"> Notificacion deContraseña Actualizada</h2>
                        <p>Hola ${usuario.nombre || 'Usuario'},</p>
                        <p>Tu contraseña ha sido actualizada correctamente.</p>
                    <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #39a900; margin: 20px 0;">
                        <p style="margin: 0; font-size: 14px; color: #555;">
                        Si no solicitaste este cambio, por favor contacta con nuestro equipo de soporte.</p>
                    </div>
                        <p style="color: #555; font-size: 14px; margin-top: 30px;">
                        Gracias</p>
                        <p>El equipo de soporte</p>
                </div>
            `
        });
        return res.status(200).json({message: 'contraseña actualizada'});

    } catch (error){
        console.error('error en verifycode:', error);
        return res.status(500).json({error: 'error al procesar la solicitud'});
    }
};
