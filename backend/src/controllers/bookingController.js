const Booking = require('../models/bookingModel');
const Trip = require('../models/fleetModel');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { fleetId, seats } = req.body;
    const userId = req.user.id; // Assumes auth middleware sets req.user

    // Validate trip exists and has available seats
    const trip = await Trip.findById(fleetId);
    if (!trip || trip.availableSeats < seats) {
      return res.status(400).json({ error: 'Insufficient seats or invalid trip' });
    }

    // Calculate total price (assuming price per seat is in trip model)
    const totalPrice = trip.pricePerSeat * seats;

    // Create booking
    const booking = new Booking({ userId, Id, seats, totalPrice });
    await booking.save();

    // Update trip seats
    trip.availableSeats -= seats;
    await trip.save();

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user's bookings
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ userId }).populate('tripId', 'origin destination departureTime');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findOne({ _id: id, userId });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Update status and restore seats
    booking.status = 'canceled';
    await booking.save();

    const trip = await Trip.findById(booking.tripId);
    trip.availableSeats += booking.seats;
    await trip.save();

    res.json({ message: 'Booking canceled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};