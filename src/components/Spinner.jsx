import React, { useState, useEffect } from 'react';

const Spinner = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 500); 

        return () => clearTimeout(timer); 
    }, []);

    return (
        <div id="spinner" className={`spinner ${isVisible ? 'show' : ''}`}>
            <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
};

export default Spinner;