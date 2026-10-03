import { Router } from 'express';
import { productController } from '../controllers/productController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { sellerOrAdminMiddleware } from '../middleware/sellerMiddleware.js';
import { productValidator } from '../validators/productValidator.js';
import { validateRequest } from '../middleware/validationMiddleware.js';

const router = Router();

// Public routes
router.get('/', productController.getProducts);
router.get('/:slug', productController.getProductBySlug);

// Seller & Admin protected catalog routes
router.post('/', authMiddleware, sellerOrAdminMiddleware, productValidator, validateRequest, productController.createProduct);
router.put('/:id', authMiddleware, sellerOrAdminMiddleware, productValidator, validateRequest, productController.updateProduct);
router.delete('/:id', authMiddleware, sellerOrAdminMiddleware, productController.deleteProduct);

export default router;
