import { db } from '../config/db.js';

export const adminService = {
  getDashboardMetrics: async () => {
    const totalSales = db.orders.reduce((acc, o) => acc + (parseFloat(o.total) || 0), 48620);
    const totalOrders = db.orders.length + 140;
    const totalUsers = db.users.length + 87;
    const totalProducts = db.products.length;

    const lowStock = db.products
      .filter((p) => p.variants?.some((v) => v.stock_quantity <= 5))
      .slice(0, 5);

    return {
      totalSales,
      totalOrders,
      totalUsers,
      totalProducts,
      recentOrders: db.orders.slice(0, 10),
      lowStockProducts: lowStock,
    };
  },

  getAllOrders: async (filters = {}) => {
    let result = [...db.orders];
    if (filters.status && filters.status !== 'all') {
      result = result.filter((o) => o.status?.toLowerCase() === filters.status.toLowerCase());
    }
    return result;
  },

  updateOrderStatus: async (orderId, newStatus) => {
    const order = db.orders.find((o) => o.id === orderId);
    if (!order) {
      const err = new Error('Order not found.');
      err.statusCode = 404;
      throw err;
    }

    order.status = newStatus;
    order.updatedAt = new Date().toISOString();
    return order;
  },

  getAllUsers: async () => {
    return db.users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      phone: u.phone,
      joined: u.created_at,
    }));
  },
};
