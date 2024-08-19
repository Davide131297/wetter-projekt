import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

export default function Forecast() {
  const { param1, param2 } = useParams();
  const location = useLocation();
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    console.log(`Parameter 1: ${param1}`);
    console.log(`Parameter 2: ${param2}`);
    
    // Beispiel: Setzen der Koordinaten basierend auf den Parametern
    setCoordinates({ latitude: param1, longitude: param2 });
  }, [location, param1, param2]);

  return (
    <div>
      <h1>Forecast</h1>
      <p>Parameter 1: {param1}</p>
      <p>Parameter 2: {param2}</p>
      <p>Latitude: {coordinates.latitude}</p>
      <p>Longitude: {coordinates.longitude}</p>
    </div>
  );
}