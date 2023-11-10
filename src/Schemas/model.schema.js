import { z } from 'zod';

export const modelSchema = z.object({
  name: z.string({ required_error: 'El nombre es requerido' }),
  maker: z.string({ required_error: 'El fabricante es requerido' }),
  /* type: z.enum(['monitor', 'impresora'], {
    required_error: 'El tipo es requerido',
  }), */
});

export const updateModelSchema = z.object({
  name: z.string({ required_error: 'El nombre es requerido' }),
  /* maker: z.string({ required_error: 'El fabricante es requerido' }), */
  /* type: z.enum(['monitor', 'impresora'], {
    required_error: 'El tipo es requerido',
  }), */
});
