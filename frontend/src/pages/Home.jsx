import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { busAPI } from '../services/api';

const Home = () => {
    const navigate = useNavigate();
    const [searchData, setSearchData] = useState({
        from: '',
        to: '',
        date: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchData.from || !searchData.to || !searchData.date) {
            alert('Please fill in all fields');
            return;
        }

        // First seed some sample buses if needed
        try {
            setLoading(true);
            await busAPI.seed();
            navigate(`/search?from=${searchData.from}&to=${searchData.to}&date=${searchData.date}`);
        } catch (error) {
            console.error('Error:', error);
            navigate(`/search?from=${searchData.from}&to=${searchData.to}&date=${searchData.date}`);
        } finally {
            setLoading(false);
        }
    };

    const getTodayDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    return (
        <div className="page">
            <div className="container">
                {/* Hero Section */}
                <div className="text-center mb-xl">
                    <h1 className="page-title mb-md">
                        Book Bus Tickets Online
                    </h1>
                    <p className="text-lg text-light">
                        Travel comfortable with the best bus booking experience
                    </p>
                </div>

                {/* Search Box */}
                <div className="search-box">
                    <form onSubmit={handleSearch} className="search-form">
                        <div className="form-group">
                            <label className="form-label">From</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Enter city name"
                                value={searchData.from}
                                onChange={(e) => setSearchData({ ...searchData, from: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">To</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Enter city name"
                                value={searchData.to}
                                onChange={(e) => setSearchData({ ...searchData, to: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Date</label>
                            <input
                                type="date"
                                className="form-input"
                                min={getTodayDate()}
                                value={searchData.date}
                                onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', height: '46px' }}
                                disabled={loading}
                            >
                                {loading ? <span className="loader loader-sm"></span> : 'Search Buses'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Features Section */}
                <div className="mt-xl">
                    <h2 className="text-center mb-lg">Why Choose Us?</h2>
                    <div className="grid grid-3">
                        <div className="card text-center">
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔒</div>
                            <h3>Secure Booking</h3>
                            <p className="text-light mt-sm">
                                Your payments and personal information are safe with us
                            </p>
                        </div>

                        <div className="card text-center">
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
                            <h3>Instant Confirmation</h3>
                            <p className="text-light mt-sm">
                                Get your booking confirmed within seconds
                            </p>
                        </div>

                        <div className="card text-center">
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🕐</div>
                            <h3>24/7 Support</h3>
                            <p className="text-light mt-sm">
                                We're here to help you anytime, day or night
                            </p>
                        </div>
                    </div>
                </div>

                {/* Popular Routes */}
                <div className="mt-xl mb-xl">
                    <h2 className="text-center mb-lg">Popular Routes</h2>
                    <div className="grid grid-4">
                        {[
                            { from: 'Bangalore', to: 'Mysore' },
                            { from: 'Bangalore', to: 'Chennai' },
                            { from: 'Mumbai', to: 'Pune' },
                            { from: 'Delhi', to: 'Jaipur' }
                        ].map((route, index) => (
                            <div
                                key={index}
                                className="card card-hover"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    const date = getTodayDate();
                                    navigate(`/search?from=${route.from}&to=${route.to}&date=${date}`);
                                }}
                            >
                                <div className="text-center">
                                    <div className="font-semibold">{route.from}</div>
                                    <div className="text-light">↓</div>
                                    <div className="font-semibold">{route.to}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Home;
