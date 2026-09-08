import { Router } from 'express';
import {
  login,
  register,
  activateAccount,
  forgotPassword,
  resetPassword,
  getMe,
  logout,
  demoLogin
} from '../controllers/authController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/activate', activateAccount);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/demo-login', demoLogin);
router.get('/me', authenticateJWT, getMe);
router.post('/logout', logout);

export default router;
