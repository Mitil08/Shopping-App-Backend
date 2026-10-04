import dotenv from 'dotenv';
import { db } from '../config/db.js';
import { shippingService } from './shippingService.js';
import { orderService } from './orderService.js';
import { mockProducts } from '../data/mockProducts.js';

dotenv.config();

export const aiConciergeService = {
  /**
   * Process customer chat query with autonomous tool execution
   */
  handleChat: async (message, context = {}) => {
    const raw = String(message || '').trim();
    const q = raw.toLowerCase();
    const allProducts = db.products && db.products.length > 0 ? db.products : mockProducts;

    // 1. AUTONOMOUS TOOL CALL: Live Order Tracking / AWB Lookup
    const orderMatch = raw.match(/\b(ORD-[A-Z0-9-]+|DLH-[A-Z0-9-]+|BLU-[A-Z0-9-]+|REV-[A-Z0-9-]+)\b/i);
    if (orderMatch || q.includes('track') || q.includes('status of my order') || q.includes('where is my package')) {
      const queryRef = orderMatch ? orderMatch[0].toUpperCase() : null;

      if (queryRef) {
        try {
          const tracking = await shippingService.trackShipment(queryRef);
          const currentCheck = tracking.checkpoints?.[0];
          return {
            reply: `📦 **Live Delhivery Tracking Report for ${queryRef}**:\n\n• **Status:** ${tracking.status}\n• **Current Location:** ${tracking.currentLocation}\n• **Courier Partner:** ${tracking.courierPartner}\n• **Estimated Delivery:** ${tracking.estimatedDelivery}\n\n📍 *Latest Milestone:* ${currentCheck?.activity || 'In Transit'}`,
            actionType: 'TRACKING_CARD',
            actionData: tracking,
            suggestions: [
              'When will it be delivered?',
              'Download Shipping Label',
              'Need to change delivery address',
              'Contact Courier Concierge',
            ],
          };
        } catch (e) {
          console.warn('AI tracking lookup warning:', e.message);
        }
      } else {
        // Prompt for Order ID / AWB
        return {
          reply: `🔍 I can look up your real-time **Delhivery GPS transit milestones** immediately! Please share your **Order Reference** (e.g. \`ORD-L89K2-4912\`) or **AWB Number** (e.g. \`DLH-48102-IN\`).`,
          suggestions: [
            'Check ORD-L89K2-4912',
            'Check ORD-K71M4-9210',
            'What is the standard delivery time?',
            'Check PIN code delivery speed',
          ],
        };
      }
    }

    // 2. AUTONOMOUS TOOL CALL: Pincode Serviceability & Delivery ETA
    const pinMatch = raw.match(/\b([1-9][0-9]{5})\b/);
    if (pinMatch || q.includes('pincode') || q.includes('postal code') || q.includes('deliver to')) {
      const pin = pinMatch ? pinMatch[0] : null;
      if (pin) {
        const serviceability = await shippingService.checkServiceability(pin);
        return {
          reply: serviceability.serviceable
            ? `✨ **Delivery Confirmed for PIN ${pin}**:\n\n• **Speed:** ${serviceability.estimatedDays}\n• **Logistics Partner:** ${serviceability.courierPartner}\n• **Transit Hub:** ${serviceability.hub}\n• **Cash on Delivery (COD):** ${serviceability.codAvailable ? 'Available' : 'Prepaid Only'}\n• **Special Privilege:** ${serviceability.prepaidDiscount}`
            : `⚠️ Postal code **${pin}** is currently in an extended rural perimeter. Standard surface courier may take 4–6 business days.`,
          actionType: 'SERVICEABILITY_CARD',
          actionData: serviceability,
          suggestions: [
            'Where are the lightning deals?',
            'How do I view products in 3D?',
            'What promo codes can I use?',
          ],
        };
      } else {
        return {
          reply: `📍 Please enter your 6-digit postal PIN code (e.g. \`700001\` or \`110001\`), and I will check live delivery speeds and White-Glove courier availability.`,
          suggestions: ['Check 700001 (Kolkata)', 'Check 110001 (Delhi)', 'Check 400001 (Mumbai)', 'Check 560001 (Bengaluru)'],
        };
      }
    }

    // 3. AUTONOMOUS TOOL CALL: Sizing & Fit Advisor
    if (q.includes('size') || q.includes('fit') || q.includes('measurement') || q.includes('chart') || q.includes('chest') || q.includes('height') || q.includes('weight')) {
      return {
        reply: `📐 **ÉLANE Tailoring & Sizing Guide**:\n\nOur garments follow bespoke European tailoring dimensions:\n\n• **Size S (38 EU / UK):** Chest 36–38 in • Waist 30–32 in *(Ideal for 5'6\"–5'9\", 60–70 kg)*\n• **Size M (40 EU / UK):** Chest 39–41 in • Waist 32–34 in *(Ideal for 5'8\"–6'0\", 70–80 kg)*\n• **Size L (42 EU / UK):** Chest 42–44 in • Waist 34–36 in *(Ideal for 5'10\"–6'2\", 80–90 kg)*\n• **Size XL (44 EU / UK):** Chest 45–47 in • Waist 36–38 in *(Ideal for 6'0\"+, 90–100 kg)*\n\n*All pieces are backed by our complimentary 30-Day Free Size Exchange Guarantee.*`,
        actionType: 'SIZE_GUIDE',
        suggestions: [
          'Recommend a tailored coat',
          'What is the return policy?',
          'How do I view products in 3D?',
        ],
      };
    }

    // 4. AUTONOMOUS TOOL CALL: Returns & Refund Process
    if (q.includes('return') || q.includes('refund') || q.includes('exchange') || q.includes('money back')) {
      return {
        reply: `🥂 **Atelier 30-Day Hassle-Free Returns & Instant Refunds**:\n\n1. Go to your [Order History](/profile/orders) or [Order Detail](/order-detail).\n2. Click the **'Return / Exchange'** button.\n3. Pick a convenient date & time slot for Delhivery courier pickup.\n4. **Delhivery Reverse Agent** arrives at your doorstep to collect the garment.\n5. Once scanned, your **refund is deposited directly into your bank / UPI account via Razorpay** within minutes!`,
        actionLink: { label: 'Go to Order Archive', url: '/profile/orders' },
        suggestions: [
          'How do I track my return pickup?',
          'What promo codes can I use?',
          'Can I exchange for another size?',
        ],
      };
    }

    // 5. AUTONOMOUS TOOL CALL: Product Search & Catalog Recommendations
    const matchedProducts = allProducts.filter((p) => {
      const text = `${p.name} ${p.category} ${p.description || ''} ${p.tags?.join(' ') || ''}`.toLowerCase();
      return (
        (q.includes('coat') && text.includes('coat')) ||
        (q.includes('suit') && (text.includes('suit') || text.includes('blazer'))) ||
        (q.includes('leather') && text.includes('leather')) ||
        (q.includes('bag') && text.includes('bag')) ||
        (q.includes('watch') && (text.includes('watch') || text.includes('horology'))) ||
        (q.includes('phone') && (text.includes('phone') || text.includes('silicon'))) ||
        (q.includes('perfume') && (text.includes('perfume') || text.includes('scent') || text.includes('extrait'))) ||
        (q.includes('shoe') && (text.includes('shoe') || text.includes('boot') || text.includes('loafer')))
      );
    }).slice(0, 3);

    if (matchedProducts.length > 0) {
      return {
        reply: `✨ Here are our master artisan curated recommendations matching your inquiry:`,
        actionType: 'PRODUCT_CAROUSEL',
        products: matchedProducts.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          image: p.images?.[0] || p.image,
          url: `/product/${p.slug || p.id}`,
        })),
        suggestions: [
          'What promo codes can I apply?',
          'How does the 3D inspection work?',
          'Check delivery times',
        ],
      };
    }

    // 6. PROMO CODES & DEALS
    if (q.includes('promo') || q.includes('code') || q.includes('coupon') || q.includes('discount') || q.includes('deal') || q.includes('offer')) {
      return {
        reply: `🏷️ **Active ÉLANE Atelier Privilege Codes**:\n\n• **\`ATELIER10\`**: 10% off your entire commission order\n• **\`FIRSTBUY\`**: ₹2,000 complimentary welcome credit on orders above ₹15,000\n• **\`VIPPRIVILEGE\`**: 15% VIP discount for salon members\n• **\`SAVINGS5\`**: 5% instant courtesy reduction on prepaid checkouts\n\n*Apply any code during checkout for instant deduction.*`,
        suggestions: [
          'Where are the lightning deals?',
          'Recommend a tailored coat',
          'How do I track my order?',
        ],
      };
    }

    // 7. DEFAULT CONCIERGE ASSISTANCE
    return {
      reply: `✨ Hello! I am your **ÉLANE 24/7 AI Concierge**. I can assist you with:\n\n• 📦 **Live Delhivery Tracking & Reverse Pickups**\n• 📐 **Bespoke Sizing & Fit Advice**\n• 🏷️ **VIP Promo Codes & Privilege Discounts**\n• 🚚 **PIN Code Delivery Speed Lookup**\n• 🌐 **3D 360° Interactive Product Inspection**\n\nHow may I curate your acquisition today?`,
      suggestions: [
        'How do I track my order?',
        'What promo codes can I use?',
        'What is your return policy?',
        'Check PIN code delivery speed',
      ],
    };
  },
};
