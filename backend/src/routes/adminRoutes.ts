import { Router } from 'express';
import {
  getUsers,
  getUserStats,
  approveUser,
  rejectUser,
  suspendUser,
  reactivateUser,
  updateUserRole,
  deleteUser
} from '../controllers/adminController';
import { authenticateJWT, requireAdmin } from '../middleware/auth';

const router = Router();

// Apply auth + admin guard to all admin endpoints
router.use(authenticateJWT, requireAdmin);

router.get('/users/stats', getUserStats);
router.get('/users', getUsers);
router.patch('/users/:id/approve', approveUser);
router.patch('/users/:id/reject', rejectUser);
router.patch('/users/:id/suspend', suspendUser);
router.patch('/users/:id/reactivate', reactivateUser);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;
