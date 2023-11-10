import rateLimit from 'express-rate-limit';
import { logEvents } from './logger.js';

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 20, // Limitar cada IP a 5 solicitudes de inicio de sesión por `window` por minuto
  message: {
    message:
      'Demasiados intentos de inicio de sesión desde esta IP, por favor inténtalo de nuevo después de una pausa de 60 segundos',
  },
  handler: (req, res, next, options) => {
    logEvents(
      `Demasiadas solicitudes: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      'errLog.log'
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // Devolver información sobre el límite de velocidad en las cabeceras `RateLimit-*`
  legacyHeaders: false, // Desactivar las cabeceras `X-RateLimit-*`
});

export default loginLimiter;
