import { cartService } from '../services/cartService.js';
import { successResponse } from '../utils/responseHandler.js';

export const cartController = {
  getCart: async (req, res, next) => {
    try {
      const data = await cartService.getCart(req.user.id);
      return successResponse(res, data);
    } catch (err) {
      next(err);
    }
  },

  addItem: async (req, res, next) => {
    try {
      const data = await cartService.addItem(req.user.id, req.body);
      return successResponse(res, data, 'Item added to bag');
    } catch (err) {
      next(err);
    }
  },

  updateItem: async (req, res, next) => {
    try {
      const data = await cartService.updateItem(req.user.id, req.params.itemId, req.body.quantity);
      return successResponse(res, data, 'Bag quantity updated');
    } catch (err) {
      next(err);
    }
  },

  removeItem: async (req, res, next) => {
    try {
      const data = await cartService.removeItem(req.user.id, req.params.itemId);
      return successResponse(res, data, 'Item removed from bag');
    } catch (err) {
      next(err);
    }
  },

  syncCart: async (req, res, next) => {
    try {
      const data = await cartService.syncCart(req.user.id, req.body.items);
      return successResponse(res, data, 'Guest bag merged successfully');
    } catch (err) {
      next(err);
    }
  },

  clearCart: async (req, res, next) => {
    try {
      const data = await cartService.clearCart(req.user.id);
      return successResponse(res, data, 'Bag cleared');
    } catch (err) {
      next(err);
    }
  },
};
