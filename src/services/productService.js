import { db } from '../config/db.js';

export const productService = {
  getProducts: async (filters = {}) => {
    let result = [...db.products];

    // Category filter
    if (filters.category && filters.category !== 'all') {
      result = result.filter(
        (p) =>
          p.category_id === filters.category ||
          p.categoryName?.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    // Search filter across name, description, material
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q)
      );
    }

    // Price filters
    if (filters.minPrice) {
      result = result.filter((p) => (p.sale_price || p.base_price) >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter((p) => (p.sale_price || p.base_price) <= Number(filters.maxPrice));
    }

    // Size filter
    if (filters.size) {
      result = result.filter((p) =>
        p.variants?.some((v) => v.size.toLowerCase() === filters.size.toLowerCase())
      );
    }

    // Color filter
    if (filters.color) {
      result = result.filter((p) =>
        p.variants?.some((v) => v.color.toLowerCase().includes(filters.color.toLowerCase()))
      );
    }

    // In Stock filter
    if (filters.inStock === 'true' || filters.inStock === true) {
      result = result.filter((p) => p.variants?.some((v) => v.stock_quantity > 0));
    }

    // Sorting
    if (filters.sort === 'price-asc') {
      result.sort((a, b) => (a.sale_price || a.base_price) - (b.sale_price || b.base_price));
    } else if (filters.sort === 'price-desc') {
      result.sort((a, b) => (b.sale_price || b.base_price) - (a.sale_price || a.base_price));
    } else if (filters.sort === 'newest') {
      result.reverse();
    }

    // Pagination
    const page = parseInt(filters.page, 10) || 1;
    const limit = parseInt(filters.limit, 10) || 24;
    const startIndex = (page - 1) * limit;
    const paginated = result.slice(startIndex, startIndex + limit);

    return {
      products: paginated,
      total: result.length,
      page,
      limit,
      totalPages: Math.ceil(result.length / limit),
    };
  },

  getProductBySlug: async (slug) => {
    const product = db.products.find((p) => p.slug === slug || p.id === slug);
    if (!product) {
      const err = new Error('Garment not found in active collection.');
      err.statusCode = 404;
      throw err;
    }
    return product;
  },

  createProduct: async (productData) => {
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProduct = {
      id: `prod-${Date.now().toString(36)}`,
      slug,
      is_active: true,
      rating: 5.0,
      reviewsCount: 1,
      created_at: new Date().toISOString(),
      ...productData,
    };

    db.products.unshift(newProduct);
    return newProduct;
  },

  updateProduct: async (id, updateData) => {
    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) {
      const err = new Error('Product not found for modification.');
      err.statusCode = 404;
      throw err;
    }

    db.products[index] = {
      ...db.products[index],
      ...updateData,
      updated_at: new Date().toISOString(),
    };

    return db.products[index];
  },

  deleteProduct: async (id) => {
    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) {
      const err = new Error('Product not found for deletion.');
      err.statusCode = 404;
      throw err;
    }

    const deleted = db.products.splice(index, 1)[0];
    return deleted;
  },
};
