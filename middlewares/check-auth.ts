import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuario';

interface UserRequest {
  _id: any;
  nombre: string;
  email: string;
}

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => { 
  const bearerToken = req.headers.authorization ?? '';
  if(!bearerToken || !bearerToken.startsWith('Bearer')) {
    const error = new Error('No se encontró el token de autenticación');
    return res.status(401).json({
      ok: false,
      msg: error.message
    });
  }

  try {
    const token = bearerToken.replace('Bearer ', '');
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { _id: string };
    req.usuario = await Usuario.findById(decodedToken._id).select("-password -confirmado -token -createdAt -updatedAt -__v") as UserRequest;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error al comprobar el token de autenticación',
      error
    });
  }
}