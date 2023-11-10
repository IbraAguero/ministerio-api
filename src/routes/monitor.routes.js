import { Router } from "express";

import { validateSchema } from "../middleware/validatorSchema.js";
import verifyJWT from "../middleware/verifyJWT.js";
import { monitorSchema } from "../Schemas/monitor.schema.js";
import {
  createMonitor,
  deleteMonitor,
  getMonitor,
  getMonitors,
  updateMonitor,
} from "../controllers/monitor.controller.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getMonitors);
router.get("/:id", getMonitor);
router.post("/", validateSchema(monitorSchema), createMonitor);
router.put("/:id", validateSchema(monitorSchema.partial()), updateMonitor);
router.delete("/:id", deleteMonitor);
//router.use('/impresoras', authRequired, extractType, makerRoutes);

export default router;
