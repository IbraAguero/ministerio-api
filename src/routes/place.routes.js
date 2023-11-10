import { Router } from 'express';
import {
  getPlaces,
  getPlace,
  createPlace,
  updatePlace,
  deletePlace,
} from '../controllers/place.controller.js';
import verifyJWT from '../middleware/verifyJWT.js';
import { placeSchema } from '../Schemas/place.schema.js';
import { validateSchema } from '../middleware/validatorSchema.js';

const router = Router();

router.use(verifyJWT);

router.get('/lugares', getPlaces);
router.get('/lugares/:id', getPlace);
router.post('/lugares', validateSchema(placeSchema), createPlace);
router.put('/lugares/:id', validateSchema(placeSchema.partial()), updatePlace);
router.delete('/lugares/:id', deletePlace);

export default router;
