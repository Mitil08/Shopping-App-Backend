import { db } from '../config/db.js';
import { emailService } from './emailService.js';
import { wishlistAlertService } from './wishlistAlertService.js';

export const inventoryService = {
  /**
   * Automatically decrements variant stock upon order placement / payment capture
   */
  decrementStockOnOrder: async (order) => {
    const items = order.items || [];
    const alertsTriggered = [];

    for (const item of items) {
      const product = db.products.find((p) => p.id === item.productId || p.slug === item.slug);
      if (!product) continue;

      let matchedVariant = null;
      if (item.variantId) {
        matchedVariant = product.variants?.find((v) => v.id === item.variantId);
      }
      if (!matchedVariant && product.variants?.length > 0) {
        matchedVariant = product.variants.find((v) => 
          (item.size && v.size.toLowerCase() === item.size.toLowerCase()) &&
          (item.color && v.color.toLowerCase() === item.color.toLowerCase())
        ) || product.variants[0];
      }

      if (matchedVariant) {
        const qtyToDeduct = Number(item.quantity || 1);
        const previousStock = matchedVariant.stock_quantity || 0;
        matchedVariant.stock_quantity = Math.max(0, previousStock - qtyToDeduct);

        console.log(`[Inventory Sync]: Deducted ${qtyToDeduct} units for "${product.name}" (${matchedVariant.size}/${matchedVariant.color}). Stock: ${previousStock} -> ${matchedVariant.stock_quantity}`);

        // Trigger Vendor Alert if stock drops below or equal to 3
        if (matchedVariant.stock_quantity <= 3) {
          const alertResult = await inventoryService.dispatchLowStockAlert(product, matchedVariant);
          alertsTriggered.push(alertResult);
        }
      }
    }

    return {
      success: true,
      alertsTriggered,
    };
  },

  /**
   * Generates and dispatches an automated Low-Stock Alert email to the vendor/seller
   */
  dispatchLowStockAlert: async (product, variant) => {
    const seller = db.users.find((u) => u.id === product.seller_id || u.role === 'seller') || {
      email: 'seller@elane-studio.com',
      name: 'Maison Silk Merchants',
      storeName: 'Maison Silk & Tailoring Co.',
    };

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const restockUrl = `${frontendUrl}/seller?action=restock&productId=${product.id}`;
    const remainingQty = variant.stock_quantity;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Urgent Stock Alert — Maison ÉLANE</title>
</head>
<body style="margin: 0; padding: 32px 16px; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #141414;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E8E6E1; border-radius: 4px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.04);">
    <div style="height: 4px; background: linear-gradient(90deg, #DC2626 0%, #C2A676 100%);"></div>
    
    <div style="padding: 36px 40px 20px 40px; border-bottom: 1px solid #E8E6E1;">
      <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: 400; letter-spacing: 0.2em; text-transform: uppercase;">
        É L A N E
      </h1>
      <p style="margin: 4px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #DC2626; font-weight: 700;">
        ⚠️ Automated Inventory Depletion Alert
      </p>
    </div>

    <div style="padding: 32px 40px;">
      <p style="font-size: 14px; color: #52504C; line-height: 1.6; margin: 0 0 20px 0;">
        Dear <strong>${seller.storeName || seller.name}</strong>,<br>
        A recent acquisition on the ÉLANE marketplace has lowered inventory for one of your luxury listings below the critical reserve threshold.
      </p>

      <div style="background-color: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 8px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 18px; color: #991B1B;">
          ${product.name}
        </h3>
        <p style="margin: 0 0 6px 0; font-size: 12px; color: #7F1D1D;">
          <strong>Variant:</strong> Size ${variant.size} • Color ${variant.color} • SKU: ${variant.sku || variant.id}
        </p>
        <p style="margin: 0; font-size: 14px; font-weight: 700; color: #DC2626;">
          ⚡ Units Remaining in Stock: ${remainingQty} ${remainingQty === 1 ? 'Unit' : 'Units'} Only
        </p>
      </div>

      <p style="font-size: 13px; color: #52504C; line-height: 1.5; margin: 0 0 28px 0;">
        To avoid automatic catalog delisting or lost acquisitions, please replenish your atelier warehouse inventory immediately.
      </p>

      <div style="text-align: center; margin-bottom: 24px;">
        <a href="${restockUrl}" style="display: inline-block; padding: 14px 32px; background-color: #141414; color: #FAF9F5; text-decoration: none; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; border-radius: 2px;">
          Replenish Inventory (Vendor Portal)
        </a>
      </div>
    </div>

    <div style="padding: 16px 40px; background-color: #141414; color: #C2A676; text-align: center; font-size: 11px;">
      ÉLANE Multi-Vendor Logistics & Inventory Hub
    </div>
  </div>
</body>
</html>
    `;

    const subject = `⚠️ [Urgent Stock Notice] Only ${remainingQty} units left for "${product.name}"`;
    const emailRes = await emailService.sendCustomEmail(seller.email, subject, htmlContent);

    console.log(`[Low Stock Alert Dispatched]: Sent to ${seller.email} for product "${product.name}" (${remainingQty} units left)`);

    return {
      product: product.name,
      variant: `${variant.size}/${variant.color}`,
      remainingStock: remainingQty,
      sellerEmail: seller.email,
      dispatched: emailRes.success,
    };
  },

  /**
   * Vendor 1-Click Restock Function
   */
  restockProduct: async (productId, variantId, quantityToAdd = 10) => {
    const product = db.products.find((p) => p.id === productId || p.slug === productId);
    if (!product) {
      throw new Error('Product not found for restocking');
    }

    let targetVariant = product.variants?.find((v) => v.id === variantId);
    if (!targetVariant && product.variants?.length > 0) {
      targetVariant = product.variants[0];
    }

    if (!targetVariant) {
      targetVariant = { id: `var-${Date.now()}`, size: 'M', color: 'Default', stock_quantity: 0 };
      if (!product.variants) product.variants = [];
      product.variants.push(targetVariant);
    }

    const previousStock = targetVariant.stock_quantity || 0;
    targetVariant.stock_quantity = previousStock + Number(quantityToAdd);

    // If previously 0 stock and now replenished -> trigger Back-in-Stock automation!
    if (previousStock === 0 && targetVariant.stock_quantity > 0) {
      try {
        await wishlistAlertService.notifyBackInStock(product.id, targetVariant);
      } catch (err) {
        console.warn('[Back in Stock Notification Warning]:', err.message);
      }
    }

    console.log(`✓ [Restock Complete]: Product "${product.name}" stock increased by +${quantityToAdd} (New total: ${targetVariant.stock_quantity})`);

    return {
      success: true,
      product: product.name,
      variantId: targetVariant.id,
      previousStock,
      newStock: targetVariant.stock_quantity,
    };
  },

  /**
   * Retrieves all low-stock listings
   */
  getLowStockProducts: (sellerId = null) => {
    let list = db.products;
    if (sellerId) {
      list = list.filter((p) => p.seller_id === sellerId || (!p.seller_id && sellerId === 'usr-seller-1'));
    }

    const lowStockItems = [];
    for (const prod of list) {
      const criticalVariants = (prod.variants || []).filter((v) => (v.stock_quantity || 0) <= 3);
      if (criticalVariants.length > 0) {
        lowStockItems.push({
          productId: prod.id,
          name: prod.name,
          slug: prod.slug,
          image: prod.images?.[0] || '',
          price: prod.sale_price || prod.base_price,
          seller_id: prod.seller_id,
          criticalVariants,
          totalStock: (prod.variants || []).reduce((acc, v) => acc + (v.stock_quantity || 0), 0),
        });
      }
    }

    return lowStockItems;
  },
};
