import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Center, Space } from '@mantine/core';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { IoIosPartlySunny, IoIosSunny } from 'react-icons/io';
import { FaCloudRain, FaCloudShowersHeavy, FaSnowflake, FaSmog, FaBolt } from 'react-icons/fa';
import { FiSunrise, FiSunset } from 'react-icons/fi';

const getWeatherCode = (code) => {
  const iconSize = '20vw'; // 10% der Viewport-Breite

  switch (code) {
    case 0:
      return <IoIosSunny style={{ width: iconSize, height: iconSize }} />;
    case 1:
    case 2:
    case 3:
      return <IoIosPartlySunny style={{ width: iconSize, height: iconSize }} />;
    case 45:
    case 48:
      return <FaSmog style={{ width: iconSize, height: iconSize }} />;
    case 51:
    case 53:
    case 55:
      return <FaCloudRain style={{ width: iconSize, height: iconSize }} />;
    case 56:
    case 57:
      return <FaCloudRain style={{ width: iconSize, height: iconSize }} />;
    case 61:
    case 63:
    case 65:
      return <FaCloudShowersHeavy style={{ width: iconSize, height: iconSize }} />;
    case 66:
    case 67:
      return <FaCloudShowersHeavy style={{ width: iconSize, height: iconSize }} />;
    case 71:
    case 73:
    case 75:
      return <FaSnowflake style={{ width: iconSize, height: iconSize }} />;
    case 77:
      return <FaSnowflake style={{ width: iconSize, height: iconSize }} />;
    case 80:
    case 81:
    case 82:
      return <FaCloudShowersHeavy style={{ width: iconSize, height: iconSize }} />;
    case 85:
    case 86:
      return <FaSnowflake style={{ width: iconSize, height: iconSize }} />;
    case 95:
      return <FaBolt style={{ width: iconSize, height: iconSize }} />;
    case 96:
    case 99:
      return <FaBolt style={{ width: iconSize, height: iconSize }} />;
    default:
      return 'Unbekannter Wettercode';
  }
};

const getDaylightDuration = (duration) => Math.floor(duration / 3600);

const formatTime = (isoString) => {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, '0');
  return `${hours}:00`;
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#007FFF',
      dark: '#0066CC',
    },
  },
});

export default function Forecast() {
  const { param1, param2, param3 } = useParams();
  const location = useLocation();
  const [forecast, setForecast] = useState({ daily: null, hourly: null });

  useEffect(() => {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${param1}&longitude=${param2}&hourly=temperature_2m,precipitation_probability,rain,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,daylight_duration,rain_sum,precipitation_probability_max&timezone=auto&forecast_days=1`)
      .then(response => response.json())
      .then(data => {
        console.log("Wetterdaten Täglich", data.daily);
        console.log("Wetterdaten Stündlich", data.hourly);
        setForecast({ daily: data.daily, hourly: data.hourly });
      })
      .catch(error => console.error('Fehler beim Abrufen der Wetterdaten:', error));
  }, [location, param1, param2]);

  const chartData = forecast.hourly?.time?.map((time, index) => ({
    time: formatTime(time),
    temperature: forecast.hourly.temperature_2m[index],
    precipitationProbability: forecast.hourly.precipitation_probability[index],
    rain: forecast.hourly.rain[index],
  })) || [];

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: 2,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 800 }}>
          <Space h={20} />
          <Typography variant="h4" align="center">
            Wie wird das Wetter heute in {param3}?
          </Typography>
          <Space h={20} />
          {forecast.daily && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: 2,
                borderRadius: 1,
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              <Box sx={{ flex: 1, marginRight: 2 }}>
                <Typography variant="h6" component="div">
                  Aktuelles Wetter in {param3}
                </Typography>
                <Box sx={{ marginBottom: 2 }}>
                  <Typography variant="body2" color="inherit">
                    Sonnenaufgang: {formatTime(forecast.daily.sunrise[0])} <FiSunrise size={20} color='yellow' />
                  </Typography>
                  <Typography variant="body2" color="inherit">
                    Sonnenuntergang: {formatTime(forecast.daily.sunset[0])} <FiSunset size={20} color='yellow' />
                  </Typography>
                  <Typography variant="body2" color="inherit">
                    Tageslichtdauer: {getDaylightDuration(forecast.daily.daylight_duration[0])} Stunden <IoIosSunny size={20} color='yellow' />
                  </Typography>
                </Box>
                <Box sx={{ marginBottom: 2 }}>
                  <Typography variant="body2" color="inherit">
                    Maximale Temperatur: {forecast.daily.temperature_2m_max[0]}°C
                  </Typography>
                  <Typography variant="body2" color="inherit">
                    Minimale Temperatur: {forecast.daily.temperature_2m_min[0]}°C
                  </Typography>
                </Box>
                <Box sx={{ marginBottom: 2 }}>
                  <Typography variant="body2" color="inherit">
                    Regenwahrscheinlichkeit: {forecast.daily.precipitation_probability_max[0]}%
                  </Typography>
                  <Typography variant="body2" color="inherit">
                    Regenmenge: {forecast.daily.rain_sum[0]} mm
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  textAlign: 'center',
                  flex: 1,
                }}
              >
                <Typography variant="h4" color="inherit" sx={{ mb: 1 }}>
                  {getWeatherCode(forecast.daily.weather_code[0])}
                </Typography>
              </Box>
            </Box>
          )}
          <Space h={20} />
          {forecast.hourly && (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" label={{ value: 'Zeit', position: 'insideBottomRight', offset: -5 }} />
                
                {/* Left Y-Axis for Temperature */}
                <YAxis 
                  yAxisId="left" 
                  label={{ value: 'Temperatur (°C)', angle: -90, position: 'insideLeft', offset: 10 }} 
                  domain={['auto', 'auto']}
                />

                {/* Right Y-Axis for Rain */}
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  label={{ value: 'Regenmenge (mm)', angle: -90, position: 'insideRight', offset: 10 }} 
                  domain={['auto', 'auto']}
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
                    if (value === 'temperature') return 'Temperatur (°C)';
                    if (value === 'precipitationProbability') return 'Regenwahrscheinlichkeit (%)';
                    if (value === 'rain') return 'Regenmenge (mm)';
                    return value;
                  }}
                />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="red" 
                  activeDot={{ r: 8 }} 
                  name="Temperatur (°C)" 
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="rain" 
                  stroke="blue" 
                  name="Regenmenge (mm)" 
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="precipitationProbability" 
                  stroke="#1e90ff" 
                  name="Regenwahrscheinlichkeit (%)" 
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}