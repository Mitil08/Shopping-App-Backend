import { errorResponse } from '../utils/responseHandler.js';

/**
 * Allows platform administrators and verified merchant sellers
 */
export const sellerOrAdminMiddleware = (req, res, next) => {
  if (!req.user || (req.user.role !== 'seller' && req.user.role !== 'admin')) {
    return errorResponse(res, 'Access denied. Seller or administrative authorization required.', 403);
  }
  next();
};
