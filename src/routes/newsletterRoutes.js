import { Router } from 'express';
import { newsletterController } from '../controllers/newsletterController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { authLimiter } from '../middleware/rateLimitMiddleware.js';

const router = Router();

// Public subscription endpoint with rate limiter protection
router.post('/subscribe', authLimiter, newsletterController.subscribe);

// Admin-only: list all VIP clientele subscribers
router.get('/subscribers', authMiddleware, adminMiddleware, newsletterController.getAllSubscribers);

export default router;
