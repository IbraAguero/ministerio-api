import { z } from "zod";
import mongoose from "mongoose";

export const monitorSchema = z.object({
  nroinventario: z.string({
    required_error: "El nro de inventario es requerido",
  }),
  nroserie: z.string({
    required_error: "El nro de serie es requerido",
  }),
  maker: z
    .string({
      required_error: "El fabricante es requerido",
    })
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: "Fabricante inválido (no es un ObjectId válido)",
    }),
  model: z
    .string({
      required_error: "El modelo es requerido",
    })
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: "Modelo inválido (no es un ObjectId válido)",
    }),
  type: z
    .string({
      required_error: "El tipo es requerido",
    })
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: "Tipo inválido (no es un ObjectId válido)",
    }),
  place: z
    .string({
      required_error: "El lugar es requerido",
    })
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: "Lugar inválido (no es un ObjectId válido)",
    }),
  state: z
    .string({
      required_error: "El estado es requerido",
    })
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: "Estado inválido (no es un ObjectId válido)",
    }),
  supplier: z
    .string()
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: "Proveedor inválido (no es un ObjectId válido)",
    })
    .optional(),
  order: z.string({ required_error: "El nro de remito es requerido" }),
  mandated: z.string().optional(),
  comment: z.string().optional(),
});
