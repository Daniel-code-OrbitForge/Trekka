<<<<<<< HEAD
import nodemailer from "nodemailer";

export const emailService = {
  async sendEmail(to, subject, html) {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  },
=======
/**
 * Email Service
 * 
 * Handles sending transactional emails including payment receipts and booking passes.
 * Uses Nodemailer for email delivery.
 */

const nodemailer = require('nodemailer');
const logger = require('../utils/logger');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs').promises;

// Initialize nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Generate QR code for booking pass
 * 
 * @param {String} bookingReference - Unique booking reference
 * @returns {Promise<String>} - Base64 encoded QR code
 */
async function generateBookingQR(bookingReference) {
  try {
    return await QRCode.toDataURL(bookingReference);
  } catch (error) {
    logger.error('QR code generation failed:', error);
    throw new Error('Failed to generate booking QR code');
  }
}

/**
 * Send payment receipt email
 * 
 * @param {Object} paymentData - Payment details
 * @param {String} paymentData.email - Customer email
 * @param {String} paymentData.transactionReference - Payment reference
 * @param {Number} paymentData.amount - Payment amount
 * @param {String} paymentData.currency - Currency code
 * @param {String} paymentData.gateway - Payment gateway used
 * @param {Object} bookingData - Booking details
 * @returns {Promise<Object>}
 */
async function sendPaymentReceipt(paymentData, bookingData) {
  try {
    const emailContent = `
      <h2>Payment Receipt | Trekka Transport</h2>
      <p>Thank you for your payment. Here are your transaction details:</p>
      
      <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Payment Details</h3>
        <p><strong>Transaction Reference:</strong> ${paymentData.transactionReference}</p>
        <p><strong>Amount Paid:</strong> ${paymentData.currency} ${(paymentData.amount/100).toFixed(2)}</p>
        <p><strong>Payment Method:</strong> ${paymentData.paymentMethod}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      </div>

      <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Booking Summary</h3>
        <p><strong>From:</strong> ${bookingData.origin}</p>
        <p><strong>To:</strong> ${bookingData.destination}</p>
        <p><strong>Date:</strong> ${new Date(bookingData.departureDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${bookingData.departureTime}</p>
        <p><strong>Seats:</strong> ${bookingData.seats.join(', ')}</p>
      </div>
      
      <p>Your booking pass will be sent in a separate email.</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: paymentData.email,
      subject: `Payment Receipt - ${paymentData.transactionReference}`,
      html: emailContent
    });

    return { success: true };
  } catch (error) {
    logger.error('Failed to send payment receipt:', error);
    throw new Error('Failed to send payment receipt email');
  }
}

/**
 * Send booking pass email
 * 
 * @param {Object} bookingData - Booking details
 * @param {String} bookingData.email - Customer email
 * @param {String} bookingData.bookingReference - Booking reference
 * @param {Array} bookingData.seats - Booked seat numbers
 * @returns {Promise<Object>}
 */
async function sendBookingPass(bookingData) {
  try {
    // Generate QR code for the booking
    const qrCodeBase64 = await generateBookingQR(bookingData.bookingReference);

    const emailContent = `
      <h2>Booking Pass | Trekka Transport</h2>
      <p>Here is your booking pass. Please present this at the terminal before boarding.</p>
      
      <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Journey Details</h3>
        <p><strong>Booking Reference:</strong> ${bookingData.bookingReference}</p>
        <p><strong>From:</strong> ${bookingData.origin}</p>
        <p><strong>To:</strong> ${bookingData.destination}</p>
        <p><strong>Date:</strong> ${new Date(bookingData.departureDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${bookingData.departureTime}</p>
        <p><strong>Seats:</strong> ${bookingData.seats.join(', ')}</p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <p><strong>Scan this QR code at the terminal</strong></p>
        <img src="${qrCodeBase64}" alt="Booking QR Code" style="width: 200px; height: 200px;"/>
      </div>
      
      <p>Important Notes:</p>
      <ul>
        <li>Please arrive at least 30 minutes before departure.</li>
        <li>Present this booking pass and a valid ID at the terminal.</li>
        <li>Keep this pass safe, it's your ticket to board.</li>
      </ul>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: bookingData.email,
      subject: `Booking Pass - ${bookingData.bookingReference}`,
      html: emailContent
    });

    return { success: true };
  } catch (error) {
    logger.error('Failed to send booking pass:', error);
    throw new Error('Failed to send booking pass email');
  }
}

module.exports = {
  sendPaymentReceipt,
  sendBookingPass
>>>>>>> 6e021b1 (Resolve merge conflicts in userModel and paymentModel)
};
