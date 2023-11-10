import {
  login,
  logout,
  refresh,
  forgetPassword,
  changePassword,
} from '../controllers/auth.controller.js';
import loginLimiter from '../middleware/loginLimiter.js';
import { Router } from 'express';
import { validateSchema } from '../middleware/validatorSchema.js';
import {
  changePasswordSchemma,
  forgetPasswordSchema,
} from '../Schemas/auth.schema.js';

const router = Router();

router.post('/', loginLimiter, login);

router.get('/refresh', refresh);

router.post('/logout', logout);

router.post(
  '/forgetpassword',
  validateSchema(forgetPasswordSchema),
  forgetPassword
);
router.post(
  '/changepassword',
  validateSchema(changePasswordSchemma),
  changePassword
);

export default router;
