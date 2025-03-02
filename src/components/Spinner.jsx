import React, { useState, useEffect } from 'react';

const Spinner = ({ loading }) => {
    return (
        <div id="spinner" className={`spinner ${loading ? 'show' : ''}`}>
            {loading && (
                <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            )}
        </div>
    );
};

export default Spinner;