import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { busAPI, bookingAPI } from '../services/api';
import SeatSelector from '../components/SeatSelector';
import Loader from '../components/Loader';

const Booking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [bus, setBus] = useState(null);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [passengers, setPassengers] = useState([]);
    const [error, setError] = useState('');

    const [passengerForm, setPassengerForm] = useState({
        name: '',
        age: '',
        gender: 'Male'
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/booking/${id}` } });
            return;
        }
        fetchBusDetails();
    }, [id, isAuthenticated]);

    useEffect(() => {
        // Initialize passenger forms when seats are selected
        const newPassengers = [];
        for (let i = 0; i < selectedSeats.length; i++) {
            newPassengers.push({
                name: '',
                age: '',
                gender: 'Male',
                phone: ''
            });
        }
        setPassengers(newPassengers);
    }, [selectedSeats.length]);

    const fetchBusDetails = async () => {
        try {
            const [busResponse, seatsResponse] = await Promise.all([
                busAPI.getById(id),
                busAPI.getSeats(id)
            ]);
            setBus(busResponse.bus);
            setBookedSeats(seatsResponse.bookedSeats || []);
        } catch (error) {
            console.error('Error fetching bus:', error);
            setError('Failed to load bus details');
        } finally {
            setLoading(false);
        }
    };

    const handlePassengerChange = (index, field, value) => {
        const updatedPassengers = [...passengers];
        updatedPassengers[index][field] = value;
        setPassengers(updatedPassengers);
    };

    const handleBooking = async () => {
        // Validate passengers
        const isValid = passengers.every(p => p.name && p.age && p.gender);
        if (!isValid) {
            setError('Please fill in all passenger details');
            return;
        }

        try {
            setBookingLoading(true);
            setError('');

            const bookingData = {
                busId: id,
                passengers: passengers.map((p, i) => ({
                    name: p.name,
                    age: parseInt(p.age),
                    gender: p.gender,
                    phone: p.phone
                })),
                seatNumbers: selectedSeats,
                pickupPoint: 'Main Bus Stand',
                dropPoint: 'Main Bus Stand',
                travelDate: bus.date,
                paymentMethod: 'Card'
            };

            const response = await bookingAPI.create(bookingData);

            // Navigate to success page
            navigate('/payment', {
                state: {
                    booking: response.booking,
                    bus: bus,
                    passengers: passengers,
                    totalPrice: bus.price * selectedSeats.length
                }
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (!bus) {
        return (
            <div className="page">
                <div className="container text-center">
                    <h2>Bus not found</h2>
                    <Link to="/search" className="btn btn-primary mt-lg">
                        Search Buses
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                {/* Bus Details */}
                <div className="card mb-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2>{bus.busName}</h2>
                            <p className="text-light">{bus.busType} • {bus.busNumber}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-bold text-accent">₹{bus.price}</div>
                            <div className="text-sm text-light">per seat</div>
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div className="flex justify-between">
                        <div>
                            <div className="font-semibold">{bus.departureTime}</div>
                            <div className="text-light">{bus.from}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-light">↓</div>
                        </div>
                        <div className="text-right">
                            <div className="font-semibold">{bus.arrivalTime}</div>
                            <div className="text-light">{bus.to}</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-2">
                    {/* Seat Selection */}
                    <div className="card">
                        <h3 className="mb-lg">Select Your Seats</h3>
                        <SeatSelector
                            totalSeats={bus.totalSeats}
                            bookedSeats={bookedSeats}
                            onSeatSelect={setSelectedSeats}
                            maxSeats={6}
                        />
                    </div>

                    {/* Passenger Details & Summary */}
                    <div>
                        {selectedSeats.length > 0 && (
                            <>
                                {/* Booking Summary */}
                                <div className="booking-summary mb-lg">
                                    <h3 className="booking-summary-title">Booking Summary</h3>
                                    <div className="booking-summary-row">
                                        <span>Selected Seats</span>
                                        <span>{selectedSeats.sort((a, b) => a - b).join(', ')}</span>
                                    </div>
                                    <div className="booking-summary-row">
                                        <span>Bus Fare</span>
                                        <span>₹{bus.price} × {selectedSeats.length}</span>
                                    </div>
                                    <div className="booking-summary-row">
                                        <span>Total</span>
                                        <span className="booking-summary-total">₹{bus.price * selectedSeats.length}</span>
                                    </div>
                                </div>

                                {/* Passenger Details */}
                                <div className="card">
                                    <h3 className="mb-lg">Passenger Details</h3>

                                    {error && (
                                        <div className="alert alert-error mb-md">
                                            {error}
                                        </div>
                                    )}

                                    {passengers.map((passenger, index) => (
                                        <div key={index} className="mb-lg">
                                            <h4 className="text-sm font-semibold mb-md">Passenger {index + 1} (Seat {selectedSeats[index]})</h4>
                                            <div className="grid grid-2 gap-md">
                                                <div className="form-group">
                                                    <label className="form-label">Name *</label>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        placeholder="Full name"
                                                        value={passenger.name}
                                                        onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Age *</label>
                                                    <input
                                                        type="number"
                                                        className="form-input"
                                                        placeholder="Age"
                                                        value={passenger.age}
                                                        onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Gender *</label>
                                                    <select
                                                        className="form-input form-select"
                                                        value={passenger.gender}
                                                        onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                                                    >
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Phone</label>
                                                    <input
                                                        type="tel"
                                                        className="form-input"
                                                        placeholder="Phone number"
                                                        value={passenger.phone}
                                                        onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        className="btn btn-primary"
                                        style={{ width: '100%' }}
                                        onClick={handleBooking}
                                        disabled={bookingLoading || selectedSeats.length === 0}
                                    >
                                        {bookingLoading ? <span className="loader loader-sm"></span> : `Pay ₹${bus.price * selectedSeats.length}`}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
