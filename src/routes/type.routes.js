import { Router } from 'express';
import {
  getTypes,
  createType,
  deleteType,
  updateType,
  getType,
} from '../controllers/type.controller.js';
import verifyJWT from '../middleware/verifyJWT.js';
import { validateSchema } from '../middleware/validatorSchema.js';
import { typeSchema } from '../Schemas/type.schema.js';

const router = Router();

router.use(verifyJWT);

router.get('/:type/tipos', getTypes);
router.get('/:type/tipos/:id', getType);
router.post('/:type/tipos', validateSchema(typeSchema), createType);
router.put(
  '/:type/tipos/:id',
  validateSchema(typeSchema.partial()),
  updateType
);
router.delete('/:type/tipos/:id', deleteType);

export default router;
