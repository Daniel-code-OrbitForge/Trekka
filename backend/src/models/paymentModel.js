/**
 * Payment Model
 * 
 * Tracks all payment transactions in the Trekka platform.
 * Supports multiple payment gateways (Paystack, Flutterwave, etc.)
 */

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // Transaction Reference
  transactionReference: {
    type: String,
    unique: true,
    required: true,
    uppercase: true
  },
  
  // Related Booking
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  
  // Payer Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Amount Details
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  
  currency: {
    type: String,
    default: 'NGN',
    enum: ['NGN', 'USD', 'GBP', 'EUR']
  },
  
  // Payment Gateway Information
  gateway: {
    type: String,
    enum: ['paystack', 'flutterwave'],
    required: true
  },

  // Gateway-specific Transaction IDs
  gatewayTransactionId: {
    type: String,
    sparse: true // Allows null/undefined while maintaining uniqueness for non-null values
  },

  // Payment Method
  paymentMethod: {
    type: String,
    enum: ['card', 'bank_transfer', 'ussd', 'mobile_money', 'cash', 'wallet'],
    required: true
  },
  
  // Payment Gateway
  gateway: {
    type: String,
    enum: ['paystack', 'flutterwave', 'stripe', 'manual'],
    default: 'paystack'
  },
  
  // Gateway Response
  gatewayReference: {
    type: String, // Reference from payment gateway
    unique: true,
    sparse: true
  },
  
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed, // Store gateway response object
    default: null
  },
  
  // Payment Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'success', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  
  // Card Details (if applicable, stores minimal info for security)
  cardDetails: {
    lastFourDigits: String,
    cardType: String, // visa, mastercard, etc.
    bank: String
  },
  
  // Timestamps for payment flow
  initiatedAt: {
    type: Date,
    default: Date.now
  },
  
  completedAt: {
    type: Date,
    default: null
  },
  
  failedAt: {
    type: Date,
    default: null
  },
  
  // Failure Information
  failureReason: String,
  
  // Refund Information
  refund: {
    refundReference: String,
    refundAmount: Number,
    refundedAt: Date,
    refundReason: String,
    refundStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed']
    }
  },
  
  // Additional Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // IP Address for security/fraud detection
  ipAddress: String,
  
  // User Agent
  userAgent: String,
  
  // Notification Status
  notifications: {
    email: {
      paymentReceipt: {
        sent: { type: Boolean, default: false },
        sentAt: Date,
        error: String
      },
      bookingPass: {
        sent: { type: Boolean, default: false },
        sentAt: Date,
        error: String
      }
    },
    sms: {
      paymentConfirmation: {
        sent: { type: Boolean, default: false },
        sentAt: Date,
        error: String
      },
      bookingConfirmation: {
        sent: { type: Boolean, default: false },
        sentAt: Date,
        error: String
      }
    }
  }

}, {
  timestamps: true
});

// Auto-generate transaction reference
paymentSchema.pre('save', async function(next) {
  if (!this.transactionReference) {
    // Format: PAY-YYYYMMDD-HHMMSS-XXXX
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.transactionReference = `PAY-${dateStr}-${timeStr}-${random}`;
  }
  next();
});

// Indexes for faster queries
paymentSchema.index({ transactionReference: 1 });
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ gatewayReference: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
