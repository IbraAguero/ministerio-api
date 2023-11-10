import { Router } from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import { validateSchema } from "../middleware/validatorSchema.js";
import { networkSchema } from "../Schemas/network.schema.js";
import {
  createNetwork,
  deleteNetwork,
  getNetwork,
  getNetworks,
  updateNetwork,
} from "../controllers/network.controller.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getNetworks);
router.get("/:id", getNetwork);
router.post("/", validateSchema(networkSchema), createNetwork);
router.put("/:id", validateSchema(networkSchema.partial()), updateNetwork);
router.delete("/:id", deleteNetwork);

export default router;
