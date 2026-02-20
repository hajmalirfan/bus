const express = require('express');
const router = express.Router();
const {
    getBuses,
    searchBuses,
    getBus,
    createBus,
    updateBus,
    getAvailableSeats,
    seedBuses
} = require('../controllers/busController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/search', searchBuses);
router.get('/seed', seedBuses);
router.get('/:id/seats', getAvailableSeats);
router.get('/:id', getBus);
router.get('/', getBuses);

// Protected admin routes
router.post('/', protect, admin, createBus);
router.put('/:id', protect, admin, updateBus);

module.exports = router;
