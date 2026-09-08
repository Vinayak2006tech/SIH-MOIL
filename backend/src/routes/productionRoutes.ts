import { Router } from 'express';
import {
  getProductionHistory,
  getDowntimeBreakdown,
  getCorrelationData,
  getAnnualSummary,
  getSalesHistory
} from '../controllers/productionController';

const router = Router();

router.get('/history', getProductionHistory);
router.get('/downtime-breakdown', getDowntimeBreakdown);
router.get('/correlation', getCorrelationData);
router.get('/annual', getAnnualSummary);
router.get('/sales', getSalesHistory);

export default router;
