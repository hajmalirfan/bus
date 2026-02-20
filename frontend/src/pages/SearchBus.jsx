import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { busAPI } from '../services/api';
import BusCard from '../components/BusCard';
import Loader from '../components/Loader';

const SearchBus = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchData, setSearchData] = useState({
        from: searchParams.get('from') || '',
        to: searchParams.get('to') || '',
        date: searchParams.get('date') || ''
    });

    useEffect(() => {
        if (searchData.from && searchData.to && searchData.date) {
            searchBuses();
        } else {
            setLoading(false);
        }
    }, []);

    const searchBuses = async () => {
        try {
            setLoading(true);
            const response = await busAPI.search(searchData);
            setBuses(response.buses || []);
        } catch (error) {
            console.error('Error searching buses:', error);
            setBuses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchParams(searchData);
        searchBuses();
    };

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
            <div className="container">
                {/* Search Form */}
                <div className="search-box mb-xl">
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
                                value={searchData.date}
                                onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', height: '46px' }}
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>

                {/* Search Results */}
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        {searchData.from && searchData.to && searchData.date && (
                            <div className="mb-lg">
                                <h2>
                                    Buses from {searchData.from} to {searchData.to}
                                </h2>
                                <p className="text-light">{formatDate(searchData.date)}</p>
                            </div>
                        )}

                        {buses.length > 0 ? (
                            <div className="grid grid-2">
                                {buses.map(bus => (
                                    <BusCard key={bus._id} bus={bus} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-xl">
                                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚌</div>
                                <h3>No buses found</h3>
                                <p className="text-light mt-md">
                                    Try searching for a different route or date
                                </p>
                                <Link to="/" className="btn btn-primary mt-lg">
                                    Go Home
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchBus;
