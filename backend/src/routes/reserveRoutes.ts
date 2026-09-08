import { Router } from 'express';
import { calculateReserveEstimate, getBoreholes, getOreGradeDistribution } from '../controllers/reserveController';

const router = Router();

router.post('/estimate', calculateReserveEstimate);
router.get('/boreholes', getBoreholes);
router.get('/grade-distribution', getOreGradeDistribution);

export default router;
