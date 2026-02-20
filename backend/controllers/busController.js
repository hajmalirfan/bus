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
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    const sampleBuses = [
        // Bangalore Routes
        {
            busNumber: 'KA01AB1234',
            busName: 'Volvo AC Sleeper',
            from: 'Bangalore',
            to: 'Mysore',
            departureTime: '08:00',
            arrivalTime: '11:30',
            date: today,
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
            date: today,
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
            date: today,
            price: 750,
            totalSeats: 30,
            availableSeats: 30,
            busType: 'Sleeper',
            amenities: ['WiFi', 'Charging Point', 'Water Bottle', 'Blanket', 'Pillow']
        },
        {
            busNumber: 'KA01AB1237',
            busName: 'Airavata Premium',
            from: 'Bangalore',
            to: 'Chennai',
            departureTime: '06:00',
            arrivalTime: '12:00',
            date: today,
            price: 1200,
            totalSeats: 35,
            availableSeats: 35,
            busType: 'AC',
            amenities: ['WiFi', 'Charging Point', 'Water Bottle', 'Snacks', 'Blanket']
        },
        {
            busNumber: 'KA01AB1238',
            busName: 'TNSTC Deluxe',
            from: 'Bangalore',
            to: 'Chennai',
            departureTime: '22:00',
            arrivalTime: '05:00',
            date: today,
            price: 850,
            totalSeats: 40,
            availableSeats: 40,
            busType: 'Semi-Sleeper',
            amenities: ['Charging Point', 'Water Bottle']
        },
        // Mumbai Routes
        {
            busNumber: 'MH01CD5678',
            busName: 'Shivshahi Volvo',
            from: 'Mumbai',
            to: 'Pune',
            departureTime: '07:00',
            arrivalTime: '10:00',
            date: today,
            price: 500,
            totalSeats: 40,
            availableSeats: 40,
            busType: 'AC',
            amenities: ['WiFi', 'Charging Point', 'Water Bottle', 'Blanket']
        },
        {
            busNumber: 'MH01CD5679',
            busName: 'MSRTC Shivneri',
            from: 'Mumbai',
            to: 'Pune',
            departureTime: '09:00',
            arrivalTime: '12:00',
            date: today,
            price: 350,
            totalSeats: 40,
            availableSeats: 40,
            busType: 'Non-AC',
            amenities: ['Water Bottle']
        },
        {
            busNumber: 'MH01CD5680',
            busName: 'Neeta Tours',
            from: 'Mumbai',
            to: 'Goa',
            departureTime: '20:00',
            arrivalTime: '08:00',
            date: tomorrow,
            price: 900,
            totalSeats: 35,
            availableSeats: 35,
            busType: 'AC',
            amenities: ['WiFi', 'Charging Point', 'Water Bottle', 'Blanket', 'Snacks']
        },
        // Delhi Routes
        {
            busNumber: 'DL01EF9012',
            busName: 'UpsRTC AC Deluxe',
            from: 'Delhi',
            to: 'Jaipur',
            departureTime: '06:00',
            arrivalTime: '11:00',
            date: today,
            price: 600,
            totalSeats: 40,
            availableSeats: 40,
            busType: 'AC',
            amenities: ['WiFi', 'Charging Point', 'Water Bottle', 'Blanket']
        },
        {
            busNumber: 'DL01EF9013',
            busName: 'Rajasthan Travels',
            from: 'Delhi',
            to: 'Jaipur',
            departureTime: '08:00',
            arrivalTime: '12:30',
            date: today,
            price: 450,
            totalSeats: 40,
            availableSeats: 40,
            busType: 'Non-AC',
            amenities: ['Water Bottle']
        },
        {
            busNumber: 'DL01EF9014',
            busName: 'Volvo Gold Line',
            from: 'Delhi',
            to: 'Agra',
            departureTime: '07:00',
            arrivalTime: '11:00',
            date: tomorrow,
            price: 550,
            totalSeats: 35,
            availableSeats: 35,
            busType: 'AC',
            amenities: ['WiFi', 'Charging Point', 'Water Bottle', 'Snacks']
        },
        // Hyderabad Routes
        {
            busNumber: 'TS01GH3456',
            busName: 'APSRTC Air Condition',
            from: 'Hyderabad',
            to: 'Warangal',
            departureTime: '06:00',
            arrivalTime: '09:00',
            date: today,
            price: 400,
            totalSeats: 40,
            availableSeats: 40,
            busType: 'AC',
            amenities: ['WiFi', 'Charging Point', 'Water Bottle']
        },
        {
            busNumber: 'TS01GH3457',
            busName: 'TGSRTC Express',
            from: 'Hyderabad',
            to: 'Warangal',
            departureTime: '10:00',
            arrivalTime: '13:00',
            date: today,
            price: 280,
            totalSeats: 40,
            availableSeats: 40,
            busType: 'Non-AC',
            amenities: ['Water Bottle']
        },
        {
            busNumber: 'TS01GH3458',
            busName: 'Orange Tours',
            from: 'Hyderabad',
            to: 'Vijayawada',
            departureTime: '21:00',
            arrivalTime: '06:00',
            date: tomorrow,
            price: 750,
            totalSeats: 35,
            availableSeats: 35,
            busType: 'Sleeper',
            amenities: ['WiFi', 'Charging Point', 'Water Bottle', 'Blanket', 'Pillow']
        },
        // Chennai Routes
        {
            busNumber: 'TN01IJ7890',
            busName: 'SETC Air Bus',
            from: 'Chennai',
            to: 'Coimbatore',
            departureTime: '05:00',
            arrivalTime: '10:00',
            date: today,
            price: 650,
            totalSeats: 40,
            availableSeats: 40,
            busType: 'AC',
            amenities: ['WiFi', 'Charging Point', 'Water Bottle', 'Snacks']
        },
        {
            busNumber: 'TN01IJ7891',
            busName: 'KPN Travels',
            from: 'Chennai',
            to: 'Coimbatore',
            departureTime: '22:00',
            arrivalTime: '04:00',
            date: today,
            price: 800,
            totalSeats: 30,
            availableSeats: 30,
            busType: 'Sleeper',
            amenities: ['WiFi', 'Charging Point', 'Water Bottle', 'Blanket', 'Pillow']
        },
        {
            busNumber: 'TN01IJ7892',
            busName: 'SRM Transports',
            from: 'Chennai',
            to: 'Madurai',
            departureTime: '08:00',
            arrivalTime: '13:00',
            date: dayAfter,
            price: 550,
            totalSeats: 40,
            availableSeats: 40,
            busType: 'Semi-Sleeper',
            amenities: ['Charging Point', 'Water Bottle']
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
