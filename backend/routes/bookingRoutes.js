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

router.get('/mybookings', getMyBookings);
router.get('/admin/all', protect, admin, getAllBookings);
router.get('/:id', getBooking);
router.post('/', createBooking);
router.put('/:id/cancel', cancelBooking);

module.exports = router;
