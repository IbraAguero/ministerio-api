import { z } from 'zod';

export const typeSchema = z.object({
  name: z.string({ required_error: 'El nombre es requerido' }),
});
