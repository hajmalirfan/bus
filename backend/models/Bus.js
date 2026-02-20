const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    busNumber: {
        type: String,
        required: [true, 'Bus number is required'],
        unique: true,
        uppercase: true
    },
    busName: {
        type: String,
        required: [true, 'Bus name is required'],
        trim: true
    },
    from: {
        type: String,
        required: [true, 'Source location is required'],
        trim: true
    },
    to: {
        type: String,
        required: [true, 'Destination location is required'],
        trim: true
    },
    departureTime: {
        type: String,
        required: [true, 'Departure time is required']
    },
    arrivalTime: {
        type: String,
        required: [true, 'Arrival time is required']
    },
    date: {
        type: Date,
        required: [true, 'Journey date is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    totalSeats: {
        type: Number,
        required: [true, 'Total seats is required'],
        default: 40
    },
    availableSeats: {
        type: Number,
        required: true,
        default: 40
    },
    busType: {
        type: String,
        enum: ['AC', 'Non-AC', 'Sleeper', 'Semi-Sleeper'],
        default: 'AC'
    },
    amenities: [{
        type: String
    }],
    bookedSeats: [{
        seatNumber: Number,
        passengerName: String,
        passengerPhone: String
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for searching
busSchema.index({ from: 1, to: 1, date: 1 });

module.exports = mongoose.model('Bus', busSchema);
