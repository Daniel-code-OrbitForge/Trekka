/**
 * Payment Service
 * 
 * Handles payment processing integration with payment gateways.
 * Supports Paystack, Flutterwave, and other payment providers.
 * 
 * SETUP INSTRUCTIONS:
 * 
 * PAYSTACK (Nigerian payments):
 * 1. Sign up at https://paystack.com
 * 2. Get API keys from Settings > API Keys & Webhooks
 * 3. Add to .env:
 *    PAYSTACK_SECRET_KEY=sk_test_xxxxx (use sk_live_xxxxx for production)
 *    PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
 * 
 * FLUTTERWAVE (African payments):
 * 1. Sign up at https://flutterwave.com
 * 2. Get API keys from Settings > API
 * 3. Add to .env:
 *    FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxxxx
 *    FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxxxx
 * 
 * STRIPE (International payments):
 * 1. Sign up at https://stripe.com
 * 2. Get API keys from Developers > API keys
 * 3. Add to .env:
 *    STRIPE_SECRET_KEY=sk_test_xxxxx
 */

const logger = require('../utils/logger');
const axios = require('axios');
const crypto = require('crypto');

// Helper: get Paystack secret key from env
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const FLUTTERWAVE_SECRET = process.env.FLUTTERWAVE_SECRET_KEY;
const FLUTTERWAVE_PUBLIC = process.env.FLUTTERWAVE_PUBLIC_KEY;

// Flutterwave API base URL
const FLUTTERWAVE_API_URL = 'https://api.flutterwave.com/v3';

/**
 * Initialize Flutterwave payment
 * 
 * @param {Object} paymentData
 * @param {String} paymentData.email - Customer email
 * @param {Number} paymentData.amount - Amount in smallest currency unit
 * @param {String} paymentData.currency - Currency code (NGN, USD, etc.)
 * @param {String} paymentData.tx_ref - Unique transaction reference
 * @param {String} paymentData.customer.name - Customer full name
 * @param {String} paymentData.customer.phone - Customer phone number
 * @returns {Promise<Object>}
 */
