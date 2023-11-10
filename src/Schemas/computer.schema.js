import { z } from "zod";
import mongoose from "mongoose";

export const computerSchema = z.object({
  nroinventario: z.string({
    required_error: "El nro de inventario es requerido",
  }),
  nroserie: z.string({
    required_error: "El nro de serie es requerido",
  }),
  motherBoard: z
    .string()
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: "Placa madre inválida (no es un ObjectId válido)",
    })
    .optional(),
  cpu: z
    .string({
      required_error: "El cpu es requerido",
    })
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: "CPU inválido (no es un ObjectId válido)",
    }),
  hdd: z
    .string({
      required_error: "El disco duro es requerido",
    })
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: "Disco duro inválido (no es un ObjectId válido)",
    }),
  ram: z
    .string({
      required_error: "La ram es requerida",
    })
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: "RAM inválida (no es un ObjectId válido)",
    }),
  graphicCard: z
    .string()
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: "Tarjeta grafica inválida (no es un ObjectId válido)",
    })
    .optional(),
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
