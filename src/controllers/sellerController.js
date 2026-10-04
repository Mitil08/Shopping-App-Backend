import { sellerService } from '../services/sellerService.js';
import { successResponse } from '../utils/responseHandler.js';

export const sellerController = {
  getDashboard: async (req, res, next) => {
    try {
      const data = await sellerService.getDashboardStats(req.user.id);
      return successResponse(res, data);
    } catch (err) {
      next(err);
    }
  },

  getProducts: async (req, res, next) => {
    try {
      const data = await sellerService.getSellerProducts(req.user.id);
      return successResponse(res, data);
    } catch (err) {
      next(err);
    }
  },

  getOrders: async (req, res, next) => {
    try {
      const data = await sellerService.getSellerOrders(req.user.id);
      return successResponse(res, data);
    } catch (err) {
      next(err);
    }
  },

  updateFulfillmentStatus: async (req, res, next) => {
    try {
      const { status } = req.body;
      const data = await sellerService.updateFulfillmentStatus(req.user.id, req.params.id, status);
      return successResponse(res, data, `Fulfillment status updated to ${status}`);
    } catch (err) {
      next(err);
    }
  },

  restockProduct: async (req, res, next) => {
    try {
      const { productId, variantId, quantity = 10 } = req.body;
      const { inventoryService } = await import('../services/inventoryService.js');
      const data = await inventoryService.restockProduct(productId, variantId, quantity);
      return successResponse(res, data, `Restocked +${quantity} units successfully`);
    } catch (err) {
      next(err);
    }
  },

  getSettlements: async (req, res, next) => {
    try {
      const { vendorSettlementService } = await import('../services/vendorSettlementService.js');
      const data = vendorSettlementService.getSettlements(req.user.id);
      return successResponse(res, data);
    } catch (err) {
      next(err);
    }
  },

  generateSettlement: async (req, res, next) => {
    try {
      const { vendorSettlementService } = await import('../services/vendorSettlementService.js');
      const data = await vendorSettlementService.generateSettlement(req.user.id, req.body.period);
      return successResponse(res, data, 'Settlement statement generated');
    } catch (err) {
      next(err);
    }
  },
};
