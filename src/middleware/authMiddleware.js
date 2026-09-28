import { verifyToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/responseHandler.js';

export const authMiddleware = (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.elane_token) {
      token = req.cookies.elane_token;
    }

    if (!token) {
      return errorResponse(res, 'Authentication required. No session token provided.', 401);
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return errorResponse(res, 'Invalid or expired session. Please re-authenticate.', 401);
  }
};
