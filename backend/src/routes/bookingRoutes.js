const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/bookings - Create a booking (requires auth)
router.post('/', authMiddleware, bookingController.createBooking);

// GET /api/bookings - Get user's bookings (requires auth)
router.get('/', authMiddleware, bookingController.getUserBookings);

// PUT /api/bookings/:id/cancel - Cancel a booking (requires auth)
router.put('/:id/cancel', authMiddleware, bookingController.cancelBooking);

module.exports = router;    