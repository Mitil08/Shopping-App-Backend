import { Router } from 'express';
import { aiController } from '../controllers/aiController.js';

const router = Router();

// Public 24/7 AI Concierge chat endpoint
router.post('/chat', aiController.chat);

export default router;
