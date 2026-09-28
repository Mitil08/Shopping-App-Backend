import { Router } from 'express';
import { cartController } from '../controllers/cartController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// All cart routes require authenticated session
router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post('/', cartController.addItem);
router.put('/items/:itemId', cartController.updateItem);
router.delete('/items/:itemId', cartController.removeItem);
router.post('/sync', cartController.syncCart);
router.delete('/', cartController.clearCart);

export default router;
