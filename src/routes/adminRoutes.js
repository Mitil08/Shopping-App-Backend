import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = Router();

// Protect all admin routes with JWT and Admin role verification
router.use(authMiddleware, adminMiddleware);

router.get('/dashboard', adminController.getDashboard);
router.get('/orders', adminController.getOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);
router.get('/users', adminController.getUsers);

export default router;
