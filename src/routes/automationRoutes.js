import { Router } from 'express';
import { automationController } from '../controllers/automationController.js';

const router = Router();

// Automation 1: Abandoned Cart Recovery
router.post('/abandoned-cart/scan', automationController.scanAbandonedCarts);
router.post('/abandoned-cart/test', automationController.testAbandonedCartRecovery);

// Automation 2: Inventory Depletion & Restock Alerts
router.get('/inventory/low-stock', automationController.getLowStockAlerts);
router.post('/inventory/restock', automationController.restockProduct);

// Automation 3: Midnight Financial Settlements
router.get('/settlements', automationController.getSettlements);
router.post('/settlements/generate', automationController.generateSettlement);
router.get('/settlements/:id/statement', automationController.getSettlementStatementHTML);

// Automation 4: Wishlist Price Drops & Restock Alerts
router.post('/wishlist/sync', automationController.syncWishlist);
router.post('/wishlist/test', automationController.testWishlistAlert);

export default router;
