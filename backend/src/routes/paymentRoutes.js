/**
 * Payment Routes
 * 
 * @route /api/payments
 */

const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const {
  initializePayment,
  verifyPayment,
  getPaymentHistory,
  requestRefund,
  handleWebhook
} = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

/**
 * @route   POST /api/payments/initialize
 * @desc    Initialize payment for booking through Paystack or Flutterwave
 * @access  Private
 */
router.post(
  '/initialize',
  protect,
  [
    check('bookingId', 'bookingId is required').not().isEmpty(),
    check('paymentMethod')
      .isIn(['card', 'bank_transfer', 'ussd', 'mobile_money'])
      .withMessage('Invalid payment method'),
    check('amount').optional().isNumeric().withMessage('Amount must be a number'),
    check('email').optional().isEmail().withMessage('Invalid email format'),
    check('preferredGateway')
      .optional()
      .isIn(['paystack', 'flutterwave'])
      .withMessage('Invalid payment gateway')
  ],
  initializePayment
);

/**
 * @route   GET /api/payments/verify/:reference
 * @desc    Verify payment status from any gateway
 * @access  Private
 */
router.get('/verify/:reference', protect, verifyPayment);

/**
 * @route   POST /api/payments/webhook
 * @desc    Webhook endpoint for payment gateways (Paystack/Flutterwave)
 * @access  Public (controller should verify signature)
 */
// Use raw body parsing so signature verification can use the exact payload
router.post('/webhook', express.raw({ type: '*/*' }), handleWebhook);

/**
 * @route   GET /api/payments
 * @desc    Get payment history
 * @access  Private
 */
router.get('/', protect, getPaymentHistory);

/**
 * @route   POST /api/payments/:id/refund
 * @desc    Process refund through appropriate gateway
 * @access  Private - Admin only
 */
router.post(
  '/:id/refund',
  protect,
  [
    check('amount')
      .optional()
      .isNumeric()
      .withMessage('Refund amount must be a number'),
    check('reason')
      .not()
      .isEmpty()
      .withMessage('Refund reason is required')
  ],
  requestRefund
);

module.exports = router;
