import { Router } from 'express';
//import { validateSchema } from '../middleware/validatorSchema.js';
//import { printerSchema } from '../schemas/printer.schema.js';
import { createCPU, getCPUs } from '../controllers/cpu.controller.js';
import verifyJWT from '../middleware/verifyJWT.js';

const router = Router();

router.use(verifyJWT);

router.get('/', getCPUs);
router.post('/', createCPU);
//router.get('/:id', getComputer);
//router.put('/:id', updateComputer);
//router.delete('/:id', deleteComputer);

//router.use('/impresoras', authRequired, extractType, makerRoutes);

export default router;
