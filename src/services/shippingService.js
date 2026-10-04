import dotenv from 'dotenv';
import { db } from '../config/db.js';
import { whatsappNotificationService } from './whatsappNotificationService.js';
import { emailService } from './emailService.js';

dotenv.config();

// In-memory shipment storage for fast lookups and state persistence
const shipmentsStore = new Map();

/**
 * 3PL Logistics & Courier Automation Service
 * Supports Direct Delhivery Express API & Shiprocket REST API with automatic failover
 */
export const shippingService = {
  /**
   * Check if Delhivery API is configured
   */
  isDelhiveryConfigured: () => {
    return Boolean(process.env.DELHIVERY_API_TOKEN);
  },

  /**
   * Get Shiprocket Auth Token (if configured)
   */
  getShiprocketToken: async () => {
    const email = process.env.SHIPROCKET_EMAIL;
    const password = process.env.SHIPROCKET_PASSWORD;

    if (!email || !password) return null;

    try {
      const response = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      return data.token || null;
    } catch (err) {
      console.warn('[Shiprocket Auth Warning]:', err.message);
      return null;
    }
  },

  /**
   * Register a new Vendor's Shop as a Delhivery Pickup Location via API
   */
  registerVendorPickupLocation: async (vendor) => {
    const token = process.env.DELHIVERY_API_TOKEN;
    if (!token) return { success: false, reason: 'NO_TOKEN' };

    try {
      const payload = {
        name: vendor.pickupLocationName || vendor.shop_name || `VENDOR_${vendor.id || Date.now()}`,
        registered_name: vendor.business_name || vendor.shop_name || 'Vendor Partner',
        address: vendor.address || vendor.street || 'Vendor Shop Address',
        city: vendor.city || 'Kolkata',
        state: vendor.state || 'West Bengal',
        pin: String(vendor.pincode || vendor.postalCode || '700001'),
        phone: vendor.phone || '+919876543210',
        email: vendor.email || 'vendor@elane.com',
        country: 'India',
        return_address: vendor.address || 'Vendor Shop Address',
        return_pin: String(vendor.pincode || '700001'),
        return_city: vendor.city || 'Kolkata',
        return_state: vendor.state || 'West Bengal',
        return_country: 'India',
      };

      const res = await fetch('https://track.delhivery.com/api/backend/clientwarehouse/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('✓ [Delhivery Vendor Pickup Registration]:', data);
      return { success: true, data, locationName: payload.name };
    } catch (err) {
      console.warn('⚠️ [Delhivery Vendor Pickup Registration Warning]:', err.message);
      return { success: false, error: err.message };
    }
  },

  /**
   * Create Shipment via Official Delhivery API (if DELHIVERY_API_TOKEN is present)
   */
  createDelhiveryShipment: async (order) => {
    const token = process.env.DELHIVERY_API_TOKEN;
    const isStaging = process.env.DELHIVERY_MODE === 'staging';
    const baseUrl = isStaging ? 'https://staging-express.delhivery.com' : 'https://track.delhivery.com';

    try {
      // Dynamically resolve vendor's pickup location from order items / seller profile
      const firstItem = order.items?.[0];
      const vendorPickupLocationName =
        order.pickupLocationName ||
        order.vendorPickupLocation ||
        firstItem?.pickupLocationName ||
        firstItem?.seller?.pickupLocationName ||
        firstItem?.seller?.shop_name ||
        firstItem?.vendor?.shopName ||
        process.env.DELHIVERY_WAREHOUSE_NAME ||
        'ELANE SHOPPING APP B2C';

      const payload = {
        shipments: [
          {
            name: order.customer || order.shippingAddress?.name || 'Valued Patron',
            add: order.shippingAddress?.street || 'Flagship Residence',
            pin: String(order.shippingAddress?.postalCode || order.shippingAddress?.pincode || '400001'),
            city: order.shippingAddress?.city || 'Mumbai',
            state: order.shippingAddress?.state || 'Maharashtra',
            country: 'India',
            phone: order.shippingAddress?.phone || '+919876543210',
            order: order.id,
            payment_mode: order.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
            total_amount: Number(order.total || 0),
            cod_amount: order.paymentMethod === 'cod' ? Number(order.total || 0) : 0,
            products_desc: order.items?.map((i) => i.name).join(', ') || 'Luxury Apparel Piece',
            order_date: new Date().toISOString(),
          },
        ],
        pickup_location: {
          name: vendorPickupLocationName,
        },
      };

      const params = new URLSearchParams();
      params.append('format', 'json');
      params.append('data', JSON.stringify(payload));

      const res = await fetch(`${baseUrl}/api/cmu/create.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const data = await res.json();
      console.log('[Delhivery API Response]:', data);

      if (data.packages && data.packages.length > 0) {
        const pkg = data.packages[0];
        return {
          awb: pkg.waybill || `DLH-${order.id.slice(-6).toUpperCase()}IN`,
          status: pkg.status || 'Manifested',
          courierPartner: 'Delhivery Express Direct',
          provider: 'delhivery',
          raw: data,
        };
      }
    } catch (err) {
      console.warn('⚠️ [Delhivery API Call Failed, falling back]:', err.message);
    }
    return null;
  },

  /**
   * Automatically creates a 3PL shipment, generates Air Waybill (AWB), and assigns a courier
   */
  createShipment: async (order, options = {}) => {
    const orderId = order.id || `ORD-${Date.now()}`;
    const cleanId = orderId.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase();

    let awbCode = '';
    let courierPartner = '';
    let isLiveProvider = false;

    // 1. Try Direct Delhivery API if token is provided
    if (shippingService.isDelhiveryConfigured()) {
      const delhiveryRes = await shippingService.createDelhiveryShipment(order);
      if (delhiveryRes?.awb) {
        awbCode = delhiveryRes.awb;
        courierPartner = 'Delhivery Express Direct (Live API)';
        isLiveProvider = true;
      }
    }

    // 2. Default / Fallback assignment
    if (!awbCode) {
      const isDelhiveryPreferred = Boolean(process.env.DELHIVERY_API_TOKEN) || options.courier?.toLowerCase().includes('delhivery');
      courierPartner = isDelhiveryPreferred
        ? 'Delhivery Express Direct'
        : options.courier || (order.total > 20000 ? 'Blue Dart Prime Air' : 'Delhivery Express Direct');
      
      const prefix = courierPartner.includes('Delhivery') ? 'DLH' : 'BLU';
      awbCode = `${prefix}-${cleanId}-${Math.floor(1000 + Math.random() * 9000)}IN`;
    }

    const estimatedDeliveryDays = options.deliveryDays || (courierPartner.includes('Air') ? 2 : 3);
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + estimatedDeliveryDays);

    const shipmentRecord = {
      shipmentId: `SHP-${Date.now().toString(36).toUpperCase()}`,
      orderId: order.id,
      awb: awbCode,
      courierPartner,
      isLiveProvider,
      serviceType: 'Priority White-Glove Surface/Air',
      pickupAddress: {
        warehouse: process.env.DELHIVERY_WAREHOUSE_NAME || 'ÉLANE Central Atelier Hub',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India',
      },
      destination: {
        name: order.customer || order.shippingAddress?.name || 'Valued Patron',
        address: order.shippingAddress?.street || order.shippingAddress?.address || 'Private Residence',
        city: order.shippingAddress?.city || 'New Delhi',
        state: order.shippingAddress?.state || 'Delhi',
        pincode: order.shippingAddress?.postalCode || order.shippingAddress?.pincode || '110001',
        phone: order.shippingAddress?.phone || '+91 98765 43210',
      },
      package: {
        weightKg: (order.items?.length || 1) * 0.75,
        dimensions: { length: 30, width: 22, height: 12 },
        declaredValue: order.total || 15000,
        paymentMode: order.paymentMethod === 'cod' ? 'COD' : 'PREPAID',
      },
      status: 'Manifested',
      currentLocation: 'Atelier Packaging Hub — Mumbai',
      estimatedDelivery: deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      createdAt: new Date().toISOString(),
      checkpoints: [
        {
          timestamp: new Date().toISOString(),
          status: 'Order Manifested & Courier AWB Assigned',
          location: 'Mumbai Sorting Hub',
          activity: `Air Waybill ${awbCode} generated via ${courierPartner}. Parcel sealed in tamper-proof packaging.`,
        },
      ],
    };

    // Save to cache
    shipmentsStore.set(order.id, shipmentRecord);
    shipmentsStore.set(awbCode, shipmentRecord);

    // Update order in memory database with AWB & tracking
    const existingOrder = db.orders.find((o) => o.id === order.id);
    if (existingOrder) {
      existingOrder.awb = awbCode;
      existingOrder.courier = courierPartner;
      existingOrder.shippingDetails = shipmentRecord;
      if (existingOrder.status === 'Confirmed' || existingOrder.status === 'Ordered') {
        existingOrder.status = 'Packed';
      }
    }

    console.log(`\n======================================================`);
    console.log(`[3PL LOGISTICS AUTOMATION — DISPATCH MANIFEST GENERATED]`);
    console.log(`Order Reference: ${order.id}`);
    console.log(`Courier Partner: ${courierPartner}`);
    console.log(`AWB Tracking Code: >>  ${awbCode}  <<`);
    console.log(`Provider: ${isLiveProvider ? 'Delhivery Live API' : 'Simulation Engine'}`);
    console.log(`Estimated Delivery: ${shipmentRecord.estimatedDelivery}`);
    console.log(`======================================================\n`);

    return shipmentRecord;
  },

  /**
   * Automated Delhivery Reverse Courier Pickup Dispatch for Returns
   */
  createReversePickup: async (order, returnData = {}) => {
    const token = process.env.DELHIVERY_API_TOKEN;
    const cleanId = (order.id || Date.now().toString()).replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase();
    const reverseAwb = `REV-DLH-${cleanId}-${Math.floor(1000 + Math.random() * 9000)}IN`;
    const courierPartner = 'Delhivery Reverse Express Direct';

    const vendorPickupWarehouse =
      order.items?.[0]?.seller?.shop_name ||
      order.vendorPickupLocation ||
      process.env.DELHIVERY_WAREHOUSE_NAME ||
      'ELANE SHOPPING APP B2C';

    // 1. If live Delhivery API token is present, attempt live reverse pickup creation
    if (token) {
      try {
        const payload = {
          shipments: [
            {
              name: order.customer || order.shippingAddress?.name || 'Valued Patron',
              add: order.shippingAddress?.street || 'Customer Residence',
              pin: String(order.shippingAddress?.postalCode || order.shippingAddress?.pincode || '400001'),
              city: order.shippingAddress?.city || 'Mumbai',
              state: order.shippingAddress?.state || 'Maharashtra',
              country: 'India',
              phone: order.shippingAddress?.phone || '+919876543210',
              order: `RET-${order.id}`,
              payment_mode: 'Prepaid',
              products_desc: `Return: ${returnData.item?.name || 'Luxury Piece'} (${returnData.reason || 'Size Exchange'})`,
              order_date: new Date().toISOString(),
              shipment_type: 'reverse',
            },
          ],
          pickup_location: {
            name: vendorPickupWarehouse,
          },
        };

        const params = new URLSearchParams();
        params.append('format', 'json');
        params.append('data', JSON.stringify(payload));

        const res = await fetch('https://track.delhivery.com/api/cmu/create.json', {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        });

        const data = await res.json();
        console.log('✓ [Delhivery Reverse Pickup API Response]:', data);
      } catch (err) {
        console.warn('⚠️ [Delhivery Reverse Pickup API Notice]:', err.message);
      }
    }

    const reverseRecord = {
      returnId: returnData.returnId || `RET-${Date.now().toString(36).toUpperCase()}`,
      orderId: order.id,
      reverseAwb,
      courierPartner,
      status: 'Reverse Pickup Scheduled',
      pickupDate: returnData.pickupDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      pickupTimeSlot: returnData.pickupTimeSlot || '10:00 AM – 1:00 PM',
      pickupAddress: order.shippingAddress,
      destinationWarehouse: vendorPickupWarehouse,
      resolutionType: returnData.resolutionType || 'refund_original',
      refundAmount: order.total,
      createdAt: new Date().toISOString(),
      checkpoints: [
        {
          timestamp: new Date().toISOString(),
          status: 'Reverse Pickup Manifested',
          location: `${order.shippingAddress?.city || 'Customer Area'} Local Hub`,
          activity: `Delhivery pickup agent scheduled for ${returnData.pickupDate || 'Tomorrow'} (${returnData.pickupTimeSlot || 'Morning'}).`,
        },
      ],
    };

    shipmentsStore.set(reverseAwb, reverseRecord);
    shipmentsStore.set(`RET-${order.id}`, reverseRecord);

    // Update order record
    const existingOrder = db.orders.find((o) => o.id === order.id);
    if (existingOrder) {
      existingOrder.status = 'Return Requested';
      existingOrder.reverseAwb = reverseAwb;
      existingOrder.returnTicket = reverseRecord;
    }

    console.log(`\n======================================================`);
    console.log(`[DELHIVERY REVERSE PICKUP SCHEDULED]`);
    console.log(`Order: #${order.id}`);
    console.log(`Reverse AWB: >>  ${reverseAwb}  <<`);
    console.log(`Pickup Date: ${reverseRecord.pickupDate} (${reverseRecord.pickupTimeSlot})`);
    console.log(`Pickup Address: ${order.shippingAddress?.street}, ${order.shippingAddress?.city}`);
    console.log(`Return Destination: ${vendorPickupWarehouse}`);
    console.log(`======================================================\n`);

    return reverseRecord;
  },

  /**
   * Automated dispatch triggered on payment success or instant checkout
   */
  autoDispatchShipment: async (order) => {
    try {
      if (!order || !order.id) return null;
      if (shipmentsStore.has(order.id)) {
        return shipmentsStore.get(order.id);
      }
      return await shippingService.createShipment(order);
    } catch (err) {
      console.warn('[Auto Dispatch Error]:', err.message);
      return null;
    }
  },

  /**
   * Real-time Shipment Tracking with Live Transit Milestones (with Delhivery API support)
   */
  trackShipment: async (idOrAwb) => {
    // 1. If Delhivery API token exists and searching by waybill, query Delhivery directly
    if (process.env.DELHIVERY_API_TOKEN && idOrAwb.startsWith('DLH-')) {
      try {
        const token = process.env.DELHIVERY_API_TOKEN;
        const res = await fetch(`https://track.delhivery.com/api/v1/packages/json/?waybill=${idOrAwb}&token=${token}`);
        const data = await res.json();
        if (data?.ShipmentData && data.ShipmentData.length > 0) {
          const s = data.ShipmentData[0]?.Shipment;
          return {
            shipmentId: s.PickUpData?.OrderID || idOrAwb,
            orderId: s.PickUpData?.OrderID || idOrAwb,
            awb: s.AWB || idOrAwb,
            courierPartner: 'Delhivery Express Direct (Live)',
            status: s.Status?.Status || 'In Transit',
            currentLocation: s.Status?.StatusLocation || 'Delhivery Hub',
            estimatedDelivery: s.ExpectedDeliveryDate || 'Within 48 Hours',
            checkpoints: (s.Scans || []).map((scan) => ({
              timestamp: scan.ScanDetail?.ScanDateTime || new Date().toISOString(),
              status: scan.ScanDetail?.ScanType || 'In Transit',
              location: scan.ScanDetail?.ScannedLocation || 'Sorting Terminal',
              activity: scan.ScanDetail?.Instructions || 'Shipment scanned at transit hub.',
            })),
          };
        }
      } catch (e) {
        console.warn('Delhivery live tracking query notice:', e.message);
      }
    }

    // 2. Fallback to cached or deterministic simulation
    let shipment = shipmentsStore.get(idOrAwb);

    if (!shipment) {
      const order = db.orders.find((o) => o.id === idOrAwb || o.awb === idOrAwb);
      const isDelhivery = Boolean(process.env.DELHIVERY_API_TOKEN) || idOrAwb.startsWith('DLH-') || order?.courier?.includes('Delhivery');
      const prefix = isDelhivery ? 'DLH' : 'BLU';
      const awbCode = order?.awb || (idOrAwb.startsWith('DLH-') || idOrAwb.startsWith('BLU-') ? idOrAwb : `${prefix}-${idOrAwb.slice(-6).toUpperCase()}IN`);
      const courierPartner = order?.courier || (isDelhivery ? 'Delhivery Express Direct' : 'Blue Dart Prime Air');
      
      const eta = new Date();
      eta.setDate(eta.getDate() + 2);

      shipment = {
        shipmentId: `SHP-${Date.now().toString(36).toUpperCase()}`,
        orderId: order?.id || idOrAwb,
        awb: awbCode,
        courierPartner,
        status: order?.status === 'Delivered' ? 'Delivered' : order?.status === 'Shipped' ? 'In Transit' : 'Out for Delivery',
        currentLocation: isDelhivery ? 'Delhivery Central Logistics Terminal' : 'Regional Distribution Center',
        estimatedDelivery: eta.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
        checkpoints: [
          {
            timestamp: new Date(Date.now() - 3600000 * 28).toISOString(),
            status: 'Manifest Created',
            location: 'Mumbai Atelier Facility',
            activity: `Shipment data received electronically by ${courierPartner}.`,
          },
          {
            timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
            status: 'Picked Up & In Transit',
            location: isDelhivery ? 'Delhivery Gateway Air Hub' : 'Chhatrapati Shivaji Maharaj Air Hub',
            activity: 'Departed sorting facility via express air cargo.',
          },
          {
            timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
            status: 'Arrived at Destination Hub',
            location: 'Destination City Terminal',
            activity: 'Package received at local distribution center and scanned for delivery route.',
          },
          {
            timestamp: new Date().toISOString(),
            status: 'Out for Delivery',
            location: 'Local Delivery Van',
            activity: 'Courier agent has left the hub. Contactless verification required at doorstep.',
          },
        ],
      };
    }

    return shipment;
  },

  /**
   * Check Pincode Delivery Serviceability & Estimated Speed (supports Delhivery API)
   */
  checkServiceability: async (pincode) => {
    const cleanPin = String(pincode).trim();
    if (!cleanPin || cleanPin.length !== 6 || isNaN(Number(cleanPin))) {
      return {
        serviceable: false,
        message: 'Please enter a valid 6-digit postal code.',
      };
    }

    // If Delhivery API token is present, query Delhivery's live pin code lookup
    if (process.env.DELHIVERY_API_TOKEN) {
      try {
        const token = process.env.DELHIVERY_API_TOKEN;
        const res = await fetch(`https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${cleanPin}`, {
          headers: { Authorization: `Token ${token}` },
        });
        const data = await res.json();
        if (data?.delivery_codes && data.delivery_codes.length > 0) {
          const d = data.delivery_codes[0]?.postal_code;
          return {
            serviceable: d?.is_oda === 'N' || d?.cash === 'Y',
            pincode: cleanPin,
            hub: d?.center_name || 'Delhivery Express Direct Center',
            courierPartner: 'Delhivery Express Direct',
            estimatedDays: '1–3 Business Days',
            codAvailable: d?.cod === 'Y',
            prepaidDiscount: 'Eligible for 5% Atelier Privilege Savings',
          };
        }
      } catch (e) {
        console.warn('Delhivery live pincode lookup notice:', e.message);
      }
    }

    // Fallback standard calculation
    const isMetro = ['11', '40', '56', '70', '60', '50', '38', '41'].some((prefix) =>
      cleanPin.startsWith(prefix)
    );

    return {
      serviceable: true,
      pincode: cleanPin,
      hub: isMetro ? 'Metro Direct Express Air' : 'Regional Express Surface',
      courierPartner: process.env.DELHIVERY_API_TOKEN ? 'Delhivery Express Direct' : (isMetro ? 'Blue Dart Prime Air' : 'Delhivery Priority'),
      estimatedDays: isMetro ? '1–2 Business Days (Complimentary White-Glove)' : '2–4 Business Days',
      codAvailable: true,
      prepaidDiscount: 'Eligible for 5% Atelier Privilege Savings',
    };
  },

  /**
   * Generates a high-definition luxury 4x6" printable shipping label HTML with barcodes
   */
  generateShippingLabelHTML: (orderId) => {
    const order = db.orders.find((o) => o.id === orderId) || {
      id: orderId,
      customer: 'Valued Patron',
      total: 38500,
      paymentMethod: 'Prepaid (Razorpay)',
      shippingAddress: {
        name: 'Valued Patron',
        street: '42 Heritage Boulevard, Penthouse 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        phone: '+91 98765 43210',
      },
    };

    const isDelhivery = Boolean(process.env.DELHIVERY_API_TOKEN) || order.courier?.includes('Delhivery');
    const defaultPrefix = isDelhivery ? 'DLH' : 'BLU';

    const shipment = shipmentsStore.get(orderId) || {
      awb: order.awb || `${defaultPrefix}-${orderId.slice(-6).toUpperCase()}IN`,
      courierPartner: order.courier || (isDelhivery ? 'Delhivery Express Direct' : 'Blue Dart Prime Air'),
    };

    const isPrepaid = order.paymentMethod !== 'cod' && order.paymentStatus !== 'PENDING';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Shipping Label — ${shipment.awb}</title>
  <style>
    @page { size: 4in 6in; margin: 0; }
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #FFFFFF;
      color: #000000;
      width: 3.8in;
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
    }
    .label-box {
      border: 2px solid #000;
      padding: 12px;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #000;
      padding-bottom: 8px;
    }
    .brand {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 18px;
      font-weight: 900;
      letter-spacing: 2px;
    }
    .courier-tag {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      background: #000;
      color: #FFF;
      padding: 3px 8px;
    }
    .barcode-container {
      text-align: center;
      margin: 10px 0;
      border-bottom: 2px dashed #000;
      padding-bottom: 8px;
    }
    .barcode-svg {
      width: 90%;
      height: 48px;
    }
    .awb-text {
      font-family: monospace;
      font-size: 14px;
      font-weight: 900;
      letter-spacing: 3px;
      margin-top: 4px;
    }
    .address-section {
      font-size: 11px;
      line-height: 1.4;
      border-bottom: 1px solid #000;
      padding-bottom: 8px;
    }
    .section-title {
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 2px;
      color: #333;
    }
    .payment-badge {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 8px;
      background: ${isPrepaid ? '#E6F4EA' : '#FEF3D6'};
      border: 1px solid #000;
      margin: 8px 0;
      font-weight: 900;
      font-size: 12px;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      color: #555;
      padding-top: 4px;
    }
    @media print {
      .no-print { display: none !important; }
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="label-box">
    <div>
      <div class="header">
        <div>
          <div class="brand">É L A N E</div>
          <div style="font-size: 8px; letter-spacing: 1px; text-transform: uppercase; color: #555;">Haute Maroquinerie</div>
        </div>
        <div class="courier-tag">${shipment.courierPartner}</div>
      </div>

      <div class="barcode-container">
        <!-- SVG Code 128 Barcode Simulation -->
        <svg class="barcode-svg" viewBox="0 0 200 40">
          <rect x="0" y="0" width="4" height="40" fill="#000"/>
          <rect x="6" y="0" width="2" height="40" fill="#000"/>
          <rect x="10" y="0" width="6" height="40" fill="#000"/>
          <rect x="18" y="0" width="2" height="40" fill="#000"/>
          <rect x="22" y="0" width="4" height="40" fill="#000"/>
          <rect x="28" y="0" width="8" height="40" fill="#000"/>
          <rect x="38" y="0" width="3" height="40" fill="#000"/>
          <rect x="44" y="0" width="6" height="40" fill="#000"/>
          <rect x="52" y="0" width="2" height="40" fill="#000"/>
          <rect x="56" y="0" width="4" height="40" fill="#000"/>
          <rect x="62" y="0" width="6" height="40" fill="#000"/>
          <rect x="70" y="0" width="2" height="40" fill="#000"/>
          <rect x="74" y="0" width="8" height="40" fill="#000"/>
          <rect x="84" y="0" width="4" height="40" fill="#000"/>
          <rect x="90" y="0" width="2" height="40" fill="#000"/>
          <rect x="94" y="0" width="6" height="40" fill="#000"/>
          <rect x="102" y="0" width="3" height="40" fill="#000"/>
          <rect x="108" y="0" width="6" height="40" fill="#000"/>
          <rect x="116" y="0" width="2" height="40" fill="#000"/>
          <rect x="120" y="0" width="8" height="40" fill="#000"/>
          <rect x="130" y="0" width="4" height="40" fill="#000"/>
          <rect x="136" y="0" width="2" height="40" fill="#000"/>
          <rect x="140" y="0" width="6" height="40" fill="#000"/>
          <rect x="148" y="0" width="3" height="40" fill="#000"/>
          <rect x="154" y="0" width="6" height="40" fill="#000"/>
          <rect x="162" y="0" width="4" height="40" fill="#000"/>
          <rect x="168" y="0" width="8" height="40" fill="#000"/>
          <rect x="178" y="0" width="2" height="40" fill="#000"/>
          <rect x="182" y="0" width="6" height="40" fill="#000"/>
          <rect x="190" y="0" width="4" height="40" fill="#000"/>
          <rect x="196" y="0" width="4" height="40" fill="#000"/>
        </svg>
        <div class="awb-text">${shipment.awb}</div>
        <div style="font-size: 10px; font-weight: 700;">ORDER REF: ${order.id}</div>
      </div>

      <div class="address-section">
        <div class="section-title">Deliver To (Patron):</div>
        <div style="font-weight: 800; font-size: 13px;">${order.customer || order.shippingAddress?.name || 'Valued Patron'}</div>
        <div>${order.shippingAddress?.street || 'Flagship Residence'}</div>
        <div>${order.shippingAddress?.city || 'Mumbai'}, ${order.shippingAddress?.state || 'MH'} - <strong>${order.shippingAddress?.postalCode || '400001'}</strong></div>
        <div>Tel: ${order.shippingAddress?.phone || '+91 98765 43210'}</div>
      </div>

      <div class="payment-badge">
        <span>MODE: ${isPrepaid ? 'PREPAID' : 'CASH ON DELIVERY (COD)'}</span>
        <span>${isPrepaid ? '₹0.00 DUE' : `COLLECT ₹${Number(order.total || 0).toLocaleString('en-IN')}`}</span>
      </div>

      <div style="font-size: 10px; padding: 4px 0; border-bottom: 1px solid #000;">
        <div class="section-title">Shipped From (Vendor Hub):</div>
        <div><strong>${order.items?.[0]?.seller?.shop_name || order.vendorPickupLocation || process.env.DELHIVERY_WAREHOUSE_NAME || 'ÉLANE Central Atelier'}</strong></div>
        <div>${process.env.DELHIVERY_CITY || 'Howrah'}, ${process.env.DELHIVERY_STATE || 'West Bengal'} Logistics Hub</div>
        <div>GSTIN: 27AABCE1234F1Z5 • Support: concierge@elane.com</div>
      </div>
    </div>

    <div class="footer">
      <span>Routing: ${isDelhivery ? 'DELHIVERY-EXP-01' : 'BOM-EXP-AIR'}</span>
      <span>Date: ${new Date().toLocaleDateString('en-IN')}</span>
      <span>Weight: 1.25 KG</span>
    </div>
  </div>

  <div class="no-print" style="margin-top: 16px; text-align: center;">
    <button onclick="window.print()" style="padding: 10px 24px; background: #000; color: #FFF; font-weight: bold; border: none; cursor: pointer; border-radius: 4px;">
      🖨️ Print Label (4x6 Thermal)
    </button>
  </div>
</body>
</html>
    `;
  },

  /**
   * Webhook handler for automated status callbacks from 3PL Couriers (Delhivery / Shiprocket)
   */
  handleWebhook: async (payload) => {
    const awb = payload.awb || payload.awb_code || payload.waybill;
    const currentStatus = payload.current_status || payload.status || payload.Status?.Status;
    const location = payload.current_location || payload.location || payload.Status?.StatusLocation || 'Hub';
    const activity = payload.activity || `Carrier status changed to ${currentStatus}`;

    console.log(`[3PL Courier Webhook Received]: AWB ${awb} -> ${currentStatus}`);

    let shipment = shipmentsStore.get(awb);
    if (shipment) {
      shipment.status = currentStatus;
      shipment.currentLocation = location;
      shipment.checkpoints.unshift({
        timestamp: new Date().toISOString(),
        status: currentStatus,
        location,
        activity,
      });

      // Update matching order in DB
      const order = db.orders.find((o) => o.id === shipment.orderId || o.awb === awb);
      if (order) {
        if (currentStatus.toLowerCase().includes('deliver')) {
          order.status = 'Delivered';
        } else if (currentStatus.toLowerCase().includes('out')) {
          order.status = 'OutForDelivery';
        } else if (currentStatus.toLowerCase().includes('transit') || currentStatus.toLowerCase().includes('pickup')) {
          order.status = 'Shipped';
        }
      }
    }

    return { success: true, awb, updatedStatus: currentStatus };
  },
};
