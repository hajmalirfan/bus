import { useLocation, useNavigate, Link } from 'react-router-dom';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { booking, bus, passengers, totalPrice } = location.state || {};

    if (!booking || !bus) {
        return (
            <div className="page">
                <div className="container text-center">
                    <h2>No booking information found</h2>
                    <Link to="/" className="btn btn-primary mt-lg">
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="page">
            <div className="container container-sm">
                <div className="card text-center animate-slideUp">
                    {/* Success Icon */}
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: '#DCFCE7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        fontSize: '2.5rem'
                    }}>
                        ✓
                    </div>

                    <h1 className="mb-sm">Booking Confirmed!</h1>
                    <p className="text-light mb-xl">
                        Your ticket has been booked successfully
                    </p>

                    {/* Booking Details */}
                    <div className="card" style={{ backgroundColor: 'var(--secondary)', textAlign: 'left' }}>
                        <h3 className="mb-md">Booking Details</h3>

                        <div className="divider"></div>

                        <div className="booking-summary-row">
                            <span className="text-light">Booking ID</span>
                            <span className="font-semibold">{booking._id.slice(-8).toUpperCase()}</span>
                        </div>

                        <div className="booking-summary-row">
                            <span className="text-light">Bus</span>
                            <span className="font-semibold">{bus.busName}</span>
                        </div>

                        <div className="booking-summary-row">
                            <span className="text-light">Type</span>
                            <span>{bus.busType}</span>
                        </div>

                        <div className="divider"></div>

                        <div className="booking-summary-row">
                            <span className="text-light">From</span>
                            <span className="font-semibold">{bus.from}</span>
                        </div>

                        <div className="booking-summary-row">
                            <span className="text-light">To</span>
                            <span className="font-semibold">{bus.to}</span>
                        </div>

                        <div className="divider"></div>

                        <div className="booking-summary-row">
                            <span className="text-light">Departure</span>
                            <span>{bus.departureTime}</span>
                        </div>

                        <div className="booking-summary-row">
                            <span className="text-light">Arrival</span>
                            <span>{bus.arrivalTime}</span>
                        </div>

                        <div className="divider"></div>

                        <div className="booking-summary-row">
                            <span className="text-light">Travel Date</span>
                            <span>{formatDate(bus.date)}</span>
                        </div>

                        <div className="divider"></div>

                        <div className="booking-summary-row">
                            <span className="text-light">Passengers</span>
                            <span>{booking.totalSeats}</span>
                        </div>

                        <div className="booking-summary-row">
                            <span className="text-light">Seat Numbers</span>
                            <span className="font-semibold">{booking.seatNumbers.join(', ')}</span>
                        </div>

                        <div className="divider"></div>

                        <div className="booking-summary-row">
                            <span className="text-light">Total Paid</span>
                            <span className="booking-summary-total">₹{totalPrice}</span>
                        </div>
                    </div>

                    {/* Passenger List */}
                    <div className="mt-lg">
                        <h3 className="text-left mb-md">Passengers</h3>
                        <div className="grid grid-2">
                            {passengers?.map((passenger, index) => (
                                <div key={index} className="card" style={{ padding: '1rem' }}>
                                    <div className="font-semibold">{passenger.name}</div>
                                    <div className="text-sm text-light">
                                        Seat {booking.seatNumbers[index]} • {passenger.age} years • {passenger.gender}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-xl flex gap-md justify-center">
                        <Link to="/bookings" className="btn btn-primary">
                            View My Bookings
                        </Link>
                        <Link to="/" className="btn btn-secondary">
                            Book Another Ticket
                        </Link>
                    </div>

                    {/* Note */}
                    <p className="text-sm text-light mt-lg">
                        A confirmation email will be sent to your registered email address.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Payment;
