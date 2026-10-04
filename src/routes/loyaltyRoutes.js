import { Router } from 'express';
import { loyaltyController } from '../controllers/loyaltyController.js';

const router = Router();

// Submit a review
router.post('/review', loyaltyController.submitReview);

// Get product reviews & ratings
router.get('/reviews/:productId', loyaltyController.getProductReviews);

// Get user loyalty points
router.get('/points/:userId?', loyaltyController.getUserPoints);

// Trigger review invite email/WhatsApp
router.post('/invite/:orderId', loyaltyController.triggerReviewInvite);

export default router;
