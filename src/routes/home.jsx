import React, { useEffect, useState } from 'react';
import { Space, Select } from '@mantine/core';
import { Center, Box } from '@mantine/core';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapStyles.css'; // Importiere die CSS-Datei
import { FaLongArrowAltUp } from "react-icons/fa";

const API_KEY = process.env.REACT_APP_API_KEY;
const deCoords = [51.163375, 10.447683];

const Legend = ({ type }) => {
  if (type === 'temperature') {
    return (
      <div className="legend">
        <div className="legend-labels">
          <span>-40°C</span>
          <span>-20°C</span>
          <span>0°C</span>
          <span>20°C</span>
          <span>40°C</span>
        </div>
        <div className="legend-gradient temperature"></div>
      </div>
    );
  } else if (type === 'clouds') {
    return (
      <div className="legend">
        <div className="legend-labels">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
        <div className="legend-gradient clouds"></div>
      </div>
    );
  }
  return null;
};

export default function Home() {
  const [layerType, setLayerType] = useState('temperature');
  const [cologneTemp, setCologneTemp] = useState(null);


  const getTileLayerUrl = () => {
    if (layerType === 'temperature') {
      return `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`;
    } else if (layerType === 'clouds') {
      return `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`;
    } else if (layerType === 'precipitation') {
      return `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`;
    }
  };

  // Hole Temperaturdaten für Köln
  useEffect(() => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=50.9375&lon=6.9603&appid=${API_KEY}&units=metric`)
      .then((response) => response.json())
      .then((data) => {
        setCologneTemp(Math.round(data.main.temp));
      });
  }, []);

  return (
    <>
      <div className='headDiv'>
        <div className='boxDiv' style={{ flex: 1, display: 'flex', justifyContent: 'center'}}>
          <Box>
            <Space h={20} />
            <h1>Home</h1>
            <p>Willkommen in der Wetter-App!</p>
            <Space h={20} />
          </Box>
        </div>
        <div className="arrowContent">
          <FaLongArrowAltUp size={90} />
          Hier nach Ort suchen
        </div>
      </div>
      <Center>
        <MapContainer center={deCoords} zoom={4} style={{ height: '65vh', width: '90%', position: 'relative' }}>
          <div className="select-container">
            <Select
              label="Wählen Sie die Ansicht"
              placeholder="Ansicht auswählen"
              value={layerType}
              onChange={setLayerType}
              data={[
                { value: 'temperature', label: 'Temperatur' },
                { value: 'clouds', label: 'Wolken' },
                { value: 'precipitation', label: 'Niederschläge' },
              ]}
              styles={{ dropdown: { zIndex: 10000 } }} // Sicherstellen, dass das Dropdown-Menü sichtbar ist
            />
          </div>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <TileLayer
            url={getTileLayerUrl()}
            attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a> contributors'
          />
          <Legend type={layerType} />
        </MapContainer>
      </Center>
    </>
  );
}