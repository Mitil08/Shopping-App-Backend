import { orderService } from '../services/orderService.js';
import { successResponse } from '../utils/responseHandler.js';

export const orderController = {
  createOrder: async (req, res, next) => {
    try {
      const userId = req.user?.id || null;
      const order = await orderService.createOrder(userId, req.body);
      return successResponse(res, { order }, 'Acquisition order confirmed', 201);
    } catch (err) {
      next(err);
    }
  },

  getMyOrders: async (req, res, next) => {
    try {
      const orders = await orderService.getUserOrders(req.user.id);
      return successResponse(res, { orders });
    } catch (err) {
      next(err);
    }
  },

  getOrderById: async (req, res, next) => {
    try {
      const order = await orderService.getOrderById(req.params.id, req.user?.id);
      return successResponse(res, { order });
    } catch (err) {
      next(err);
    }
  },
};
