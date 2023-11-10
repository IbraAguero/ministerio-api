import { z } from 'zod';

export const stateSchema = z.object({
  name: z.string({ required_error: 'El nombre es requerido' }),
  color: z.string().optional(),
});
