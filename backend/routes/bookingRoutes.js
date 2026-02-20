const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    getBooking,
    cancelBooking,
    getAllBookings
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/mybookings', protect, getMyBookings);
router.get('/admin/all', protect, admin, getAllBookings);
router.get('/:id', protect, getBooking);
router.post('/', protect, createBooking);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
