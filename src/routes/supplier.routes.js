import { Router } from 'express';
import {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from '../controllers/supplier.controller.js';
import { stateSchema } from '../schemas/state.schema.js';
import verifyJWT from '../middleware/verifyJWT.js';
import { validateSchema } from '../middleware/validatorSchema.js';
import { supplierSchema } from '../Schemas/supplier.schema.js';

const router = Router();

router.use(verifyJWT);

router.get('/proveedores', getSuppliers);
router.get('/proveedores/:id', getSupplier);
router.post('/proveedores', validateSchema(supplierSchema), createSupplier);
router.put(
  '/proveedores/:id',
  validateSchema(supplierSchema.partial()),
  updateSupplier
);
router.delete('/proveedores/:id', deleteSupplier);

export default router;
