import dotenv from 'dotenv';

dotenv.config();

export const paymentConfig = {
  cashfree: {
    appId: process.env.CASHFREE_APP_ID,
    secretKey: process.env.CASHFREE_SECRET_KEY,
    mode: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'TEST',
    webhookSecret: process.env.CASHFREE_WEBHOOK_SECRET
  }
}; 