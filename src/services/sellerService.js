import { db } from '../config/db.js';

export const sellerService = {
  getDashboardStats: async (sellerId) => {
    // 1. Get seller's products
    const sellerProducts = db.products.filter(
      (p) => p.seller_id === sellerId || (!p.seller_id && sellerId === 'usr-seller-1')
    );

    // 2. Find orders containing seller products
    const sellerProductIds = new Set(sellerProducts.map((p) => p.id));
    const sellerOrders = [];
    let totalRevenue = 0;
    let pendingFulfillmentCount = 0;
    let completedFulfillmentCount = 0;

    for (const order of db.orders) {
      const items = (order.items || []).filter(
        (item) => sellerProductIds.has(item.productId) || item.sellerId === sellerId
      );

      if (items.length > 0) {
        const orderSubtotal = items.reduce((sum, it) => sum + Number(it.price || 0) * (it.quantity || 1), 0);
        totalRevenue += orderSubtotal;
        if (order.status === 'Confirmed' || order.status === 'Processing') {
          pendingFulfillmentCount++;
        } else if (order.status === 'Delivered' || order.status === 'Dispatched') {
          completedFulfillmentCount++;
        }

        sellerOrders.push({
          ...order,
          sellerItems: items,
          sellerSubtotal: orderSubtotal,
        });
      }
    }

    const lowStockAlerts = sellerProducts.filter((p) => {
      const totalStock = (p.variants || []).reduce((acc, v) => acc + (v.stock_quantity || 0), 0);
      return totalStock <= 5;
    });

    const sellerInfo = db.users.find((u) => u.id === sellerId) || {};

    return {
      storeName: sellerInfo.storeName || 'Atelier Merchant Partner',
      rating: sellerInfo.rating || 4.9,
      gstin: sellerInfo.gstin || '27AABCM8291Q1Z4',
      totalRevenue,
      totalOrders: sellerOrders.length,
      pendingFulfillmentCount,
      completedFulfillmentCount,
      totalProducts: sellerProducts.length,
      lowStockCount: lowStockAlerts.length,
      recentOrders: sellerOrders.slice(0, 5),
    };
  },

  getSellerProducts: async (sellerId) => {
    return db.products.filter(
      (p) => p.seller_id === sellerId || (!p.seller_id && sellerId === 'usr-seller-1')
    );
  },

  getSellerOrders: async (sellerId) => {
    const sellerProducts = db.products.filter(
      (p) => p.seller_id === sellerId || (!p.seller_id && sellerId === 'usr-seller-1')
    );
    const sellerProductIds = new Set(sellerProducts.map((p) => p.id));

    const matchedOrders = [];
    for (const order of db.orders) {
      const items = (order.items || []).filter(
        (item) => sellerProductIds.has(item.productId) || item.sellerId === sellerId
      );
      if (items.length > 0) {
        const orderSubtotal = items.reduce((sum, it) => sum + Number(it.price || 0) * (it.quantity || 1), 0);
        matchedOrders.push({
          ...order,
          sellerItems: items,
          sellerSubtotal: orderSubtotal,
        });
      }
    }
    return matchedOrders;
  },

  updateFulfillmentStatus: async (sellerId, orderId, status) => {
    const orderIndex = db.orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }

    db.orders[orderIndex].status = status;
    db.orders[orderIndex].updated_at = new Date().toISOString();
    return db.orders[orderIndex];
  },
};
