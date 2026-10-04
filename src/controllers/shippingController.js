import { shippingService } from '../services/shippingService.js';
import { orderService } from '../services/orderService.js';
import { db } from '../config/db.js';
import { successResponse } from '../utils/responseHandler.js';

export const shippingController = {
  /**
   * 1-Click / Automated Shipment creation
   */
  createShipment: async (req, res, next) => {
    try {
      const { orderId, courier, deliveryDays } = req.body;
      const order = db.orders.find((o) => o.id === orderId) || {
        id: orderId || `ORD-${Date.now().toString(36).toUpperCase()}`,
        customer: req.body.customer || 'Valued Patron',
        total: req.body.total || 25000,
        shippingAddress: req.body.shippingAddress || {},
      };

      const shipment = await shippingService.createShipment(order, { courier, deliveryDays });
      return successResponse(res, { shipment }, '3PL shipment manifested and AWB assigned successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Track Shipment by Order ID or AWB Code
   */
  trackShipment: async (req, res, next) => {
    try {
      const { idOrAwb } = req.params;
      const tracking = await shippingService.trackShipment(idOrAwb);
      return successResponse(res, { tracking }, 'Live tracking timeline retrieved');
    } catch (err) {
      next(err);
    }
  },

  /**
   * Check Pincode Delivery ETA & Serviceability
   */
  checkServiceability: async (req, res, next) => {
    try {
      const { pincode } = req.body;
      const result = await shippingService.checkServiceability(pincode);
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Render Printable 4x6" Shipping Label
   */
  getShippingLabel: async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const labelHTML = shippingService.generateShippingLabelHTML(orderId);
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(labelHTML);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Create Delhivery Reverse Courier Pickup for Customer Return
   */
  createReversePickup: async (req, res, next) => {
    try {
      const { orderId, returnTicket } = req.body;
      const order = db.orders.find((o) => o.id === orderId) || {
        id: orderId || `ORD-${Date.now().toString(36).toUpperCase()}`,
        customer: req.body.customer || 'Valued Patron',
        total: req.body.total || 18500,
        shippingAddress: req.body.shippingAddress || {},
      };

      const reverseShipment = await shippingService.createReversePickup(order, returnTicket);
      return successResponse(res, { reverseShipment }, 'Delhivery reverse courier pickup scheduled successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  /**
   * 3PL Webhook Listener for real-time transit status updates
   */
  handleWebhook: async (req, res, next) => {
    try {
      const result = await shippingService.handleWebhook(req.body);
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
};

