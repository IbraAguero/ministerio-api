import { Router } from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import { validateSchema } from "../middleware/validatorSchema.js";
import { peripheralSchema } from "../Schemas/peripheral.schema.js";
import {
  createPeripheral,
  deletePeripheral,
  getPeripheral,
  getPeripherals,
  updatePeripheral,
} from "../controllers/peripheral.controller.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getPeripherals);
router.get("/:id", getPeripheral);
router.post("/", validateSchema(peripheralSchema), createPeripheral);
router.put(
  "/:id",
  validateSchema(peripheralSchema.partial()),
  updatePeripheral
);
router.delete("/:id", deletePeripheral);

export default router;
