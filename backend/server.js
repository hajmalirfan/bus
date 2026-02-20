const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');
const User = require('./models/User');
const Bus = require('./models/Bus');

// Route files
const authRoutes = require('./routes/authRoutes');
const busRoutes = require('./routes/busRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Load env vars
require('dotenv').config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use(helmet());

// Enable CORS
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again later'
});

app.use('/api', limiter);

// Seed test user on startup
const seedTestUser = async () => {
    try {
        const existingUser = await User.findOne({ email: 'test@bus.com' });
        if (!existingUser) {
            await User.create({
                name: 'Test User',
                email: 'test@bus.com',
                password: 'test123',
                phone: '9876543210'
            });
            console.log('✅ Test user created: test@bus.com / test123');
        }
    } catch (error) {
        console.log('Test user creation:', error.message);
    }
};

// Seed sample buses
const seedSampleBuses = async () => {
    try {
        const busCount = await Bus.countDocuments();
        if (busCount === 0) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const sampleBuses = [
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
                    busNumber: 'DL01EF9012',
                    busName: 'UpsRTC AC Deluxe',
                    from: 'Delhi',
                    to: 'Jaipur',
                    departureTime: '06:00',
                    arrivalTime: '11:00',
                    date: tomorrow,
                    price: 600,
                    totalSeats: 40,
                    availableSeats: 40,
                    busType: 'AC',
                    amenities: ['WiFi', 'Charging Point', 'Water Bottle', 'Blanket']
                },
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
                }
            ];

            await Bus.insertMany(sampleBuses);
            console.log('✅ Sample buses seeded');
        }
    } catch (error) {
        console.log('Bus seeding:', error.message);
    }
};

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Bus Booking API is running' });
});

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Bus Booking API',
        version: '1.0.0',
        testUser: {
            email: 'test@bus.com',
            password: 'test123'
        }
    });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await seedTestUser();
    await seedSampleBuses();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});
