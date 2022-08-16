import { Request, Response } from 'express';
import { Usuario } from '../models/Usuario';
import { generarId, generarJwt } from '../helpers';
import { emailOlvidePassword, emailRegistro } from '../services/email';

export const registrar = async (req: Request, res: Response) => {
  const { nombre, email, password } = req.body;
  const existeUsuario = await Usuario.findOne({ email });
  if (existeUsuario) {
    const error = new Error('El usuario ya existe');
    return res.status(400).json({ 
      ok: false,
      msg: error.message
    });
  }

  try {
    const usuario = new Usuario({ nombre, email, password });
    usuario.token = generarId();
    
    await usuario.save();
    await emailRegistro({ email: usuario.email, nombre: usuario.nombre, token: usuario.token });

    res.json({ msg: 'Usuario creado correctamente, revisa tu email para confirmar tu cuenta' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error al registrar usuario',
      error
    });
  }
}

export const autenticar = async (req: Request, res: Response) => { 
  const { email, password } = req.body;
  
  try {
    const usuario = await Usuario.findOne({ email });
    if(!usuario) {
      const error = new Error(`El usuario con el correo ${email} no existe`);
      return res.status(404).json({
        ok: false,
        msg: error.message
      });
    }

    if(!usuario.confirmado) {
      const error = new Error(`El usuario con el correo ${email} no ha confirmado su cuenta`);
      return res.status(403).json({
        ok: false,
        msg: error.message
      });
    }

    if(!(await usuario.comprobarPassword(password))) {
      const error = new Error('La contraseña ingresada es incorrecta');
      return res.status(401).json({
        ok: false,
        msg: error.message
      });
    }

    res.status(200).json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJwt({ _id: usuario._id })
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error al autenticar usuario',
      error
    });
  }
}

export const confirmar = async (req: Request, res: Response) => { 
  const { token } = req.params;
  try {
    const usuarioConfirmar = await Usuario.findOne({ token });
    if (!usuarioConfirmar) {
      const error = new Error('El token utilizado no es válido');
      return res.status(404).json({
        ok: false,
        msg: error.message
      });
    }

    usuarioConfirmar.confirmado = true;
    usuarioConfirmar.token = '';
    await usuarioConfirmar.save();

    res.status(200).json({
      ok: true,
      msg: 'El usuario ha sido confirmado'
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error al confirmar usuario',
      error
    });
  }
}

export const olvidePassword = async (req: Request, res: Response) => { 
  const { email } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      const error = new Error(`El usuario con el correo ${email} no existe`);
      return res.status(404).json({
        ok: false,
        msg: error.message
      });
    }

    usuario.token = generarId();
    
    await usuario.save();
    await emailOlvidePassword({ email: usuario.email, nombre: usuario.nombre, token: usuario.token });

    res.status(200).json({
      ok: true,
      msg: 'Se ha enviado un correo para restablecer la contraseña'
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error al enviar correo',
      error
    });
  }
}

export const comprobarToken = async (req: Request, res: Response) => { 
  const { token } = req.params;

  try {
    const tokenValido = await Usuario.findOne({ token });
    if (!tokenValido) {
      const error = new Error('El token utilizado no es válido');
      return res.status(404).json({
        ok: false,
        msg: error.message
      });
    }

    res.status(200).json({
      ok: true,
      msg: 'El token es válido y el usuario puede restablecer la contraseña'
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error al comprobar token',
      error
    });
  }
}

export const nuevoPassword = async (req: Request, res: Response) => { 
  const { token } = req.params;
  const { password } = req.body;

  try {
    const usuario = await Usuario.findOne({ token });
    if (!usuario) {
      const error = new Error('El token utilizado no es válido');
      return res.status(404).json({
        ok: false,
        msg: error.message
      });
    }

    usuario.password = password;
    usuario.token = '';
    await usuario.save();

    res.status(200).json({
      ok: true,
      msg: 'Se ha restablecido la contraseña correctamente'
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error al restablecer contraseña',
      error
    });
  }
}

export const perfil = async (req: Request, res: Response) => { 
  res.status(200).json(req.usuario);
}