async function initializeFlutterwavePayment(paymentData) {
  try {
    const response = await axios.post(`${FLUTTERWAVE_API_URL}/payments`, {
      ...paymentData,
      public_key: FLUTTERWAVE_PUBLIC,
      payment_options: 'card,banktransfer,ussd',
      customizations: {
        title: 'Trekka Transport Booking',
        logo: 'https://yourtrekkalogo.com/logo.png' // Replace with actual logo URL
      },
      redirect_url: `${process.env.FRONTEND_URL}/payment/verify`
    }, {
      headers: {
        'Authorization': `Bearer ${FLUTTERWAVE_SECRET}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    logger.error('Flutterwave payment initialization failed:', error);
    throw new Error('Payment initialization failed');
  }
}

/**
 * Verify Flutterwave payment
 * 
 * @param {String} transactionId - Flutterwave transaction ID
 * @returns {Promise<Object>}
 */
async function verifyFlutterwavePayment(transactionId) {
  try {
    const response = await axios.get(
      `${FLUTTERWAVE_API_URL}/transactions/${transactionId}/verify`,
      {
        headers: {
          'Authorization': `Bearer ${FLUTTERWAVE_SECRET}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    logger.error('Flutterwave payment verification failed:', error);
    throw new Error('Payment verification failed');
  }
}

/**
 * Verify Flutterwave webhook signature
 * 
 * @param {String} signature - Signature from webhook header
 * @param {Object} payload - Webhook payload
 * @returns {Boolean}
 */
function verifyFlutterwaveWebhook(signature, payload) {
  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify(payload) + FLUTTERWAVE_SECRET)
    .digest('hex');

  return hash === signature;
}

/**
 * Initialize Paystack payment
 * 
 * @param {Object} paymentData
 * @param {String} paymentData.email - Customer email
 * @param {Number} paymentData.amount - Amount in kobo (multiply NGN by 100)
 * @param {String} paymentData.reference - Unique payment reference
 * @returns {Promise<Object>}
 */
async function initializePaystackPayment(paymentData) {
  try {
    logger.info('Initializing Paystack payment:', paymentData.reference);
    if (!PAYSTACK_SECRET) {
      logger.warn('PAYSTACK_SECRET_KEY not set in environment. Returning placeholder response.');
      return {
        success: true,
        data: {
          authorization_url: 'https://checkout.paystack.com/xxxxx',
          access_code: 'xxxxx',
          reference: paymentData.reference
        }
      };
    }

    // Real API call to Paystack
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: paymentData.email,
        amount: paymentData.amount, // Paystack expects amount in kobo
        reference: paymentData.reference,
        callback_url: paymentData.callback_url
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      data: response.data.data
    };
    
  } catch (error) {
    logger.error('Paystack payment initialization failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Verify Paystack payment
 * 
 * @param {String} reference - Payment reference
 * @returns {Promise<Object>}
 */
async function verifyPaystackPayment(reference) {
  try {
    logger.info('Verifying Paystack payment:', reference);
    if (!PAYSTACK_SECRET) {
      logger.warn('PAYSTACK_SECRET_KEY not set in environment. Returning placeholder verification.');
      return {
        success: true,
        data: {
          status: 'success',
          reference,
          amount: 10000,
          paid_at: new Date().toISOString()
        }
      };
    }

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`
        }
      }
    );

    return {
      success: true,
      data: response.data.data
    };
    
  } catch (error) {
    logger.error('Paystack payment verification failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Process refund for Flutterwave payment
 * 
 * @param {String} transactionId - Flutterwave transaction ID
 * @param {Number} amount - Amount to refund
 * @returns {Promise<Object>}
 */
async function refundFlutterwavePayment(transactionId, amount) {
  try {
    const response = await axios.post(
      `${FLUTTERWAVE_API_URL}/transactions/${transactionId}/refund`,
      { amount },
      {
        headers: {
          'Authorization': `Bearer ${FLUTTERWAVE_SECRET}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    logger.error('Flutterwave refund failed:', error);
    throw new Error('Refund processing failed');
  }
}

/**
 * Process refund (generic/paystack example)
 */
async function processRefund(paymentReference, amount) {
  try {
    logger.info('Processing refund:', paymentReference);
    if (!PAYSTACK_SECRET) {
      logger.warn('PAYSTACK_SECRET_KEY not set; refund will be mocked');
      return {
        success: true,
        message: 'Refund processed (mock)'
      };
    }

    const response = await axios.post(
      'https://api.paystack.co/refund',
      {
        transaction: paymentReference,
        amount
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`
        }
      }
    );

    return {
      success: true,
      data: response.data
    };
    
  } catch (error) {
    logger.error('Refund processing failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Webhook signature verification helper (Paystack uses X-Paystack-Signature header)
function verifyPaystackSignature(rawBody, signature) {
  try {
    if (!PAYSTACK_SECRET) return false;
    // Compute HMAC SHA-512 of raw body using secret key
    const hash = crypto.createHmac('sha512', PAYSTACK_SECRET).update(rawBody).digest('hex');
    return hash === signature;
  } catch (err) {
    logger.error('Error verifying Paystack signature', err.message);
    return false;
  }
}

/**
 * Verify Paystack webhook wrapper (keeps naming consistent)
 * @param {String} rawBody - raw request body (string or buffer)
 * @param {String} signature - value of X-Paystack-Signature header
 * @returns {Boolean}
 */
function verifyPaystackWebhook(rawBody, signature) {
  return verifyPaystackSignature(rawBody, signature);
}

// Export payment service functions
module.exports = {
  // Paystack functions
  initializePaystackPayment,
  verifyPaystackPayment,
  verifyPaystackWebhook,
  verifyPaystackSignature,

  // Flutterwave functions
  initializeFlutterwavePayment,
  verifyFlutterwavePayment,
  verifyFlutterwaveWebhook,
  refundFlutterwavePayment,

  // Misc
  processRefund
};
