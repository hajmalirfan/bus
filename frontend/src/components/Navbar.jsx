import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="navbar-brand">
                    🚌 BusBooking
                </Link>

                <div className="navbar-links">
                    <Link to="/" className="navbar-link">
                        Home
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link to="/search" className="navbar-link">
                                Search Buses
                            </Link>
                            <Link to="/bookings" className="navbar-link">
                                My Bookings
                            </Link>
                            <Link to="/profile" className="navbar-link">
                                Profile
                            </Link>
                            <button onClick={handleLogout} className="btn btn-outline">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar-link">
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-primary">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
