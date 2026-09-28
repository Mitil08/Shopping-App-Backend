import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/responseHandler.js';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));
    return errorResponse(res, 'Validation failed for request parameters', 400, formatted);
  }
  next();
};
