import { Router } from 'express';
import { productController } from '../controllers/productController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { productValidator } from '../validators/productValidator.js';
import { validateRequest } from '../middleware/validationMiddleware.js';

const router = Router();

// Public routes
router.get('/', productController.getProducts);
router.get('/:slug', productController.getProductBySlug);

// Admin protected routes
router.post('/', authMiddleware, adminMiddleware, productValidator, validateRequest, productController.createProduct);
router.put('/:id', authMiddleware, adminMiddleware, productValidator, validateRequest, productController.updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, productController.deleteProduct);

export default router;
