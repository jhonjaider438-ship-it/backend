import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

export const enviarconfirmacionpedido = async (email, nombre, pedidoid, total) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `👍 Pedido confirmado - Heladería Minions #${pedidoid}`,
        html: `
        <h2>👍 Pedido Confirmado</h2>
        <p>Hola ${nombre || 'Usuario'},</p>
        <p>Tu pedido ha sido confirmado, gracias por tu compra.</p>
        <p>Número de pedido: #${pedidoid}</p>
        <p>Total: $${total.toLocaleString('es-CO')}</p>
        <p>El equipo de soporte.</p>
        <p>Pronto nos pondremos en contacto contigo sobre tu pedido.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Correo de confirmación enviado correctamente' };
    } catch (error) {
        console.error('Error enviando el email de confirmación:', error);
        return { success: false, error: error.message };
    }
};