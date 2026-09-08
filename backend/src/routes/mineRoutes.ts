import { Router } from 'express';
import {
  getAllMines,
  getMineById,
  getMineZones,
  getDashboardSummary,
  getFacilities,
  getExplorationBlocks
} from '../controllers/mineController';

const router = Router();

router.get('/', getAllMines);
router.get('/summary', getDashboardSummary);
router.get('/zones', getMineZones);
router.get('/facilities', getFacilities);
router.get('/exploration-blocks', getExplorationBlocks);
router.get('/:mineId', getMineById);

export default router;
