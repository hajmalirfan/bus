import { useState, useEffect } from 'react';

const SeatSelector = ({ totalSeats, bookedSeats = [], onSeatSelect, maxSeats = 5 }) => {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [seats, setSeats] = useState([]);

    useEffect(() => {
        // Generate seat layout
        const seatArray = [];
        for (let i = 1; i <= totalSeats; i++) {
            seatArray.push({
                number: i,
                isBooked: bookedSeats.includes(i)
            });
        }
        setSeats(seatArray);
    }, [totalSeats, bookedSeats]);

    const handleSeatClick = (seatNumber, isBooked) => {
        if (isBooked) return;

        setSelectedSeats(prev => {
            if (prev.includes(seatNumber)) {
                const newSelected = prev.filter(s => s !== seatNumber);
                onSeatSelect(newSelected);
                return newSelected;
            } else {
                if (prev.length >= maxSeats) {
                    alert(`You can only select up to ${maxSeats} seats`);
                    return prev;
                }
                const newSelected = [...prev, seatNumber];
                onSeatSelect(newSelected);
                return newSelected;
            }
        });
    };

    const getSeatClass = (seat) => {
        if (seat.isBooked) return 'seat seat-booked';
        if (selectedSeats.includes(seat.number)) return 'seat seat-selected';
        return 'seat';
    };

    // Create rows with 2 seats on each side
    const renderSeats = () => {
        const rows = [];
        const seatsPerRow = 4;

        for (let i = 0; i < seats.length; i += seatsPerRow) {
            const rowSeats = seats.slice(i, i + seatsPerRow);
            rows.push(rowSeats);
        }

        return rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-md mb-sm" style={{ gap: '2rem' }}>
                {/* Left side seats */}
                <div className="flex gap-sm">
                    {row.slice(0, 2).map(seat => (
                        <div
                            key={seat.number}
                            className={getSeatClass(seat)}
                            onClick={() => handleSeatClick(seat.number, seat.isBooked)}
                            title={seat.isBooked ? `Seat ${seat.number} (Booked)` : `Seat ${seat.number}`}
                        >
                            {seat.number}
                        </div>
                    ))}
                </div>

                {/* Aisle - empty space */}
                <div style={{ width: '2rem' }}></div>

                {/* Right side seats */}
                <div className="flex gap-sm">
                    {row.slice(2, 4).map(seat => (
                        <div
                            key={seat.number}
                            className={getSeatClass(seat)}
                            onClick={() => handleSeatClick(seat.number, seat.isBooked)}
                            title={seat.isBooked ? `Seat ${seat.number} (Booked)` : `Seat ${seat.number}`}
                        >
                            {seat.number}
                        </div>
                    ))}
                </div>
            </div>
        ));
    };

    return (
        <div>
            <div className="flex justify-center mb-lg">
                <div className="seat seat-driver">Driver</div>
            </div>

            <div className="seat-layout" style={{ display: 'block' }}>
                {renderSeats()}
            </div>

            <div className="flex justify-center gap-lg mt-lg">
                <div className="flex items-center gap-sm">
                    <div className="seat" style={{ cursor: 'default' }}>1</div>
                    <span className="text-sm text-light">Available</span>
                </div>
                <div className="flex items-center gap-sm">
                    <div className="seat seat-selected" style={{ cursor: 'default' }}>1</div>
                    <span className="text-sm text-light">Selected</span>
                </div>
                <div className="flex items-center gap-sm">
                    <div className="seat seat-booked" style={{ cursor: 'default' }}>1</div>
                    <span className="text-sm text-light">Booked</span>
                </div>
            </div>

            {selectedSeats.length > 0 && (
                <div className="mt-lg">
                    <p className="text-sm text-light">
                        Selected seats: <strong>{selectedSeats.sort((a, b) => a - b).join(', ')}</strong>
                    </p>
                    <p className="text-sm text-light">
                        Total seats: <strong>{selectedSeats.length}</strong>
                    </p>
                </div>
            )}
        </div>
    );
};

export default SeatSelector;
