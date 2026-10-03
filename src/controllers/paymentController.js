import crypto from 'crypto';
import razorpay from '../config/razorpay.js';
import { orderService } from '../services/orderService.js';
import dotenv from 'dotenv';

dotenv.config();

export const paymentController = {
  /**
   * STEP 1: BACKEND - Create Order
   * Endpoint: POST /api/create-order or POST /api/payment/create-order
   * Request: { amount (paise), currency, receipt }
   * Return: { order_id, amount, currency }
   * Minimum amount: 100 paise
   */
  createOrder: async (req, res) => {
    try {
      if (!razorpay) {
        return res.status(500).json({
          success: false,
          message: 'Razorpay SDK is not initialized. Please verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env',
        });
      }

      const { amount, currency = 'INR', receipt, notes } = req.body;

      // Validate amount >= 100 paise (₹1.00)
      const numAmount = Math.round(Number(amount));
      if (!numAmount || isNaN(numAmount) || numAmount < 100) {
        return res.status(400).json({
          success: false,
          message: 'Invalid amount. Minimum transaction amount is 100 paise (₹1.00).',
          receivedAmount: amount,
        });
      }

      const orderOptions = {
        amount: numAmount,
        currency: (currency || 'INR').toUpperCase(),
        receipt: receipt || `rcpt_${Date.now().toString(36)}`,
        notes: notes || {},
      };

      const razorpayOrder = await razorpay.orders.create(orderOptions);

      // Return standardized response satisfying { order_id, amount, currency }
      return res.status(200).json({
        success: true,
        order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
        status: razorpayOrder.status,
        key_id: process.env.RAZORPAY_KEY_ID,
        data: {
          order_id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          receipt: razorpayOrder.receipt,
          status: razorpayOrder.status,
        },
      });
    } catch (err) {
      console.error('Razorpay create-order error:', err);

      // Handle auth failure (401)
      if (
        err.statusCode === 401 ||
        err.status === 401 ||
        (err.error && err.error.code === 'UNAUTHORIZED_ERROR')
      ) {
        return res.status(401).json({
          success: false,
          message: 'Razorpay authentication failed. Check your API Key ID and Secret.',
          error: err.error || err.message,
        });
      }

      // Handle Razorpay API errors (500)
      return res.status(500).json({
        success: false,
        message: err.message || 'Razorpay order creation failed.',
        error: err.error || err.message,
      });
    }
  },

  /**
   * STEP 3: BACKEND - Verify Signature
   * Endpoint: POST /api/verify-payment or POST /api/payment/verify-payment
   * Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
   * Compare generated signature with razorpay_signature
   * Return success only if signatures match
   */
  verifyPayment: async (req, res) => {
    try {
      const order_id = req.body.razorpay_order_id || req.body.order_id;
      const payment_id = req.body.razorpay_payment_id || req.body.payment_id;
      const signature = req.body.razorpay_signature || req.body.signature;

      // Validate missing fields -> return 400
      if (!order_id || !payment_id || !signature) {
        return res.status(400).json({
          success: false,
          verified: false,
          message: 'Missing required fields for signature verification. Required: order_id, payment_id, signature.',
          missing: {
            order_id: !order_id,
            payment_id: !payment_id,
            signature: !signature,
          },
        });
      }

      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret) {
        return res.status(500).json({
          success: false,
          verified: false,
          message: 'RAZORPAY_KEY_SECRET is not configured on server.',
        });
      }

      // Compute HMAC SHA256 of order_id + "|" + payment_id
      const bodyToSign = `${order_id}|${payment_id}`;
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(bodyToSign)
        .digest('hex');

      // Signature mismatch -> return 400, do NOT mark as paid
      if (expectedSignature !== signature) {
        return res.status(400).json({
          success: false,
          verified: false,
          message: 'Payment verification failed: Signature mismatch. Transaction is unverified and NOT marked as paid.',
        });
      }

      // Signatures match -> return success
      return res.status(200).json({
        success: true,
        verified: true,
        message: 'Payment signature verified successfully.',
        payment_id,
        order_id,
        data: {
          payment_id,
          order_id,
          verified: true,
        },
      });
    } catch (err) {
      console.error('Razorpay verify-payment error:', err);
      return res.status(500).json({
        success: false,
        verified: false,
        message: 'Internal server error during signature verification.',
        error: err.message,
      });
    }
  },

  /**
   * Public helper to retrieve frontend Key ID without exposing Secret
   */
  getKeyId: (req, res) => {
    return res.status(200).json({
      success: true,
      key_id: process.env.RAZORPAY_KEY_ID || '',
    });
  },

  /**
   * STEP 4: BACKEND - Razorpay Webhook Handler
   * Endpoint: POST /api/payment/webhook (or POST /api/webhook/razorpay)
   * Header: x-razorpay-signature
   * Secret: RAZORPAY_WEBHOOK_SECRET (falls back to RAZORPAY_KEY_SECRET)
   * Events: payment.captured, order.paid, payment.failed
   */
  handleWebhook: async (req, res) => {
    try {
      const webhookSignature = req.headers['x-razorpay-signature'];
      if (!webhookSignature) {
        return res.status(400).json({
          success: false,
          message: 'Missing x-razorpay-signature header in webhook delivery.',
        });
      }

      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
      if (!webhookSecret) {
        console.error('Neither RAZORPAY_WEBHOOK_SECRET nor RAZORPAY_KEY_SECRET is configured.');
        return res.status(500).json({
          success: false,
          message: 'Webhook secret is not configured on the server.',
        });
      }

      // Compute HMAC-SHA256 signature using the raw body buffer if available
      const rawPayload = req.rawBody ? req.rawBody.toString('utf8') : JSON.stringify(req.body);
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawPayload)
        .digest('hex');

      if (expectedSignature !== webhookSignature) {
        console.warn('⚠️ Razorpay webhook signature validation failed. Payload rejected.');
        return res.status(400).json({
          success: false,
          message: 'Invalid webhook signature. Security verification failed.',
        });
      }

      const event = req.body?.event;
      const payload = req.body?.payload;

      console.log(`[Razorpay Webhook Verified]: Event "${event}" received.`);

      switch (event) {
        case 'payment.captured': {
          const paymentEntity = payload?.payment?.entity;
          const razorpayOrderId = paymentEntity?.order_id;
          const paymentId = paymentEntity?.id;

          if (razorpayOrderId) {
            await orderService.markOrderPaidByRazorpay(razorpayOrderId, paymentId, paymentEntity);
            console.log(`✓ Webhook: Order ${razorpayOrderId} confirmed & paid via payment ${paymentId}`);
          }
          break;
        }

        case 'order.paid': {
          const orderEntity = payload?.order?.entity;
          const razorpayOrderId = orderEntity?.id;
          const paymentEntity = payload?.payment?.entity;
          const paymentId = paymentEntity?.id || `PAY-${Date.now()}`;

          if (razorpayOrderId) {
            await orderService.markOrderPaidByRazorpay(razorpayOrderId, paymentId, orderEntity);
            console.log(`✓ Webhook: Order ${razorpayOrderId} marked as PAID`);
          }
          break;
        }

        case 'payment.failed': {
          const paymentEntity = payload?.payment?.entity;
          const razorpayOrderId = paymentEntity?.order_id;
          const reason = paymentEntity?.error_description || 'Transaction declined by issuer bank';

          if (razorpayOrderId) {
            await orderService.markOrderFailedByRazorpay(razorpayOrderId, reason);
            console.warn(`⚠️ Webhook: Order ${razorpayOrderId} payment failed: ${reason}`);
          }
          break;
        }

        default:
          console.log(`[Razorpay Webhook]: Ignored non-actionable event "${event}"`);
      }

      // Acknowledge receipt with 200 OK so Razorpay ceases webhook retries
      return res.status(200).json({ status: 'ok', eventReceived: event });
    } catch (err) {
      console.error('Unhandled Razorpay webhook processing error:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error processing webhook event',
        error: err.message,
      });
    }
  },
};
