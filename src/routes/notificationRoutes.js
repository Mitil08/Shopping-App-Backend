import { Router } from 'express';
import { whatsappNotificationService } from '../services/whatsappNotificationService.js';
import { invoiceService } from '../services/invoiceService.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { db } from '../config/db.js';

const router = Router();

/**
 * POST /api/notifications/whatsapp/test
 * Test dispatching a simulated or live WhatsApp order notification
 */
router.post('/whatsapp/test', async (req, res, next) => {
  try {
    const { phone, orderId, customName } = req.body;
    if (!phone) {
      return errorResponse(res, 'Phone number is required for WhatsApp dispatch.', 400);
    }

    // Find order or create a dummy luxury order object
    let order = db.orders.find((o) => o.id === orderId);
    if (!order) {
      order = {
        id: orderId || `ORD-${Date.now().toString(36).toUpperCase()}-7788`,
        customer: customName || 'Connoisseur Client',
        total: 34500,
        items: [
          { name: 'The Atelier Oversized Wool Coat', quantity: 1, price: 24500, size: 'M', color: 'Charcoal' },
          { name: 'Tuscan Leather Tote', quantity: 1, price: 10000, size: 'One Size', color: 'Cognac' }
        ],
        shippingAddress: { phone }
      };
    }

    const result = await whatsappNotificationService.sendOrderConfirmation(order, phone);
    return successResponse(res, {
      result,
      template: whatsappNotificationService.generateOrderConfirmationTemplate(order)
    }, 'WhatsApp notification processed successfully.');
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/notifications/invoice/:orderId
 * Returns the rendered luxury HTML printable invoice with QR authenticity stamp
 */
router.get('/invoice/:orderId', (req, res) => {
  const { orderId } = req.params;
  let order = db.orders.find((o) => o.id === orderId);
  if (!order) {
    order = {
      id: orderId,
      customer: 'Siddharth Rao',
      email: 'siddharth.rao@connoisseur.in',
      total: 48900,
      items: [
        { name: 'Atelier Double-Breasted Wool Coat', quantity: 1, price: 34500, size: 'L', color: 'Charcoal Noir' },
        { name: 'Sculpted Minimalist Leather Tote', quantity: 1, price: 14400, size: 'One Size', color: 'Cognac Saddle' }
      ],
      shippingAddress: {
        name: 'Siddharth Rao',
        address: 'Bungalow 7, Altamount Road',
        apartment: 'Penthouse B',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400026',
        country: 'India',
        phone: '+91 98314 42051'
      },
      createdAt: new Date().toISOString()
    };
  }

  const html = invoiceService.generateHtmlInvoice(order);
  res.setHeader('Content-Type', 'text/html');
  return res.send(html);
});

/**
 * POST /api/notifications/invoice/email
 * Triggers automated email delivery of the tax invoice
 */
router.post('/invoice/email', async (req, res, next) => {
  try {
    const { orderId, email } = req.body;
    let order = db.orders.find((o) => o.id === orderId);
    if (!order) {
      order = {
        id: orderId || `ORD-${Date.now().toString(36).toUpperCase()}-9900`,
        customer: 'Private Client',
        total: 34500,
        email: email || 'client@elane.com',
        items: [{ name: 'Atelier Wool Coat', quantity: 1, price: 34500 }]
      };
    }

    const result = await invoiceService.sendInvoiceEmail(order, email);
    return successResponse(res, { result }, 'Tax invoice dispatched to email stream.');
  } catch (err) {
    next(err);
  }
});

export default router;
