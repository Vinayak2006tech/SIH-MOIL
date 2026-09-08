import { Router } from 'express';
import {
  getRecommendations,
  updateRecommendationStatus,
  getFeedbackLoopHistory
} from '../controllers/recommendationController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.get('/', getRecommendations);
router.get('/feedback-loop', getFeedbackLoopHistory);
router.patch('/:id/status', authenticateJWT, updateRecommendationStatus);

export default router;
