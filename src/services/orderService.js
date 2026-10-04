import { db } from '../config/db.js';
import supabase from '../config/supabase.js';
import { whatsappNotificationService } from './whatsappNotificationService.js';
import { emailService } from './emailService.js';
import { shippingService } from './shippingService.js';
import { inventoryService } from './inventoryService.js';
import { abandonedCartService } from './abandonedCartService.js';

export const orderService = {
  createOrder: async (userId, orderData) => {
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: orderId,
      user_id: userId || null,
      customer: orderData.shippingAddress?.name || 'Private Client',
      email: orderData.shippingAddress?.email || orderData.email || '',
      items: orderData.items || [],
      shippingAddress: orderData.shippingAddress,
      subtotal: orderData.subtotal,
      discount: orderData.discount || 0,
      shippingCost: orderData.shippingCost || 0,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod || 'razorpay',
      paymentId: orderData.paymentId || null,
      razorpayOrderId: orderData.razorpayOrderId || null,
      razorpaySignature: orderData.razorpaySignature || null,
      paymentStatus: orderData.paymentStatus || (orderData.paymentMethod === 'cod' ? 'PENDING' : 'PAID'),
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    db.orders.unshift(newOrder);

    // If user cart exists, clear it
    if (userId && db.carts[userId]) {
      db.carts[userId] = [];
    }

    // Trigger automated Inventory Sync & Stock Depletion asynchronously
    try {
      inventoryService.decrementStockOnOrder(newOrder).catch((err) => {
        console.warn('[Inventory Sync Background Warning]:', err.message);
      });
    } catch (e) {
      console.warn('[Inventory decrement skipped]:', e.message);
    }

    // Mark cart as recovered in Abandoned Cart Tracker
    try {
      abandonedCartService.markCartRecovered(userId, newOrder.email);
    } catch (e) {
      console.warn('[Abandoned Cart Recovery Mark Skipped]:', e.message);
    }

    // Trigger automated 3PL courier manifest & AWB generation asynchronously
    try {
      shippingService.autoDispatchShipment(newOrder).catch((err) => {
        console.warn('[3PL Shipping Auto-Dispatch Warning]:', err.message);
      });
    } catch (e) {
      console.warn('[3PL trigger skipped]:', e.message);
    }

    // Trigger automated WhatsApp notification asynchronously
    try {
      const phone = orderData.shippingAddress?.phone || orderData.phone;
      if (phone) {
        whatsappNotificationService.sendOrderConfirmation(newOrder, phone).catch((err) => {
          console.warn('[WhatsApp Dispatch Background Error]:', err.message);
        });
      }
    } catch (e) {
      console.warn('[WhatsApp trigger skipped]:', e.message);
    }

    // Trigger automated Email Invoice dispatch asynchronously
    try {
      const customerEmail = newOrder.email || orderData.shippingAddress?.email;
      if (customerEmail) {
        emailService.sendOrderConfirmation(newOrder, customerEmail).catch((err) => {
          console.warn('[Email Dispatch Background Error]:', err.message);
        });
      }
    } catch (e) {
      console.warn('[Email trigger skipped]:', e.message);
    }

    return newOrder;
  },

  markOrderPaidByRazorpay: async (razorpayOrderId, paymentId, paymentData = {}) => {
    let order = db.orders.find(
      (o) => o.razorpayOrderId === razorpayOrderId || o.id === razorpayOrderId
    );

    if (order) {
      order.paymentStatus = 'PAID';
      order.status = 'Confirmed';
      order.paymentId = paymentId;
      order.updatedAt = new Date().toISOString();
      return order;
    }

    if (supabase) {
      try {
        const { data } = await supabase
          .from('orders')
          .update({
            payment_status: 'PAID',
            status: 'Confirmed',
            payment_id: paymentId,
            updated_at: new Date().toISOString(),
          })
          .eq('razorpay_order_id', razorpayOrderId)
          .select()
          .maybeSingle();

        if (data) return data;
      } catch (err) {
        console.warn('[Supabase Webhook Order Update]:', err.message);
      }
    }

    return null;
  },

  markOrderFailedByRazorpay: async (razorpayOrderId, reason = 'Payment failed') => {
    let order = db.orders.find(
      (o) => o.razorpayOrderId === razorpayOrderId || o.id === razorpayOrderId
    );

    if (order) {
      order.paymentStatus = 'FAILED';
      order.failReason = reason;
      order.updatedAt = new Date().toISOString();
      return order;
    }

    return null;
  },

  getUserOrders: async (userId) => {
    const userOrders = db.orders.filter((o) => o.user_id === userId);
    return userOrders;
  },

  getOrderById: async (orderId, userId = null) => {
    const order = db.orders.find((o) => o.id === orderId);
    if (!order) {
      const err = new Error('Order not found.');
      err.statusCode = 404;
      throw err;
    }

    // If userId provided and not admin, ensure customer owns the order
    if (userId && order.user_id && order.user_id !== userId) {
      const user = db.users.find((u) => u.id === userId);
      if (user?.role !== 'admin') {
        const err = new Error('Unauthorized to view this order manifest.');
        err.statusCode = 403;
        throw err;
      }
    }

    return order;
  },
};

