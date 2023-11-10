import { z } from 'zod';

export const forgetPasswordSchema = z.object({
  email: z
    .string({ required_error: 'El email es requerido' })
    .email({ message: 'El email no se encuentra registrado' }),
});

export const changePasswordSchemma = z.object({
  newPassword: z
    .string({ required_error: 'Campo requerido' })
    .min(8, { message: 'La contraseña debe tener almenos 8 caracteres' }),
  confirmPassword: z
    .string({ required_error: 'Campo requerido' })
    .superRefine(({ confirmPassword, newPassword }, ctx) => {
      if (confirmPassword !== newPassword) {
        ctx.addIssue({
          code: 'custom',
          message: 'Las contraseñas no coinciden',
        });
      }
    }),
});
