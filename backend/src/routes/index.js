const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send({message: "Welcome to Trekka API | Trekka Backend API is running"});
});

// Importing all sub-routes
router.use('/auth', require('./authRoutes'));
router.use('/users', require('./userRoutes'));
router.use('/bookings', require('./bookingRoutes'));
router.use('/companies', require('./companyRoutes'));
router.use('/drivers', require('./driverRoutes'));
router.use('/fleet', require('./adminRoutes'));
router.use('/payments', require('./paymentRoutes'));

module.exports = router;