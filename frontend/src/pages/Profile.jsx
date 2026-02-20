import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingAPI } from '../services/api';
import Loader from '../components/Loader';

const Profile = () => {
    const { user, logout, updateProfile } = useAuth();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || ''
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchBookings();
    }, [user]);

    const fetchBookings = async () => {
        try {
            const response = await bookingAPI.getMyBookings();
            setBookings(response.bookings || []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            await updateProfile(formData);
            setMessage('Profile updated successfully');
            setEditing(false);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            await bookingAPI.cancel(bookingId);
            fetchBookings();
        } catch (error) {
            alert('Failed to cancel booking');
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="page">
            <div className="container">
                <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                    {/* Profile Card */}
                    <div>
                        <div className="card">
                            <div className="text-center mb-lg">
                                <div className="avatar" style={{
                                    width: '80px',
                                    height: '80px',
                                    fontSize: '2rem',
                                    margin: '0 auto 1rem'
                                }}>
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <h2>{user?.name}</h2>
                                <p className="text-light">{user?.email}</p>
                            </div>

                            {message && (
                                <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'} mb-md`}>
                                    {message}
                                </div>
                            )}

                            {editing ? (
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-input"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            className="form-input"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="flex gap-md">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            style={{ flex: 1 }}
                                            disabled={saving}
                                        >
                                            {saving ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setEditing(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="mb-md">
                                        <label className="text-light text-sm">Name</label>
                                        <p className="font-semibold">{user?.name}</p>
                                    </div>
                                    <div className="mb-md">
                                        <label className="text-light text-sm">Email</label>
                                        <p>{user?.email}</p>
                                    </div>
                                    <div className="mb-lg">
                                        <label className="text-light text-sm">Phone</label>
                                        <p>{user?.phone || 'Not provided'}</p>
                                    </div>
                                    <div className="flex gap-md">
                                        <button
                                            className="btn btn-primary"
                                            style={{ flex: 1 }}
                                            onClick={() => setEditing(true)}
                                        >
                                            Edit Profile
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={async () => {
                                                await logout();
                                                navigate('/');
                                            }}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Bookings */}
                    <div>
                        <h2 className="mb-lg">My Bookings</h2>

                        {bookings.length > 0 ? (
                            <div className="grid gap-md">
                                {bookings.map(booking => (
                                    <div key={booking._id} className="card">
                                        <div className="flex justify-between items-start mb-md">
                                            <div>
                                                <h3>{booking.bus?.busName}</h3>
                                                <p className="text-light text-sm">
                                                    {booking.bus?.from} → {booking.bus?.to}
                                                </p>
                                            </div>
                                            <span className={`badge ${booking.bookingStatus === 'Confirmed' ? 'badge-success' :
                                                    booking.bookingStatus === 'Cancelled' ? 'badge-error' : 'badge-warning'
                                                }`}>
                                                {booking.bookingStatus}
                                            </span>
                                        </div>

                                        <div className="grid grid-3 gap-md text-sm">
                                            <div>
                                                <span className="text-light">Date</span>
                                                <p className="font-semibold">{formatDate(booking.travelDate)}</p>
                                            </div>
                                            <div>
                                                <span className="text-light">Seats</span>
                                                <p className="font-semibold">{booking.seatNumbers?.join(', ')}</p>
                                            </div>
                                            <div>
                                                <span className="text-light">Total</span>
                                                <p className="font-semibold text-accent">₹{booking.totalPrice}</p>
                                            </div>
                                        </div>

                                        {booking.bookingStatus === 'Confirmed' && (
                                            <div className="mt-md pt-md" style={{ borderTop: '1px solid var(--border)' }}>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleCancelBooking(booking._id)}
                                                >
                                                    Cancel Booking
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="card text-center p-xl">
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎫</div>
                                <h3>No bookings yet</h3>
                                <p className="text-light mt-md">
                                    Start planning your next journey!
                                </p>
                                <Link to="/" className="btn btn-primary mt-lg">
                                    Search Buses
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
