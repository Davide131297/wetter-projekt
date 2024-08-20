import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import './components.css';
import { FiSunset } from 'react-icons/fi';
import { FiSunrise } from 'react-icons/fi';
import { IoIosSunny } from 'react-icons/io';

export default function ForecastMoreDays({ forecast, getDate, formatTime, getDaylightDuration, getWeatherCode }) {
  if (!forecast || !forecast.daily) {
    return <div>Keine Daten verfügbar</div>;
  }

  return (
    <div>
      {forecast.daily.time.map((time, index) => (
        <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
          > 
            <Box>
              <span className='accordionHead'>{getDate(time)}</span>
              <span className='accordionHead'>{getWeatherCode(forecast.daily.weather_code[index])}</span>
              <span className='accordionHead'>{forecast.daily.temperature_2m_max[index]}°C / {forecast.daily.temperature_2m_min[index]}°C</span>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box style={{ backgroundColor: '#81BEF7', borderRadius: '20px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <p style={{ margin: '5px' }}><FiSunrise size={24} color='yellow' />{formatTime(forecast.daily.sunrise[index])}</p>
              <p style={{ margin: '5px' }}><FiSunset size={24} color='yellow' />{formatTime(forecast.daily.sunset[index])}</p>
              <p style={{ margin: '5px' }}><IoIosSunny size={24} color='yellow' />{getDaylightDuration(forecast.daily.daylight_duration[index])} h</p>
            </Box>
            <div>
              <p>Maximale Temperatur: {forecast.daily.temperature_2m_max[index]}°C</p>
              <p>Minimale Temperatur: {forecast.daily.temperature_2m_min[index]}°C</p>
              <p>Regenwahrscheinlichkeit: {forecast.daily.precipitation_probability_max[index]}%</p>
              <p>Regenmenge: {forecast.daily.rain_sum[index]} mm</p>
              <p>Sonnenaufgang: {formatTime(forecast.daily.sunrise[index])} Uhr</p>
              <p>Sonnenuntergang: {formatTime(forecast.daily.sunset[index])} Uhr</p>
              <p>Tageslichtdauer: {getDaylightDuration(forecast.daily.daylight_duration[index])} Stunden</p>
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}