import { categoryService } from '../services/categoryService.js';
import { successResponse } from '../utils/responseHandler.js';

export const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const categories = await categoryService.getAllCategories();
      return successResponse(res, categories);
    } catch (err) {
      next(err);
    }
  },
};
