import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { register, login, getProfile, auth, addProjectAccess } from '../controller/authController';
import rateLimit from 'express-rate-limit';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many requests, please try again later." },
});


router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/profile', authenticate, getProfile);
router.get('/authenticate', authenticate, auth);
router.post('/addProjectAccess', authenticate, addProjectAccess);

export default router;
