import { productService } from '../services/productService.js';
import { successResponse } from '../utils/responseHandler.js';

export const productController = {
  getProducts: async (req, res, next) => {
    try {
      const data = await productService.getProducts(req.query);
      return successResponse(res, data);
    } catch (err) {
      next(err);
    }
  },

  getProductBySlug: async (req, res, next) => {
    try {
      const product = await productService.getProductBySlug(req.params.slug);
      return successResponse(res, product);
    } catch (err) {
      next(err);
    }
  },

  createProduct: async (req, res, next) => {
    try {
      const created = await productService.createProduct(req.body);
      return successResponse(res, created, 'Garment introduced successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  updateProduct: async (req, res, next) => {
    try {
      const updated = await productService.updateProduct(req.params.id, req.body);
      return successResponse(res, updated, 'Garment specifications updated');
    } catch (err) {
      next(err);
    }
  },

  deleteProduct: async (req, res, next) => {
    try {
      const deleted = await productService.deleteProduct(req.params.id);
      return successResponse(res, deleted, 'Garment archived from active catalog');
    } catch (err) {
      next(err);
    }
  },
};
