const Bus = require('../models/Bus');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get all buses
// @route   GET /api/buses
// @access  Public
const getBuses = asyncHandler(async (req, res, next) => {
    const buses = await Bus.find({ isActive: true });

    res.status(200).json({
        success: true,
        count: buses.length,
        buses
    });
});

// @desc    Search buses
// @route   GET /api/buses/search
// @access  Public
const searchBuses = asyncHandler(async (req, res, next) => {
    const { from, to, date } = req.query;

    if (!from || !to || !date) {
        return res.status(400).json({
            success: false,
            message: 'Please provide from, to and date'
        });
    }

    const searchDate = new Date(date);
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const buses = await Bus.find({
        from: { $regex: from, $options: 'i' },
        to: { $regex: to, $options: 'i' },
        date: {
            $gte: searchDate,
            $lt: nextDay
        },
        isActive: true
    });

    res.status(200).json({
        success: true,
        count: buses.length,
        buses
    });
});

// @desc    Get single bus
// @route   GET /api/buses/:id
// @access  Public
const getBus = asyncHandler(async (req, res, next) => {
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
        return res.status(404).json({
            success: false,
            message: 'Bus not found'
        });
    }

    res.status(200).json({
        success: true,
        bus
    });
});

// @desc    Create new bus
// @route   POST /api/buses
// @access  Private/Admin
const createBus = asyncHandler(async (req, res, next) => {
    const bus = await Bus.create(req.body);

    res.status(201).json({
        success: true,
        bus
    });
});

// @desc    Update bus
// @route   PUT /api/buses/:id
// @access  Private/Admin
const updateBus = asyncHandler(async (req, res, next) => {
    let bus = await Bus.findById(req.params.id);

    if (!bus) {
        return res.status(404).json({
            success: false,
            message: 'Bus not found'
        });
    }

    bus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        bus
    });
});

// @desc    Get available seats for a bus
// @route   GET /api/buses/:id/seats
// @access  Public
const getAvailableSeats = asyncHandler(async (req, res, next) => {
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
        return res.status(404).json({
            success: false,
            message: 'Bus not found'
        });
    }

    const bookedSeatNumbers = bus.bookedSeats.map(seat => seat.seatNumber);

    res.status(200).json({
        success: true,
        totalSeats: bus.totalSeats,
        availableSeats: bus.availableSeats,
        bookedSeats: bookedSeatNumbers
    });
});

// @desc    Seed sample buses (for testing)
// @route   POST /api/buses/seed
// @access  Public
const seedBuses = asyncHandler(async (req, res, next) => {
    const sampleBuses = [
        {
            busNumber: 'KA01AB1234',
            busName: 'Volvo AC Sleeper',
            from: 'Bangalore',
            to: 'Mysore',
            departureTime: '08:00',
            arrivalTime: '11:30',
            date: new Date(),
            price: 650,
            totalSeats: 40,
            availableSeats: 40,
            busType: 'AC',
            amenities: ['WiFi', 'Charging Point', 'Water Bottle', 'Blanket']
        },
        {
            busNumber: 'KA01AB1235',
            busName: 'KSRTC Express',
            from: 'Bangalore',
            to: 'Mysore',
            departureTime: '10:00',
            arrivalTime: '13:00',
            date: new Date(),
            price: 450,
            totalSeats: 40,
            availableSeats: 40,
            busType: 'Non-AC',
            amenities: ['Water Bottle']
        },
        {
            busNumber: 'KA01AB1236',
            busName: 'Sleeper Coach',
            from: 'Bangalore',
            to: 'Mysore',
            departureTime: '21:00',
            arrivalTime: '00:30',
            date: new Date(),
            price: 750,
            totalSeats: 30,
            availableSeats: 30,
            busType: 'Sleeper',
            amenities: ['WiFi', 'Charging Point', 'Water Bottle', 'Blanket', 'Pillow']
        }
    ];

    await Bus.deleteMany({});
    const buses = await Bus.insertMany(sampleBuses);

    res.status(201).json({
        success: true,
        count: buses.length,
        buses
    });
});

module.exports = {
    getBuses,
    searchBuses,
    getBus,
    createBus,
    updateBus,
    getAvailableSeats,
    seedBuses
};
