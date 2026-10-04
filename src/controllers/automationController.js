import { abandonedCartService } from '../services/abandonedCartService.js';
import { inventoryService } from '../services/inventoryService.js';
import { vendorSettlementService } from '../services/vendorSettlementService.js';
import { wishlistAlertService } from '../services/wishlistAlertService.js';

export const automationController = {
  // --- AUTOMATION 1: ABANDONED CART RECOVERY ---
  scanAbandonedCarts: async (req, res) => {
    try {
      const minMinutes = Number(req.query.minMinutes || req.body.minMinutes || 15);
      const results = await abandonedCartService.processAbandonedCarts(minMinutes);
      return res.status(200).json({
        success: true,
        message: `Scanned abandoned carts. Processed ${results.length} recovery sequences.`,
        dispatches: results,
      });
    } catch (err) {
      console.error('Abandoned cart scanning error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  testAbandonedCartRecovery: async (req, res) => {
    try {
      const { email, phone, items } = req.body;
      const results = await abandonedCartService.triggerTestRecovery(email, phone, items);
      return res.status(200).json({
        success: true,
        message: 'Test abandoned cart recovery email & WhatsApp dispatched successfully.',
        results,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // --- AUTOMATION 2: INVENTORY SYNC & RESTOCK ---
  getLowStockAlerts: async (req, res) => {
    try {
      const sellerId = req.query.sellerId || (req.user?.role === 'seller' ? req.user.id : null);
      const lowStockItems = inventoryService.getLowStockProducts(sellerId);
      return res.status(200).json({
        success: true,
        count: lowStockItems.length,
        data: lowStockItems,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  restockProduct: async (req, res) => {
    try {
      const { productId, variantId, quantity = 10 } = req.body;
      const result = await inventoryService.restockProduct(productId, variantId, quantity);
      return res.status(200).json({
        success: true,
        message: `Successfully restocked ${result.product} by +${quantity} units.`,
        data: result,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // --- AUTOMATION 3: VENDOR FINANCIAL SETTLEMENTS ---
  getSettlements: async (req, res) => {
    try {
      const sellerId = req.user?.role === 'seller' ? req.user.id : (req.query.sellerId || null);
      const settlements = vendorSettlementService.getSettlements(sellerId);
      return res.status(200).json({
        success: true,
        count: settlements.length,
        data: settlements,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  generateSettlement: async (req, res) => {
    try {
      const sellerId = req.body.sellerId || (req.user?.role === 'seller' ? req.user.id : 'usr-seller-1');
      const periodTitle = req.body.period;
      const settlement = await vendorSettlementService.generateSettlement(sellerId, periodTitle);
      return res.status(200).json({
        success: true,
        message: `Settlement statement #${settlement.id} generated and emailed to merchant.`,
        data: settlement,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  getSettlementStatementHTML: async (req, res) => {
    try {
      const { id } = req.params;
      const settlement = vendorSettlementService.getSettlementById(id);
      if (!settlement) {
        return res.status(404).send('<h2>Settlement Statement Not Found</h2>');
      }
      const html = vendorSettlementService.generateStatementHTML(settlement);
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);
    } catch (err) {
      return res.status(500).send(`<h2>Error rendering statement: ${err.message}</h2>`);
    }
  },

  // --- AUTOMATION 4: WISHLIST ALERTS ---
  syncWishlist: async (req, res) => {
    try {
      const { userId, items, email, phone } = req.body;
      const targetUserId = userId || req.user?.id;
      const targetEmail = email || req.user?.email;
      const targetPhone = phone || req.user?.phone;

      const result = wishlistAlertService.syncUserWishlist(targetUserId, items, targetEmail, targetPhone);
      return res.status(200).json({
        success: true,
        message: 'Wishlist synced for real-time price-drop & restock alert monitoring.',
        data: result,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  testWishlistAlert: async (req, res) => {
    try {
      const { type = 'price_drop', email, phone } = req.body;
      const result = await wishlistAlertService.triggerTestAlert(type, email, phone);
      return res.status(200).json({
        success: true,
        message: `Test ${type} alert dispatched via SendGrid & WhatsApp.`,
        data: result,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },
};
