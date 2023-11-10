import { z } from 'zod';

export const placeSchema = z.object({
  name: z.string({ required_error: 'El nombre es requerido' }),
  supervisor: z.string().optional(),
});
