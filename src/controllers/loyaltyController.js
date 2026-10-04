import { loyaltyReviewService } from '../services/loyaltyReviewService.js';
import { db } from '../config/db.js';
import { successResponse } from '../utils/responseHandler.js';

export const loyaltyController = {
  /**
   * Submit a verified review & claim 500 points
   */
  submitReview: async (req, res, next) => {
    try {
      const result = await loyaltyReviewService.submitReview(req.body);
      return successResponse(res, result, 'Review published and 500 Loyalty Points credited', 201);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get Product Reviews & Ratings Breakdown
   */
  getProductReviews: async (req, res, next) => {
    try {
      const { productId } = req.params;
      const data = await loyaltyReviewService.getProductReviews(productId);
      return successResponse(res, data);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get User Loyalty Points & VIP Perks
   */
  getUserPoints: async (req, res, next) => {
    try {
      const userId = req.params.userId || req.user?.id || 'usr-guest';
      const data = await loyaltyReviewService.getUserPoints(userId);
      return successResponse(res, data);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Automated / Admin trigger to dispatch post-delivery review invite
   */
  triggerReviewInvite: async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const order = db.orders.find((o) => o.id === orderId) || {
        id: orderId,
        customer: req.body.customer || 'Valued Patron',
        email: req.body.email || 'customer@domain.com',
        phone: req.body.phone || '+919876543210',
      };

      const result = await loyaltyReviewService.scheduleDeliveryReviewInvite(order);
      return successResponse(res, result, 'Automated post-delivery review invitation dispatched');
    } catch (err) {
      next(err);
    }
  },
};
