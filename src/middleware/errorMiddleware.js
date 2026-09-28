import { errorResponse } from '../utils/responseHandler.js';

export const notFoundMiddleware = (req, res, next) => {
  return errorResponse(res, `Endpoint not found: ${req.method} ${req.originalUrl}`, 404);
};

export const globalErrorHandler = (err, req, res, next) => {
  console.error('Unhandled Application Exception:', err);

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'An unexpected internal error occurred.'
      : err.message || 'Internal Server Error';

  return errorResponse(res, message, statusCode);
};
