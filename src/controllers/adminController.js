import { adminService } from '../services/adminService.js';
import { successResponse } from '../utils/responseHandler.js';

export const adminController = {
  getDashboard: async (req, res, next) => {
    try {
      const stats = await adminService.getDashboardMetrics();
      return successResponse(res, stats);
    } catch (err) {
      next(err);
    }
  },

  getOrders: async (req, res, next) => {
    try {
      const orders = await adminService.getAllOrders(req.query);
      return successResponse(res, { orders });
    } catch (err) {
      next(err);
    }
  },

  updateOrderStatus: async (req, res, next) => {
    try {
      const updated = await adminService.updateOrderStatus(req.params.id, req.body.status);
      return successResponse(res, { order: updated }, 'Order trajectory status updated');
    } catch (err) {
      next(err);
    }
  },

  getUsers: async (req, res, next) => {
    try {
      const users = await adminService.getAllUsers();
      return successResponse(res, { users });
    } catch (err) {
      next(err);
    }
  },
};
