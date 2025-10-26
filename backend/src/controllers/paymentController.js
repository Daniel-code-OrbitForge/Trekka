/**
 * Payment Controller
 * 
 * Handles payment operations: initialize, verify, refund payments.
 */

const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');
const Payment = require('../models/paymentModel');
const {
  initializePaystackPayment,
  verifyPaystackPayment,
  processRefund,
  verifyPaystackSignature
} = require('../services/paymentService');
const { validationResult } = require('express-validator');

/**
 * Initialize payment
 * @route POST /api/payments/initialize
 * @access Private
 */
async function initializePayment(req, res) {
  try {
    // Validate request input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, 'Validation error', errors.array());
    }

    const { bookingId, paymentMethod, amount, email } = req.body;
    const userId = req.user?._id || req.userId;

    logger.info(`Initializing payment for booking: ${bookingId}`);

    // Create a payment record in DB with status 'pending'
    const payment = await Payment.create({
      bookingId,
      userId,
      amount: amount || 0,
      currency: 'NGN',
      paymentMethod: paymentMethod || 'card',
      gateway: 'paystack',
      status: 'pending'
    });

    // Prepare payment data for gateway
    const paymentData = {
      email: email || req.user?.email,
      amount: (amount || 0) * 100, // convert to kobo for Paystack
      reference: payment.transactionReference,
      callback_url: `${req.protocol}://${req.get('host')}/api/payments/verify/${payment.transactionReference}`
    };

    // Call payment service to initialize
    const initResult = await initializePaystackPayment(paymentData);

    if (!initResult.success) {
      // Mark payment as failed
      payment.status = 'failed';
      payment.failureReason = initResult.error || 'Gateway init failed';
      await payment.save();
      return sendError(res, 500, 'Could not initialize payment');
    }

    // Return the authorization URL to frontend
    sendSuccess(res, 200, 'Payment initialized', {
      paymentUrl: initResult.data.authorization_url,
      reference: payment.transactionReference,
      access_code: initResult.data.access_code || null
    });
    
  } catch (error) {
    logger.error('Initialize payment error:', error.message);
    sendError(res, 500, error.message);
  }
}

/**
 * Verify payment
 * @route GET /api/payments/verify/:reference
 * @access Private
 */
async function verifyPayment(req, res) {
  try {
    const { reference } = req.params;

    logger.info(`Verifying payment: ${reference}`);

    // Verify with gateway
    const verifyResult = await verifyPaystackPayment(reference);

    if (!verifyResult.success) {
      return sendError(res, 500, 'Failed to verify payment');
    }

    const data = verifyResult.data;

    // Update payment record in DB
    const payment = await Payment.findOne({ transactionReference: reference });
    if (!payment) return sendError(res, 404, 'Payment not found');

    payment.gatewayReference = data.reference || data.id || payment.gatewayReference;
    payment.gatewayResponse = data;
    payment.status = data.status === 'success' || data.status === 'paid' ? 'success' : 'failed';
    if (payment.status === 'success') payment.completedAt = new Date();
    await payment.save();

    // TODO: Update booking status and send confirmation email

    sendSuccess(res, 200, 'Payment verified', { status: payment.status, reference });
    
  } catch (error) {
    logger.error('Verify payment error:', error.message);
    sendError(res, 500, error.message);
  }
}

/**
 * Get payment history
 * @route GET /api/payments
 * @access Private
 */
async function getPaymentHistory(req, res) {
  try {
    const userId = req.user?._id || req.userId;

    logger.info(`Fetching payment history for user: ${userId}`);

    const payments = await Payment.find({ userId }).sort({ createdAt: -1 }).limit(100);

    sendSuccess(res, 200, 'Payment history retrieved', { payments });
    
  } catch (error) {
    logger.error('Get payment history error:', error.message);
    sendError(res, 500, error.message);
  }
}

/**
 * Request refund
 * @route POST /api/payments/:id/refund
 * @access Private
 */
async function requestRefund(req, res) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendError(res, 400, 'Validation error', errors.array());

    logger.info(`Refund requested for payment: ${id}`);

    const payment = await Payment.findById(id);
    if (!payment) return sendError(res, 404, 'Payment not found');
    if (payment.status !== 'success') return sendError(res, 400, 'Only successful payments can be refunded');

    // Call gateway refund
    const refundResult = await processRefund(payment.gatewayReference || payment.transactionReference, payment.amount);

    if (!refundResult.success) return sendError(res, 500, 'Refund failed');

    // Update payment refund info
    payment.refund = payment.refund || {};
    payment.refund.refundReference = refundResult.data?.data?.reference || refundResult.data?.reference || 'REF-MOCK';
    payment.refund.refundAmount = payment.amount;
    payment.refund.refundedAt = new Date();
    payment.refund.refundStatus = 'completed';
    payment.status = 'refunded';
    await payment.save();

    sendSuccess(res, 200, 'Refund processed', { paymentId: id, refund: payment.refund });
    
  } catch (error) {
    logger.error('Request refund error:', error.message);
    sendError(res, 500, error.message);
  }
}

/**
 * Webhook handler for payment gateways
 * @route POST /api/payments/webhook
 * @access Public (but should verify webhook signature)
 */
async function handleWebhook(req, res) {
  try {
    // Raw body is required to verify signature. Payment routes configured to use express.raw
    const rawBody = req.body;

    // Paystack (example) sends signature in header 'x-paystack-signature'
    const signature = req.headers['x-paystack-signature'] || req.headers['X-Paystack-Signature'];

    // Verify signature (service helper)
    if (signature) {
      const verified = verifyPaystackSignature(req.rawBody || req.body, signature);
      if (!verified) {
        logger.warn('Invalid Paystack webhook signature');
        return res.status(400).send('Invalid signature');
      }
    }

    const event = req.body;
    logger.info('Payment webhook received:', event.event || event.type || 'unknown');

    // Typical Paystack event: { event: 'charge.success', data: { reference: '...', status: 'success', ... } }
    const eventType = event.event || event.type;
    const data = event.data || event;

    if (eventType && eventType.toLowerCase().includes('charge.success')) {
      const reference = data.reference;
      const payment = await Payment.findOne({ transactionReference: reference });
      if (payment) {
        payment.status = 'success';
        payment.gatewayReference = data.reference || payment.gatewayReference;
        payment.gatewayResponse = data;
        payment.completedAt = new Date();
        await payment.save();
      }
    }

    // Respond quickly to webhook provider
    return res.status(200).send('OK');
    
  } catch (error) {
    logger.error('Webhook error:', error.message);
    sendError(res, 500, error.message);
  }
}

module.exports = {
  initializePayment,
  verifyPayment,
  getPaymentHistory,
  requestRefund,
  handleWebhook
};
