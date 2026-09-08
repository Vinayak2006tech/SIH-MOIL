import { Router } from 'express';
import { getShortfallRisks, simulateShortfallRisk } from '../controllers/shortfallController';

const router = Router();

router.get('/risks', getShortfallRisks);
router.post('/simulate', simulateShortfallRisk);

export default router;
