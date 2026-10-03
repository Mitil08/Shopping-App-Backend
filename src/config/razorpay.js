import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

let razorpay = null;

if (keyId && keySecret) {
  try {
    razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
    console.log('✓ Razorpay SDK initialized successfully with key:', keyId);
  } catch (err) {
    console.warn('⚠️ Razorpay initialization warning:', err.message);
  }
} else {
  console.warn('⚠️ RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET missing in environment variables.');
}

export default razorpay;
