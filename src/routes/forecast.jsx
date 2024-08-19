import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Forecast() {

    const location = useLocation();

    useEffect(() => {
        console.log(location);
    }, [location]);

    return (
        <div>
            <h1>Forecast</h1>
        </div>
    );
}