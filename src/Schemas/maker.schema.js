import { z } from 'zod';

export const makerSchema = z.object({
  name: z.string({ required_error: 'El nombre es requerido' }),
  /*   type: z.enum(['monitor', 'impresora'], {
    required_error: 'El tipo es requerido',
  }), */
});
