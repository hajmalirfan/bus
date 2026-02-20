const Booking = require('../models/Booking');
const Bus = require('../models/Bus');
const Payment = require('../models/Payment');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
const createBooking = asyncHandler(async (req, res, next) => {
    const { busId, passengers, seatNumbers, pickupPoint, dropPoint, travelDate, paymentMethod, userId } = req.body;

    // Find the bus
    const bus = await Bus.findById(busId);
    if (!bus) {
        return res.status(404).json({
            success: false,
            message: 'Bus not found'
        });
    }

    // Check availability
    if (bus.availableSeats < seatNumbers.length) {
        return res.status(400).json({
            success: false,
            message: 'Not enough seats available'
        });
    }

    // Check if seats are already booked
    const alreadyBooked = bus.bookedSeats.filter(seat =>
        seatNumbers.includes(seat.seatNumber)
    );

    if (alreadyBooked.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Seats ${alreadyBooked.map(s => s.seatNumber).join(', ')} are already booked`
        });
    }

    // Calculate total price
    const totalPrice = bus.price * seatNumbers.length;

    // Use provided userId or null for guest booking
    const userIdToUse = userId || null;

    // Create booking
    const booking = await Booking.create({
        user: userIdToUse,
        bus: busId,
        passengers,
        totalSeats: seatNumbers.length,
        totalPrice,
        seatNumbers,
        pickupPoint,
        dropPoint,
        travelDate,
        bookingStatus: 'Confirmed',
        paymentStatus: 'Pending'
    });

    // Update bus available seats and booked seats
    const bookedSeatsData = seatNumbers.map((seatNum, index) => ({
        seatNumber: seatNum,
        passengerName: passengers[index]?.name || 'N/A',
        passengerPhone: passengers[index]?.phone || 'N/A'
    }));

    await Bus.findByIdAndUpdate(busId, {
        $inc: { availableSeats: -seatNumbers.length },
        $push: { bookedSeats: { $each: bookedSeatsData } }
    });

    // Create payment record
    const payment = await Payment.create({
        booking: booking._id,
        user: userIdToUse,
        amount: totalPrice,
        paymentMethod: paymentMethod || 'Card',
        paymentStatus: 'Completed',
        transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`
    });

    // Update booking payment status
    booking.paymentStatus = 'Paid';
    await booking.save();

    res.status(201).json({
        success: true,
        booking,
        payment
    });
});

// @desc    Get all bookings for current user
// @route   GET /api/bookings
// @access  Public
const getMyBookings = asyncHandler(async (req, res, next) => {
    const { userId } = req.query;

    let query = {};
    if (userId) {
        query.user = userId;
    }

    const bookings = await Booking.find(query)
        .populate('bus')
        .sort('-createdAt');

    res.status(200).json({
        success: true,
        count: bookings.length,
        bookings
    });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Public
const getBooking = asyncHandler(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id)
        .populate('bus')
        .populate('user', 'name email phone');

    if (!booking) {
        return res.status(404).json({
            success: false,
            message: 'Booking not found'
        });
    }

    res.status(200).json({
        success: true,
        booking
    });
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Public
const cancelBooking = asyncHandler(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        return res.status(404).json({
            success: false,
            message: 'Booking not found'
        });
    }

    // Check if booking can be cancelled (not already cancelled)
    if (booking.bookingStatus === 'Cancelled') {
        return res.status(400).json({
            success: false,
            message: 'Booking is already cancelled'
        });
    }

    // Update booking status
    booking.bookingStatus = 'Cancelled';
    booking.paymentStatus = 'Refunded';
    await booking.save();

    // Restore bus seats
    await Bus.findByIdAndUpdate(booking.bus, {
        $inc: { availableSeats: booking.totalSeats },
        $pull: { bookedSeats: { seatNumber: { $in: booking.seatNumbers } } }
    });

    res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
        booking
    });
});

// @desc    Get all bookings (admin)
// @route   GET /api/bookings/admin/all
// @access  Private/Admin
const getAllBookings = asyncHandler(async (req, res, next) => {
    const bookings = await Booking.find()
        .populate('bus')
        .populate('user', 'name email phone')
        .sort('-createdAt');

    res.status(200).json({
        success: true,
        count: bookings.length,
        bookings
    });
});

module.exports = {
    createBooking,
    getMyBookings,
    getBooking,
    cancelBooking,
    getAllBookings
};
