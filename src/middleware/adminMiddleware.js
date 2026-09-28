import { errorResponse } from '../utils/responseHandler.js';

export const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return errorResponse(res, 'Access denied. Administrative authorization required.', 403);
  }
  next();
};
