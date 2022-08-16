import nodemailer from 'nodemailer';

const getTransport = () => { 
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    }
  });
}

interface DatosEmail {
  email: string;
  nombre: string;
  token: string;
}

export const emailRegistro = async (datos: DatosEmail) => { 
  const { email, nombre, token } = datos;
  const transport = getTransport();

  const urlConfirmacion = `${process.env.FRONTEND_URL}/confirmar/${token}`;

  await transport.sendMail({
    from: '"Uptask - Administrador de proyectos" <cuentas@uptask.com>',
    to: email,
    subject: 'Upstask - Confirma tu cuenta',
    text: 'Confirma tu cuenta para poder acceder a tu cuenta',
    html: `
      <p>Hola ${nombre}, comprueba tu cuenta en Uptask</p>
      <p>Tu cuenta ya está casi lista, solo debes confirmarla en el siguiente enlace: </p>
      <a href="${urlConfirmacion}">Confirmar cuenta</a>
      <p>Si no has solicitado una cuenta en Uptask, puedes ignorar este mensaje</p>
    `
  });
}

export const emailOlvidePassword = async (datos: DatosEmail) => { 
  const { email, nombre, token } = datos;
  const transport = getTransport();

  const urlRecuperarPassword = `${process.env.FRONTEND_URL}/olvide-password/${token}`;

  await transport.sendMail({
    from: '"Uptask - Administrador de proyectos" <cuentas@uptask.com>',
    to: email,
    subject: 'Upstask - Recuperar contraseña',
    text: 'Recupera tu contraseña para poder acceder a tu cuenta',
    html: `
      <p>Hola ${nombre}, recupera tu contraseña en Uptask</p>
      <p>Tu contraseña ya está casi lista, solo debes recuperarla en el siguiente enlace: </p>
      <a href="${urlRecuperarPassword}">Recuperar contraseña</a>
      <p>Si no has solicitado una cuenta en Uptask, puedes ignorar este mensaje</p>
    `
  });
}