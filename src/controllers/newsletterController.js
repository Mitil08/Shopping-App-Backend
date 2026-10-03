import { newsletterService } from '../services/newsletterService.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

export const newsletterController = {
  subscribe: async (req, res, next) => {
    try {
      const { email, preferences } = req.body;
      if (!email || !email.includes('@') || !email.includes('.')) {
        return errorResponse(res, 'A valid email address is required to join the clientele bulletin.', 400);
      }

      const result = await newsletterService.subscribe(email, preferences);
      return successResponse(res, result, result.message, 201);
    } catch (err) {
      next(err);
    }
  },

  getAllSubscribers: async (req, res, next) => {
    try {
      const subscribers = await newsletterService.getAllSubscribers();
      return successResponse(res, { subscribers, count: subscribers.length }, 'Subscribers retrieved.');
    } catch (err) {
      next(err);
    }
  },
};
