import { Router } from 'express';
import { generateExecutiveReport } from '../controllers/reportController';

const router = Router();

router.get('/executive', generateExecutiveReport);

export default router;
