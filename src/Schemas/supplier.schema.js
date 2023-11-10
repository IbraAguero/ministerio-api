import { z } from 'zod';

export const supplierSchema = z.object({
  name: z.string({ required_error: 'El nombre es requerido' }),
});
