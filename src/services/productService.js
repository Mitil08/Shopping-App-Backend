import { db } from '../config/db.js';
import { wishlistAlertService } from './wishlistAlertService.js';

export const productService = {
  getProducts: async (filters = {}) => {
    let result = [...db.products];

    // Category filter (by id, slug, or categoryName) with umbrella category support
    if (filters.category && filters.category !== 'all') {
      const catQuery = filters.category.toLowerCase().trim();
      const matchedCategory = db.categories.find(
        (c) =>
          c.id?.toLowerCase() === catQuery ||
          c.slug?.toLowerCase() === catQuery ||
          c.name?.toLowerCase().includes(catQuery)
      );

      const targetId = matchedCategory ? matchedCategory.id.toLowerCase() : catQuery;
      const targetSlug = matchedCategory ? matchedCategory.slug.toLowerCase() : catQuery;
      const targetName = matchedCategory ? matchedCategory.name.toLowerCase() : catQuery;

      // Umbrella category definitions for seamless shopping
      const isMensFashion = targetId === 'cat-mens-fashion' || targetSlug === 'mens-fashion' || catQuery.includes('men');
      const isWomensFashion = targetId === 'cat-womens-fashion' || targetSlug === 'womens-fashion' || catQuery.includes('women');
      const isAccessories = targetId === 'cat-accessories' || targetSlug === 'leather-accessories' || catQuery.includes('access') || catQuery.includes('leather');
      const isTech = targetId === 'cat-mobiles-tech' || targetSlug === 'mobiles-electronics' || catQuery.includes('mobile') || catQuery.includes('tech') || catQuery.includes('electronic');
      const isAudio = targetId === 'cat-audio-wearables' || targetSlug === 'smartwatches-audio' || catQuery.includes('watch') || catQuery.includes('audio');
      const isFootwear = targetId === 'cat-footwear' || targetSlug === 'footwear-sneakers' || catQuery.includes('foot') || catQuery.includes('sneaker') || catQuery.includes('boot');
      const isBeauty = targetId === 'cat-beauty-perfumes' || targetSlug === 'beauty-fragrances' || catQuery.includes('beauty') || catQuery.includes('perfume') || catQuery.includes('fragrance');
      const isHome = targetId === 'cat-home-living' || targetSlug === 'home-luxury-living' || catQuery.includes('home') || catQuery.includes('decor') || catQuery.includes('living');

      result = result.filter((p) => {
        const pCatId = (p.category_id || '').toLowerCase();
        const pCatName = (p.categoryName || '').toLowerCase();
        const pName = (p.name || '').toLowerCase();
        const pDesc = (p.description || '').toLowerCase();

        // 1. Direct Category Match
        if (
          pCatId === targetId ||
          pCatId === targetSlug ||
          pCatName.includes(targetName) ||
          pCatName.includes(catQuery) ||
          pCatId.includes(catQuery)
        ) {
          return true;
        }

        // 2. Umbrella Mappings
        if (isMensFashion) {
          // Matches tailoring, shirts, outerwear, trousers, knitwear, footwear
          return (
            ['cat-tailoring', 'cat-shirts', 'cat-outerwear', 'cat-trousers', 'cat-knitwear', 'cat-footwear', 'cat-mens-fashion'].includes(pCatId) ||
            pCatName.includes('men') || pCatName.includes('suit') || pCatName.includes('shirt') || pCatName.includes('trouser') ||
            pName.includes('shirt') || pName.includes('coat') || pName.includes('trouser') || pName.includes('blazer') || pName.includes('jean') || pName.includes('polo')
          );
        }

        if (isWomensFashion) {
          // Matches dresses, skirts, outerwear, knitwear, accessories, perfumes
          return (
            ['cat-outerwear', 'cat-knitwear', 'cat-tailoring', 'cat-shirts', 'cat-womens-fashion', 'cat-beauty-perfumes'].includes(pCatId) ||
            pCatName.includes('women') || pCatName.includes('dress') || pCatName.includes('skirt') || pCatName.includes('knit') ||
            pName.includes('dress') || pName.includes('skirt') || pName.includes('wrap') || pName.includes('coat') || pName.includes('cashmere') || pName.includes('tote')
          );
        }

        if (isAccessories) {
          return pCatId === 'cat-accessories' || pCatName.includes('access') || pCatName.includes('leather') || pName.includes('tote') || pName.includes('belt') || pName.includes('wallet') || pName.includes('beanie');
        }

        if (isTech) {
          return pCatId === 'cat-mobiles-tech' || pCatName.includes('phone') || pCatName.includes('electronic') || pName.includes('phone') || pName.includes('tablet');
        }

        if (isAudio) {
          return pCatId === 'cat-audio-wearables' || pCatName.includes('audio') || pCatName.includes('watch') || pName.includes('headphone') || pName.includes('smartwatch');
        }

        if (isFootwear) {
          return pCatId === 'cat-footwear' || pCatName.includes('foot') || pCatName.includes('sneaker') || pName.includes('sneaker') || pName.includes('boot');
        }

        if (isBeauty) {
          return pCatId === 'cat-beauty-perfumes' || pCatName.includes('beauty') || pCatName.includes('fragrance') || pName.includes('parfum') || pName.includes('elixir');
        }

        if (isHome) {
          return pCatId === 'cat-home-living' || pCatName.includes('home') || pCatName.includes('living') || pName.includes('lamp') || pName.includes('stand') || pName.includes('espresso');
        }

        return false;
      });
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

    const previousProduct = { ...db.products[index] };
    const oldPrice = previousProduct.sale_price || previousProduct.base_price;

    db.products[index] = {
      ...db.products[index],
      ...updateData,
      updated_at: new Date().toISOString(),
    };

    const newPrice = db.products[index].sale_price || db.products[index].base_price;
    if (newPrice < oldPrice) {
      try {
        wishlistAlertService.notifyPriceDrop(id, oldPrice, newPrice).catch((err) => {
          console.warn('[Price Drop Alert Error]:', err.message);
        });
      } catch (e) {}
    }

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
