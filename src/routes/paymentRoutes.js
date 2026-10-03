import { Router } from 'express';
import { paymentController } from '../controllers/paymentController.js';

const router = Router();

/**
 * Razorpay Standard Web Checkout Routes
 *
 * STEP 1: Create Order
 * POST /api/create-order (or /api/payment/create-order)
 * Request: { amount (paise), currency, receipt, notes }
 * Response: { order_id, amount, currency, ... }
 *
 * STEP 3: Verify Payment Signature
 * POST /api/verify-payment (or /api/payment/verify-payment)
 * Request: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * Response: { success: true, verified: true, payment_id, order_id }
 *
 * Public Key Endpoint:
 * GET /api/payment/key-id (or /api/payment/key)
 */

router.post('/create-order', paymentController.createOrder);
router.post('/verify-payment', paymentController.verifyPayment);
router.get('/key-id', paymentController.getKeyId);
router.get('/key', paymentController.getKeyId);

export default router;
