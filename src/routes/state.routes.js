import { Router } from "express";
import {
  getStates,
  getState,
  createState,
  updateState,
  deleteState,
} from "../controllers/state.controller.js";
import { stateSchema } from "../schemas/state.schema.js";
import verifyJWT from "../middleware/verifyJWT.js";
import { validateSchema } from "../middleware/validatorSchema.js";

const router = Router();

router.use(verifyJWT);

router.get("/estados", getStates);
router.get("/estados/:id", getState);
router.post("/estados", validateSchema(stateSchema), createState);
router.put("/estados/:id", validateSchema(stateSchema.partial()), updateState);
router.delete("/estados/:id", deleteState);

export default router;
