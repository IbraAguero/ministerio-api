import { Router } from 'express';
import {
  getMakers,
  getMaker,
  createMaker,
  updateMaker,
  deleteMaker,
} from '../controllers/maker.controller.js';
import verifyJWT from '../middleware/verifyJWT.js';
import { makerSchema } from '../Schemas/maker.schema.js';
import { validateSchema } from '../middleware/validatorSchema.js';

const router = Router();

router.use(verifyJWT);

router.get('/:type/fabricantes', getMakers);
router.get('/:type/fabricantes/:id', getMaker);
router.post('/:type/fabricantes', validateSchema(makerSchema), createMaker);
router.put(
  '/:type/fabricantes/:id',
  validateSchema(makerSchema.partial()),
  updateMaker
);
router.delete('/:type/fabricantes/:id', deleteMaker);

export default router;
