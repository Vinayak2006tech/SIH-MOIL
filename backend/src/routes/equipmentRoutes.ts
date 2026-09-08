import { Router } from 'express';
import {
  getEquipmentList,
  createEquipment,
  updateEquipment,
  deleteEquipment
} from '../controllers/equipmentController';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', getEquipmentList);
router.post('/', authenticateJWT, requireRole(['ADMIN', 'MINE_PLANNER']), createEquipment);
router.put('/:code', authenticateJWT, requireRole(['ADMIN', 'MINE_PLANNER']), updateEquipment);
router.delete('/:code', authenticateJWT, requireRole(['ADMIN']), deleteEquipment);

export default router;
