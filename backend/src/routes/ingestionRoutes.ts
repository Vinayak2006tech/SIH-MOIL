import { Router } from 'express';
import {
  uploadDrillingLogsCsv,
  uploadProductionRecordsCsv,
  triggerSatelliteSync
} from '../controllers/ingestionController';
import { upload } from '../services/csvParser';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

router.post(
  '/drilling-csv',
  authenticateJWT,
  requireRole(['ADMIN', 'MINE_PLANNER', 'VIEWER']),
  upload.single('file'),
  uploadDrillingLogsCsv
);

router.post(
  '/production-csv',
  authenticateJWT,
  requireRole(['ADMIN', 'MINE_PLANNER', 'VIEWER']),
  upload.single('file'),
  uploadProductionRecordsCsv
);

router.post(
  '/satellite-sync',
  authenticateJWT,
  requireRole(['ADMIN', 'MINE_PLANNER', 'VIEWER']),
  triggerSatelliteSync
);

export default router;
