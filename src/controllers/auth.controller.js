import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';

// @desc Login
// @route POST /auth
// @access Public
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Todos los campos son obligatorios' });
  }

  const foundUser = await User.findOne({ email }).lean().exec();

  if (!foundUser) {
    return res
      .status(401)
      .json({ message: 'Los datos ingresados son incorrectos' });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match)
    return res
      .status(401)
      .json({ message: 'Los datos ingresados son incorrectos' });

  if (!foundUser.active) {
    return res
      .status(401)
      .json({ message: 'El usuario se encuentra inactivo' });
  }
  const accessToken = jwt.sign(
    {
      UserInfo: {
        name: foundUser.name,
        id: foundUser._id,
        rol: foundUser.rol,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { name: foundUser.name, id: foundUser._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  // Crear cookie segura con el token de actualización
  res.cookie('jwt', refreshToken, {
    httpOnly: true, // accesible solo por el servidor web
    secure: true, // https
    sameSite: 'None', // cookie entre sitios
    maxAge: 7 * 24 * 60 * 60 * 1000, // vencimiento de la cookie: establecido para que coincida con refreshToken
  });

  // Enviar accessToken que contiene el nombre de usuario y roles
  res.json({ accessToken });
};

// @desc Refresh
// @route GET /auth/refresh
// @access Public - porque el token de acceso ha caducado
export const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: 'No autorizado' });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Prohibido' });
      const foundUser = await User.findById(decoded.id).exec();

      if (!foundUser) return res.status(401).json({ message: 'No autorizado' });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            id: foundUser._id,
            rol: foundUser.rol,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );

      res.json({ accessToken });
    }
  );
};

// @desc Logout
// @route POST /auth/logout
// @access Public - solo para borrar la cookie si existe
export const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // Sin contenido
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.json({ message: 'Cookie eliminada' });
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.validData;

    const userFound = await User.findOne({ email });
    if (!userFound) {
      return res
        .status(400)
        .json({ message: 'El correo electronico no esta registrado' });
    }

    const tokenData = {
      email: userFound.email,
      userId: userFound._id,
    };

    const token = jwt.sign(
      { token: tokenData },
      process.env.FORGETPASSWORD_TOKEN_SECRET,
      {
        expiresIn: '30m',
      }
    );

    const forgetUrl = `http://localhost:5173/cambiar-contraseña?token=${token}`;

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Inventario - Cambiar contraseña',
      html: `<a href=${forgetUrl}>Cambiar contraseña</a>`,
    });

    return res.status(200).json({ message: 'Correo enviado exitosamente' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.validData;

    const { token } = req.headers;
    if (!token) {
      return res.status(400).json({ message: 'No autorizado' });
    }

    try {
      const isTokenValid = jwt.verify(
        token,
        process.env.FORGETPASSWORD_TOKEN_SECRET
      );

      const { token: data } = isTokenValid;
      const userFound = await User.findById(data.userId);

      if (!userFound) {
        return res.status(400).json({ message: 'No existe el usuario' });
      }

      if (newPassword !== confirmPassword) {
        return res
          .status(400)
          .json({ message: 'Las contraseñas no coinciden' });
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);

      userFound.password = passwordHash;

      await userFound.save();

      return res
        .status(200)
        .json({ message: 'La contraseña se ha cambiada correctamente' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
