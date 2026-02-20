import { Link } from 'react-router-dom';

const BusCard = ({ bus }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="card card-hover bus-card">
            <div className="bus-card-header">
                <div>
                    <h3 className="bus-card-title">{bus.busName}</h3>
                    <span className="bus-card-type">{bus.busType}</span>
                </div>
                <span className="badge badge-info">{bus.busNumber}</span>
            </div>

            <div className="bus-card-route">
                <div>
                    <div className="bus-card-time">{bus.departureTime}</div>
                    <div className="bus-card-location">{bus.from}</div>
                </div>
                <div className="bus-card-arrow">➝</div>
                <div>
                    <div className="bus-card-time">{bus.arrivalTime}</div>
                    <div className="bus-card-location">{bus.to}</div>
                </div>
            </div>

            <div className="divider"></div>

            <div className="flex items-center gap-md text-sm">
                <span className="text-light">
                    📅 {formatDate(bus.date)}
                </span>
                {bus.amenities && bus.amenities.length > 0 && (
                    <span className="text-light">
                        ✨ {bus.amenities.slice(0, 2).join(', ')}
                    </span>
                )}
            </div>

            <div className="bus-card-footer">
                <div>
                    <div className="bus-card-price">₹{bus.price}</div>
                    <div className="bus-card-seats">
                        {bus.availableSeats > 0 ? `${bus.availableSeats} seats available` : 'Sold out'}
                    </div>
                </div>
                {bus.availableSeats > 0 ? (
                    <Link
                        to={`/booking/${bus._id}`}
                        className="btn btn-primary"
                    >
                        Select Seats
                    </Link>
                ) : (
                    <button className="btn btn-secondary" disabled>
                        Sold Out
                    </button>
                )}
            </div>
        </div>
    );
};

export default BusCard;
