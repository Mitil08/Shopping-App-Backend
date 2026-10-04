import { Router } from 'express';
import { shippingController } from '../controllers/shippingController.js';

const router = Router();

// Public / Patron routes
router.get('/track/:idOrAwb', shippingController.trackShipment);
router.post('/serviceability', shippingController.checkServiceability);
router.get('/label/:orderId', shippingController.getShippingLabel);

// 3PL Carrier Webhook Listener (e.g., Shiprocket / Delhivery callbacks)
router.post('/webhook', shippingController.handleWebhook);

// Admin & Automated Dispatch endpoint
router.post('/create-shipment', shippingController.createShipment);
router.post('/create-reverse-pickup', shippingController.createReversePickup);

export default router;
