import { Router } from 'express';
import { orderController } from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { orderValidator } from '../validators/productValidator.js';
import { validateRequest } from '../middleware/validationMiddleware.js';

const router = Router();

// Guest and authenticated users can create orders
router.post('/', orderValidator, validateRequest, (req, res, next) => {
  // Optional auth: if token present, attach req.user, else proceed as guest order
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return authMiddleware(req, res, () => orderController.createOrder(req, res, next));
  }
  return orderController.createOrder(req, res, next);
});

// Authenticated users order history
router.get('/', authMiddleware, orderController.getMyOrders);
router.get('/:id/invoice', orderController.getInvoice);
router.get('/:id', (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return authMiddleware(req, res, () => orderController.getOrderById(req, res, next));
  }
  return orderController.getOrderById(req, res, next);
});

export default router;
