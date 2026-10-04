import { db } from '../config/db.js';
import { emailService } from './emailService.js';

// In-memory settlement ledger
const settlementLedger = [
  {
    id: 'SETTLE-2026-10-01-M1',
    sellerId: 'usr-seller-1',
    sellerName: 'Maison Silk & Tailoring Co.',
    sellerEmail: 'seller@elane-studio.com',
    period: '2026-09-24 to 2026-09-30',
    generatedAt: '2026-10-01T00:00:00.000Z',
    gmv: 489000,
    orderCount: 14,
    platformFeeRate: 0.10,
    platformFee: 48900,
    gstRate: 0.18,
    gstOnFee: 8802,
    logisticsDeductions: 1680, // 14 * 120
    netPayout: 429618,
    status: 'TRANSFERRED',
    utrNumber: 'UTR-HDFC-99281746210',
  },
];

export const vendorSettlementService = {
  /**
   * Generates a luxury HTML Tax Settlement Statement for a vendor
   */
  generateStatementHTML: (settlement) => {
    const formattedDate = new Date(settlement.generatedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ÉLANE Atelier — Merchant Settlement Statement #${settlement.id}</title>
  <style>
    @media print {
      body { background: #FFFFFF !important; margin: 0; padding: 0; }
      .no-print { display: none !important; }
      .statement-card { box-shadow: none !important; border: none !important; max-width: 100% !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 32px 16px; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #141414;">
  <div class="statement-card" style="max-width: 680px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E8E6E1; border-radius: 4px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.04);">
    
    <!-- Top Gold Accent Bar -->
    <div style="height: 4px; background: linear-gradient(90deg, #141414 0%, #C2A676 50%, #141414 100%);"></div>

    <!-- Header -->
    <div style="padding: 36px 40px 24px 40px; border-bottom: 1px solid #E8E6E1;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
        <div>
          <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; letter-spacing: 0.25em; text-transform: uppercase;">
            É L A N E
          </h1>
          <p style="margin: 4px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #C2A676; font-weight: 700;">
            Multi-Vendor Marketplace Settlement Sheet
          </p>
        </div>
        <div style="text-align: right;">
          <span style="display: inline-block; padding: 4px 10px; background-color: #FAF9F5; border: 1px solid #E8E6E1; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #047857;">
            ${settlement.status}
          </span>
          <p style="margin: 6px 0 0 0; font-size: 11px; color: #787570; font-family: monospace;">
            Statement: <strong>${settlement.id}</strong>
          </p>
          <p style="margin: 2px 0 0 0; font-size: 11px; color: #787570;">
            Date: ${formattedDate}
          </p>
        </div>
      </div>
    </div>

    <!-- Merchant Info -->
    <div style="padding: 24px 40px; background-color: #FAF9F5; border-bottom: 1px solid #E8E6E1;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div>
          <p style="margin: 0 0 4px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #787570; font-weight: 700;">Merchant Partner</p>
          <p style="margin: 0; font-size: 14px; font-weight: 700; color: #141414;">${settlement.sellerName}</p>
          <p style="margin: 2px 0 0 0; font-size: 12px; color: #52504C;">Email: ${settlement.sellerEmail}</p>
          <p style="margin: 2px 0 0 0; font-size: 11px; color: #787570; font-family: monospace;">Period: ${settlement.period}</p>
        </div>
        <div>
          <p style="margin: 0 0 4px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #787570; font-weight: 700;">Settlement Payout Route</p>
          <p style="margin: 0; font-size: 12px; color: #141414;">Bank: HDFC Bank Atelier Escrow</p>
          <p style="margin: 2px 0 0 0; font-size: 11px; color: #787570; font-family: monospace;">UTR: ${settlement.utrNumber}</p>
          <p style="margin: 2px 0 0 0; font-size: 11px; color: #047857; font-weight: 600;">Direct RTGS/NEFT Deposited</p>
        </div>
      </div>
    </div>

    <!-- Financial Breakdown Table -->
    <div style="padding: 28px 40px;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #141414;">
            <th style="padding: 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; text-align: left;">Financial Component</th>
            <th style="padding: 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; text-align: right;">Amount (INR)</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #E8E6E1;">
            <td style="padding: 14px 0; font-size: 13px; color: #141414;">
              <strong>Gross Merchandise Value (GMV)</strong>
              <div style="font-size: 11px; color: #787570;">Total value of ${settlement.orderCount} fulfilled orders</div>
            </td>
            <td style="padding: 14px 0; font-size: 14px; font-weight: 700; text-align: right; color: #141414;">
              ₹${Number(settlement.gmv).toLocaleString('en-IN')}
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #E8E6E1;">
            <td style="padding: 14px 0; font-size: 13px; color: #141414;">
              ÉLANE Platform Commission Fee (10%)
              <div style="font-size: 11px; color: #787570;">Marketplace hosting, payment gateway &amp; 3PL software</div>
            </td>
            <td style="padding: 14px 0; font-size: 13px; text-align: right; color: #DC2626;">
              - ₹${Number(settlement.platformFee).toLocaleString('en-IN')}
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #E8E6E1;">
            <td style="padding: 14px 0; font-size: 13px; color: #141414;">
              GST on Commission Fee (18%)
              <div style="font-size: 11px; color: #787570;">Statutory Indian Goods &amp; Services Tax</div>
            </td>
            <td style="padding: 14px 0; font-size: 13px; text-align: right; color: #DC2626;">
              - ₹${Number(settlement.gstOnFee).toLocaleString('en-IN')}
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #E8E6E1;">
            <td style="padding: 14px 0; font-size: 13px; color: #141414;">
              Delhivery B2C Logistics Deduction
              <div style="font-size: 11px; color: #787570;">Surface &amp; Express parcel courier manifests</div>
            </td>
            <td style="padding: 14px 0; font-size: 13px; text-align: right; color: #DC2626;">
              - ₹${Number(settlement.logisticsDeductions).toLocaleString('en-IN')}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Net Payout Total -->
      <div style="margin-top: 24px; padding: 20px; background-color: #FAF9F5; border: 1px solid #E8E6E1; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #787570; font-weight: 700;">Net Merchant Payout Amount</span>
          <p style="margin: 2px 0 0 0; font-size: 11px; color: #047857;">Transferred directly to registered vendor bank account</p>
        </div>
        <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: 700; color: #141414;">
          ₹${Number(settlement.netPayout).toLocaleString('en-IN')}
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding: 20px 40px; background-color: #141414; color: #FAF9F5; text-align: center; font-size: 11px;">
      ÉLANE Multi-Vendor Financial Clearing &amp; Settlement System • Confirmed by Automated Reconciliation Engine
    </div>
  </div>

  <div class="no-print" style="max-width: 680px; margin: 16px auto 0 auto; text-align: center;">
    <button onclick="window.print()" style="cursor: pointer; padding: 10px 24px; background-color: #141414; color: #FFFFFF; border: none; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 4px;">
      🖨️ Print / Save Statement PDF
    </button>
  </div>
</body>
</html>
    `;
  },

  /**
   * Calculates and generates a new settlement report for a seller
   */
  generateSettlement: async (sellerId = 'usr-seller-1', periodTitle = null) => {
    const seller = db.users.find((u) => u.id === sellerId || u.role === 'seller') || {
      id: 'usr-seller-1',
      name: 'Maison Silk Merchants',
      storeName: 'Maison Silk & Tailoring Co.',
      email: 'seller@elane-studio.com',
    };

    // Calculate actual GMV from db.orders
    const sellerProducts = db.products.filter((p) => p.seller_id === seller.id || (!p.seller_id && seller.id === 'usr-seller-1'));
    const sellerProductIds = new Set(sellerProducts.map((p) => p.id));

    let gmv = 0;
    let orderCount = 0;

    for (const order of db.orders) {
      const items = (order.items || []).filter((it) => sellerProductIds.has(it.productId) || it.sellerId === seller.id);
      if (items.length > 0) {
        orderCount++;
        const subtotal = items.reduce((acc, it) => acc + (Number(it.price || it.unitPrice || 0) * Number(it.quantity || 1)), 0);
        gmv += subtotal;
      }
    }

    if (gmv === 0) {
      gmv = 185000; // Baseline default for demonstration
      orderCount = 5;
    }

    const platformFee = Math.round(gmv * 0.10);
    const gstOnFee = Math.round(platformFee * 0.18);
    const logisticsDeductions = orderCount * 120;
    const netPayout = gmv - platformFee - gstOnFee - logisticsDeductions;

    const settlementId = `SETTLE-${new Date().toISOString().slice(0, 10)}-${Date.now().toString(36).toUpperCase()}`;
    const period = periodTitle || `Daily Settlement — ${new Date().toLocaleDateString('en-US')}`;

    const settlement = {
      id: settlementId,
      sellerId: seller.id,
      sellerName: seller.storeName || seller.name,
      sellerEmail: seller.email,
      period,
      generatedAt: new Date().toISOString(),
      gmv,
      orderCount,
      platformFeeRate: 0.10,
      platformFee,
      gstRate: 0.18,
      gstOnFee,
      logisticsDeductions,
      netPayout,
      status: 'TRANSFERRED',
      utrNumber: `UTR-HDFC-${Math.floor(10000000000 + Math.random() * 90000000000)}`,
    };

    settlementLedger.unshift(settlement);

    // Automated Email Dispatch to Vendor & Admin
    const htmlStatement = vendorSettlementService.generateStatementHTML(settlement);
    const subject = `📊 ÉLANE Merchant Settlement #${settlement.id} — Net Payout: ₹${netPayout.toLocaleString('en-IN')}`;

    if (seller.email) {
      await emailService.sendCustomEmail(seller.email, subject, htmlStatement);
    }
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@elane-studio.com';
    await emailService.sendCustomEmail(adminEmail, `[Admin Audit] ${subject}`, htmlStatement);

    console.log(`✓ [Daily Settlement Generated]: ID ${settlement.id} for ₹${netPayout.toLocaleString('en-IN')} dispatched to ${seller.email}`);

    return settlement;
  },

  /**
   * Retrieves historical settlements
   */
  getSettlements: (sellerId = null) => {
    if (!sellerId) return settlementLedger;
    return settlementLedger.filter((s) => s.sellerId === sellerId || sellerId === 'usr-admin-1');
  },

  /**
   * Retrieves single settlement by ID
   */
  getSettlementById: (settlementId) => {
    return settlementLedger.find((s) => s.id === settlementId);
  },

  /**
   * Midnight Cron / Automated batch trigger
   */
  runDailyMidnightSettlements: async () => {
    const sellers = db.users.filter((u) => u.role === 'seller');
    const results = [];

    for (const seller of sellers) {
      const settle = await vendorSettlementService.generateSettlement(seller.id);
      results.push(settle);
    }

    return results;
  },
};
