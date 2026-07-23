import jwt from 'jsonwebtoken';

//verifica que exista un token valido (usuario autenticado)
export const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // formato : "Bearer <token>"

    if(!token) {
        return res.status(401).json({error: 'Token no proporcionado, por favor inicie sesion'});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            return res.status(401).json({error: 'Token invalido o expirado'});
        }
        req.usuario = decoded;
        next();
    });
};

//solo deja  pasar si el usuario tiene rol admin (panel admin)
export const verificarAdmin = (req, res, next) => {
    if (req.usuario?.rol !== 'admin'){
        return res.status(403).json({ error: 'No tienes permiso de administrador'});
    }
    next();
};