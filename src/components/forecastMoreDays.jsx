import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import { FiSunset, FiSunrise } from 'react-icons/fi';
import { IoIosSunny } from 'react-icons/io';
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Bar
} from 'recharts';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import './components.css';

function summarizeWeather(hourlyData, startHour, endHour) {
  if (!hourlyData || !hourlyData.time || !hourlyData.temperature_2m || !hourlyData.precipitation_probability || !hourlyData.rain) {
    return null;
  }

  const relevantData = hourlyData.time
    .map((time, index) => {
      const hour = new Date(time).getHours();
      if ((startHour < endHour && hour >= startHour && hour < endHour) ||
          (startHour > endHour && (hour >= startHour || hour < endHour))) {
        return {
          temperature_2m: hourlyData.temperature_2m[index],
          precipitation_probability: hourlyData.precipitation_probability[index],
          rain: hourlyData.rain[index]
        };
      }
      return null;
    })
    .filter(data => data !== null);

  if (relevantData.length === 0) return null;

  const temperatures = relevantData.map(data => data.temperature_2m);
  const minTemp = Math.min(...temperatures);
  const maxTemp = Math.max(...temperatures);
  const averagePrecipitation = (relevantData.reduce((acc, data) => acc + data.precipitation_probability, 0) / relevantData.length).toFixed(1);
  const totalRain = relevantData.reduce((acc, data) => acc + data.rain, 0).toFixed(1);

  return {
    minTemp,
    maxTemp,
    precipitation: averagePrecipitation,
    rain: totalRain
  };
}

function generateChartData(hourlyData, date) {
  if (!hourlyData || !hourlyData.time || !hourlyData.temperature_2m || !hourlyData.precipitation_probability || !hourlyData.rain) {
    return [];
  }

  return hourlyData.time
    .map((time, index) => {
      const dataDate = new Date(time).toDateString();
      if (dataDate === date) {
        return {
          time: new Date(time).getHours(),
          temperature: hourlyData.temperature_2m[index],
          precipitationProbability: hourlyData.precipitation_probability[index],
          rain: hourlyData.rain[index]
        };
      }
      return null;
    })
    .filter(data => data !== null);
}

export default function ForecastMoreDays({ forecast, getDate, formatTime, getDaylightDuration, getWeatherCode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!forecast || !forecast.daily || !forecast.hourly) {
    return <div>Keine Daten verfügbar</div>;
  }

  const timeBlocks = {
    Morgens: { start: 6, end: 12, label: "06:00 - 12:00" },
    Mittags: { start: 12, end: 18, label: "12:00 - 18:00" },
    Abends: { start: 18, end: 22, label: "18:00 - 22:00" },
    Nachts: { start: 22, end: 6, label: "22:00 - 06:00" }
  };

  return (
    <div>
      {forecast.daily.time.map((time, index) => {
        const chartData = generateChartData(forecast.hourly, new Date(time).toDateString());

        return (
          <Accordion key={index} sx={isMobile ? { margin: '0 10px' } : {}}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} className="accordion-summary">
              <Box className="forecast-header" display="flex" justifyContent="space-between" alignItems="center" width="100%">
                <Box display="flex" flexDirection="row" alignItems="center">
                  <h3>{getDate(time)}</h3>
                  <p>{getWeatherCode(forecast.daily.weather_code[index])}</p>
                  <p>{forecast.daily.temperature_2m_max[index]}°C / {forecast.daily.temperature_2m_min[index]}°C</p>
                </Box>
                <Box className="daylight-info" display="flex" flexDirection="row" alignItems="center">
                  <p><FiSunrise size={20} color='orange'/> {formatTime(forecast.daily.sunrise[index])}</p>
                  <p><FiSunset size={20} color='orange'/> {formatTime(forecast.daily.sunset[index])}</p>
                  <p><IoIosSunny size={20} color='orange'/> {getDaylightDuration(forecast.daily.daylight_duration[index])} h</p>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box className="hourly-forecast" border={1} borderColor="grey.300" borderRadius={2} p={2}>
                {Object.keys(timeBlocks).map(period => {
                  const { start, end, label } = timeBlocks[period];
                  const weatherSummary = summarizeWeather(forecast.hourly, start, end);

                  return (
                    <Box key={period} className="period-forecast" border={1} borderColor="grey.300" borderRadius={2} p={2} mb={2}>
                      <h4>{period}: {label}</h4>
                      {weatherSummary ? (
                        <>
                          <p>{weatherSummary.maxTemp}°C / {weatherSummary.minTemp}°C</p>
                          <p>{weatherSummary.precipitation}% Regenwahrscheinlichkeit</p>
                          <p>{weatherSummary.rain} mm Regen</p>
                        </>
                      ) : (
                        <p>Keine Daten verfügbar</p>
                      )}
                    </Box>
                  );
                })}
                {forecast.hourly && (
                  <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
                    <ComposedChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="time" 
                        label={{ value: 'Zeit', position: 'insideBottomRight', offset: -5, fontSize: isMobile ? 10 : 12 }} 
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                      />
                      <YAxis 
                        yAxisId="left" 
                        label={{ value: 'Temperatur (°C)', angle: -90, position: 'insideLeft', offset: 10, dy: isMobile ? 30 : 60 ,fontSize: isMobile ? 10 : 12 }} 
                        domain={['auto', 'auto']}
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        label={{ 
                          value: 'Regenmenge (mm)', 
                          angle: -90, 
                          position: 'insideRight', 
                          offset: 15, 
                          dy: -30,
                          fontSize: isMobile ? 10 : 12 
                        }} 
                        domain={['auto', 'auto']} 
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                      />
                      <YAxis 
                        yAxisId="right2" 
                        orientation="right" 
                        label={{ 
                          value: 'Regenwahrscheinlichkeit (%)', 
                          angle: -90, 
                          position: 'insideRight', 
                          offset: 15, 
                          dy: isMobile ? -50 : -80,
                          fontSize: isMobile ? 10 : 12 
                        }} 
                        domain={[0, 100]}  
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                      />
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === 'temperature') return [`${value}°C`, 'Temperatur'];
                          if (name === 'precipitationProbability') return [`${value}%`, 'Regenwahrscheinlichkeit'];
                          if (name === 'rain') return [`${value} mm`, 'Regenmenge'];
                          return [value, name];
                        }}
                      />
                      <Legend
                        formatter={(value) => {
                          if (value === 'temperature') return <span style={{ fontSize: isMobile ? 10 : 12 }}>Temperatur (°C)</span>;
                          if (value === 'precipitationProbability') return <span style={{ fontSize: isMobile ? 10 : 12 }}>Regenwahrscheinlichkeit (%)</span>;
                          if (value === 'rain') return <span style={{ fontSize: isMobile ? 10 : 12 }}>Regenmenge (mm)</span>;
                          return <span style={{ fontSize: isMobile ? 10 : 12 }}>{value}</span>;
                        }}
                      />
                      <Line 
                        yAxisId="left" 
                        type="monotone" 
                        dataKey="temperature" 
                        stroke="red" 
                        activeDot={{ r: 4 }} 
                        name="Temperatur (°C)" 
                      />
                      <Bar 
                        yAxisId="right" 
                        dataKey="rain" 
                        fill="blue" 
                        name="Regenmenge (mm)" 
                      />
                      <Line 
                        yAxisId="right2" 
                        type="monotone" 
                        dataKey="precipitationProbability" 
                        stroke="green" 
                        name="Regenwahrscheinlichkeit (%)" 
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
}