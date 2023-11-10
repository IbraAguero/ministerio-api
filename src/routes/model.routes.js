import { Router } from 'express';
import {
  getModels,
  getModel,
  getModelByMaker,
  createModel,
  updateModel,
  deleteModel,
  getModelOrByMaker,
} from '../controllers/model.controller.js';
import verifyJWT from '../middleware/verifyJWT.js';
import { modelSchema, updateModelSchema } from '../Schemas/model.schema.js';
import { validateSchema } from '../middleware/validatorSchema.js';

const router = Router();

router.use(verifyJWT);

router.get('/:type/modelos', getModels);
router.get('/:type/modelos/:id', getModelOrByMaker);
//router.get('/:type/modelos/:id', authRequired, getModel);
//router.get('/:type/modelos/:maker', /* authRequired, */ getModelByMaker);
router.post('/:type/modelos', validateSchema(modelSchema), createModel);
router.put(
  '/:type/modelos/:id',
  validateSchema(updateModelSchema.partial()),
  updateModel
);
router.delete('/:type/modelos/:id', deleteModel);

export default router;
