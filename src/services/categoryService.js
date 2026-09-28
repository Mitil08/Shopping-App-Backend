import { db } from '../config/db.js';

export const categoryService = {
  getAllCategories: async () => {
    return db.categories;
  },
};
