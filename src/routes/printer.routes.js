import { Router } from "express";
import {
  getPrinters,
  getPrinter,
  createPrinter,
  updatePrinter,
  deletePrinter,
} from "../controllers/printer.controller.js";
import { validateSchema } from "../middleware/validatorSchema.js";
import verifyJWT from "../middleware/verifyJWT.js";
import { printerSchema } from "../schemas/printer.schema.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getPrinters);
router.get("/:id", getPrinter);

router.post("/", validateSchema(printerSchema), createPrinter);
router.put("/:id", validateSchema(printerSchema.partial()), updatePrinter);
router.delete("/:id", deletePrinter);
//router.use('/impresoras', authRequired, extractType, makerRoutes);

export default router;
