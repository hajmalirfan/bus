const Loader = ({ size = 'md' }) => {
    return (
        <div className="loading-container">
            <div className={`loader loader-${size}`}></div>
        </div>
    );
};

export default Loader;
