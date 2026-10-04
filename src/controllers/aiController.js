import { aiConciergeService } from '../services/aiConciergeService.js';
import { successResponse } from '../utils/responseHandler.js';

export const aiController = {
  /**
   * 24/7 AI Concierge Chat Endpoint
   */
  chat: async (req, res, next) => {
    try {
      const { message, context } = req.body;
      const response = await aiConciergeService.handleChat(message, context);
      return successResponse(res, response);
    } catch (err) {
      next(err);
    }
  },
};
