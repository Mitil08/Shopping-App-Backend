import { db } from '../config/db.js';
import { emailService } from './emailService.js';
import { whatsappNotificationService } from './whatsappNotificationService.js';

// In-memory user wishlist tracking registry
// userId -> [ { productId, slug, name, priceAtSave, savedAt } ]
const wishlistTracker = new Map();

// Initialize with demo user wishlist
wishlistTracker.set('usr-client-1', [
  {
    productId: 'prod-1',
    slug: 'atelier-double-breasted-wool-coat',
    name: 'Atelier Double-Breasted Wool Coat',
    priceAtSave: 59000,
    savedAt: new Date().toISOString(),
  },
  {
    productId: 'prod-2',
    slug: 'sartorial-silk-crepe-evening-gown',
    name: 'Sartorial Silk Crepe Evening Gown',
    priceAtSave: 62000,
    savedAt: new Date().toISOString(),
  },
]);

export const wishlistAlertService = {
  /**
   * Syncs user's wishlist from frontend
   */
  syncUserWishlist: (userId, items, userEmail = null, userPhone = null) => {
    if (!userId && !userEmail) return;
    const key = userId || userEmail;

    const formatted = (items || []).map((it) => ({
      productId: it.id || it.productId,
      slug: it.slug,
      name: it.name,
      priceAtSave: Number(it.sale_price || it.base_price || it.price || 0),
      savedAt: new Date().toISOString(),
      email: userEmail,
      phone: userPhone,
    }));

    wishlistTracker.set(key, formatted);
    return { count: formatted.length };
  },

  /**
   * Dispatches automated alerts when a product price drops
   */
  notifyPriceDrop: async (productId, oldPrice, newPrice) => {
    const product = db.products.find((p) => p.id === productId || p.slug === productId);
    if (!product) return { count: 0 };

    const savings = Math.round(Number(oldPrice) - Number(newPrice));
    if (savings <= 0) return { count: 0 };

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const productUrl = `${frontendUrl}/products/${product.slug}?utm_source=price_drop_alert`;
    const interestedUsers = [];

    // Search wishlist registries
    for (const [userId, items] of wishlistTracker.entries()) {
      const match = items.find((it) => it.productId === product.id || it.slug === product.slug);
      if (match) {
        const user = db.users.find((u) => u.id === userId) || { email: match.email || 'client@elane-studio.com', phone: match.phone || '+91 98765 43210', name: 'Valued Patron' };
        interestedUsers.push(user);
      }
    }

    // Default fallback to demo client if empty
    if (interestedUsers.length === 0) {
      interestedUsers.push({
        email: 'client@elane-studio.com',
        phone: '+91 98765 43210',
        name: 'Genevieve Laurent',
      });
    }

    const results = [];
    for (const user of interestedUsers) {
      const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Price Drop Privilege — Maison ÉLANE</title>
</head>
<body style="margin: 0; padding: 32px 16px; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #141414;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E8E6E1; border-radius: 4px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.04);">
    <div style="height: 4px; background: linear-gradient(90deg, #141414 0%, #C2A676 50%, #141414 100%);"></div>
    
    <div style="padding: 36px 40px 20px 40px; text-align: center; border-bottom: 1px solid #E8E6E1;">
      <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; letter-spacing: 0.25em; text-transform: uppercase;">
        É L A N E
      </h1>
      <p style="margin: 4px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #C2A676; font-weight: 700;">
        Wishlist Private Privilege
      </p>
    </div>

    <div style="padding: 32px 40px;">
      <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 20px; font-weight: 400; margin: 0 0 12px 0;">
        Price Drop on your Saved Piece
      </h2>
      <p style="font-size: 14px; color: #52504C; line-height: 1.6; margin: 0 0 24px 0;">
        Dear <strong>${user.name || 'Valued Patron'}</strong>,<br>
        An atelier price adjustment has been applied to a piece saved in your Private Wishlist.
      </p>

      <div style="background-color: #FAF9F5; border: 1px solid #E8E6E1; border-radius: 6px; padding: 20px; margin-bottom: 24px; text-align: center;">
        <h3 style="margin: 0 0 8px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 18px; color: #141414;">
          ${product.name}
        </h3>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #787570;">
          Previous: <span style="text-decoration: line-through;">₹${Number(oldPrice).toLocaleString('en-IN')}</span>
        </p>
        <p style="margin: 0; font-size: 22px; font-weight: 700; color: #047857;">
          Now: ₹${Number(newPrice).toLocaleString('en-IN')} <span style="font-size: 12px; color: #047857;">(Save ₹${savings.toLocaleString('en-IN')})</span>
        </p>
      </div>

      <div style="text-align: center; margin-bottom: 20px;">
        <a href="${productUrl}" style="display: inline-block; padding: 14px 36px; background-color: #141414; color: #FAF9F5; text-decoration: none; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; border-radius: 2px;">
          Acquire At Updated Privilege
        </a>
      </div>
    </div>

    <div style="padding: 16px 40px; background-color: #141414; color: #C2A676; text-align: center; font-size: 11px;">
      ÉLANE Atelier • Defined by Restraint &amp; Longevity
    </div>
  </div>
</body>
</html>
      `;

      // 1. SendGrid Email
      if (user.email) {
        await emailService.sendCustomEmail(
          user.email,
          `✨ Price Drop Privilege: "${product.name}" is now ₹${Number(newPrice).toLocaleString('en-IN')}`,
          emailHtml
        );
      }

      // 2. WhatsApp Alert
      if (user.phone) {
        const waMessage = 
`✨ *ÉLANE ATELIER — PRIVATE PRICE DROP PRIVILÈGE* ✨

Dear ${user.name || 'Valued Patron'},

A piece in your Atelier Wishlist (*${product.name}*) has received a price reduction:

💰 *Previous Price:* ~₹${Number(oldPrice).toLocaleString('en-IN')}~
🏷️ *New Price:* *₹${Number(newPrice).toLocaleString('en-IN')}* (Save ₹${savings.toLocaleString('en-IN')})

Acquire before atelier allocation closes:
${productUrl}

_ÉLANE Atelier — Defined by Restraint & Longevity_`;

        await whatsappNotificationService.sendCustomWhatsAppMessage(user.phone, waMessage);
      }

      results.push({ user: user.email, product: product.name, newPrice, savings });
    }

    console.log(`✓ [Price Drop Notification Engine]: Dispatched alerts to ${results.length} clients for "${product.name}"`);
    return { count: results.length, recipients: results };
  },

  /**
   * Dispatches automated alerts when an out-of-stock product is replenished
   */
  notifyBackInStock: async (productId, variant = null) => {
    const product = db.products.find((p) => p.id === productId || p.slug === productId);
    if (!product) return { count: 0 };

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const productUrl = `${frontendUrl}/products/${product.slug}?utm_source=back_in_stock_alert`;
    const interestedUsers = [];

    for (const [userId, items] of wishlistTracker.entries()) {
      const match = items.find((it) => it.productId === product.id || it.slug === product.slug);
      if (match) {
        const user = db.users.find((u) => u.id === userId) || { email: match.email || 'client@elane-studio.com', phone: match.phone || '+91 98765 43210', name: 'Valued Patron' };
        interestedUsers.push(user);
      }
    }

    if (interestedUsers.length === 0) {
      interestedUsers.push({
        email: 'client@elane-studio.com',
        phone: '+91 98765 43210',
        name: 'Genevieve Laurent',
      });
    }

    const results = [];
    for (const user of interestedUsers) {
      const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Back in Stock — Maison ÉLANE</title>
</head>
<body style="margin: 0; padding: 32px 16px; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #141414;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E8E6E1; border-radius: 4px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.04);">
    <div style="height: 4px; background: linear-gradient(90deg, #141414 0%, #C2A676 50%, #141414 100%);"></div>
    
    <div style="padding: 36px 40px 20px 40px; text-align: center; border-bottom: 1px solid #E8E6E1;">
      <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; letter-spacing: 0.25em; text-transform: uppercase;">
        É L A N E
      </h1>
      <p style="margin: 4px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #C2A676; font-weight: 700;">
        Atelier Replenishment Notice
      </p>
    </div>

    <div style="padding: 32px 40px;">
      <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 20px; font-weight: 400; margin: 0 0 12px 0;">
        Replenished: Your Wishlist Selection
      </h2>
      <p style="font-size: 14px; color: #52504C; line-height: 1.6; margin: 0 0 24px 0;">
        Dear <strong>${user.name || 'Valued Patron'}</strong>,<br>
        We are pleased to inform you that our master artisans have completed a limited restock of a piece saved in your Wishlist.
      </p>

      <div style="background-color: #FAF9F5; border: 1px solid #E8E6E1; border-radius: 6px; padding: 20px; margin-bottom: 24px; text-align: center;">
        <h3 style="margin: 0 0 8px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 18px; color: #141414;">
          ${product.name}
        </h3>
        ${variant ? `<p style="margin: 0 0 6px 0; font-size: 12px; color: #787570;">Variant: Size ${variant.size} • Color ${variant.color}</p>` : ''}
        <p style="margin: 0; font-size: 16px; font-weight: 700; color: #141414;">
          ₹${Number(product.sale_price || product.base_price).toLocaleString('en-IN')}
        </p>
      </div>

      <div style="text-align: center; margin-bottom: 20px;">
        <a href="${productUrl}" style="display: inline-block; padding: 14px 36px; background-color: #141414; color: #FAF9F5; text-decoration: none; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; border-radius: 2px;">
          View &amp; Commission Now
        </a>
      </div>
    </div>

    <div style="padding: 16px 40px; background-color: #141414; color: #C2A676; text-align: center; font-size: 11px;">
      ÉLANE Atelier • Defined by Restraint &amp; Longevity
    </div>
  </div>
</body>
</html>
      `;

      if (user.email) {
        await emailService.sendCustomEmail(
          user.email,
          `✨ Back in Stock: "${product.name}" has been replenished at Maison ÉLANE`,
          emailHtml
        );
      }

      if (user.phone) {
        const waMessage = 
`✨ *ÉLANE ATELIER — RESTOCK NOTIFICATION* ✨

Dear ${user.name || 'Valued Patron'},

A saved piece from your Wishlist (*${product.name}*) is now back in stock in limited quantities.

Reserve your piece today:
${productUrl}

_ÉLANE Atelier — Defined by Restraint & Longevity_`;

        await whatsappNotificationService.sendCustomWhatsAppMessage(user.phone, waMessage);
      }

      results.push({ user: user.email, product: product.name });
    }

    console.log(`✓ [Back-in-Stock Notification Engine]: Dispatched alerts to ${results.length} clients for "${product.name}"`);
    return { count: results.length, recipients: results };
  },

  /**
   * Test trigger
   */
  triggerTestAlert: async (type = 'price_drop', targetEmail = 'client@elane-studio.com', targetPhone = '+91 98765 43210') => {
    const sampleProduct = db.products[0];
    if (type === 'price_drop') {
      return await wishlistAlertService.notifyPriceDrop(sampleProduct.id, 59000, 49999);
    } else {
      return await wishlistAlertService.notifyBackInStock(sampleProduct.id, sampleProduct.variants?.[0]);
    }
  },
};
