import { Router } from 'express';
import { sellerController } from '../controllers/sellerController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { sellerOrAdminMiddleware } from '../middleware/sellerMiddleware.js';

const router = Router();

// Protect all seller routes with authentication and Seller/Admin verification
router.use(authMiddleware, sellerOrAdminMiddleware);

router.get('/dashboard', sellerController.getDashboard);
router.get('/products', sellerController.getProducts);
router.get('/orders', sellerController.getOrders);
router.put('/orders/:id/status', sellerController.updateFulfillmentStatus);
router.post('/products/restock', sellerController.restockProduct);
router.get('/settlements', sellerController.getSettlements);
router.post('/settlements/generate', sellerController.generateSettlement);

export default router;
