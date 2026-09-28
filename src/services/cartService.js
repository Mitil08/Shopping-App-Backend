import { db } from '../config/db.js';

export const cartService = {
  getCart: async (userId) => {
    return { items: db.carts[userId] || [] };
  },

  addItem: async (userId, { productId, variantId, quantity = 1 }) => {
    if (!db.carts[userId]) db.carts[userId] = [];

    const product = db.products.find((p) => p.id === productId);
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }

    const variant = product.variants?.find((v) => v.id === variantId) || product.variants?.[0];
    const cartItemId = `${product.id}-${variant?.id || 'standard'}`;

    const existingIndex = db.carts[userId].findIndex((item) => item.id === cartItemId);
    if (existingIndex > -1) {
      db.carts[userId][existingIndex].quantity += quantity;
    } else {
      db.carts[userId].push({
        id: cartItemId,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.sale_price || product.base_price,
        image: product.images?.[0] || '',
        size: variant?.size || 'Standard',
        color: variant?.color || 'Default',
        variantId: variant?.id,
        quantity,
      });
    }

    return { items: db.carts[userId] };
  },

  updateItem: async (userId, cartItemId, quantity) => {
    if (!db.carts[userId]) return { items: [] };

    if (quantity <= 0) {
      db.carts[userId] = db.carts[userId].filter((item) => item.id !== cartItemId);
    } else {
      const item = db.carts[userId].find((i) => i.id === cartItemId);
      if (item) item.quantity = quantity;
    }

    return { items: db.carts[userId] };
  },

  removeItem: async (userId, cartItemId) => {
    if (!db.carts[userId]) return { items: [] };
    db.carts[userId] = db.carts[userId].filter((item) => item.id !== cartItemId);
    return { items: db.carts[userId] };
  },

  syncCart: async (userId, guestItems = []) => {
    if (!db.carts[userId]) db.carts[userId] = [];

    // Intelligently merge guest items with user's cart
    for (const guestItem of guestItems) {
      const existing = db.carts[userId].find((i) => i.id === guestItem.id);
      if (existing) {
        existing.quantity += guestItem.quantity;
      } else {
        db.carts[userId].push(guestItem);
      }
    }

    return { items: db.carts[userId] };
  },

  clearCart: async (userId) => {
    db.carts[userId] = [];
    return { items: [] };
  },
};
