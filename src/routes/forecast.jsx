import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Space, ButtonGroup, Button } from '@mantine/core';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { IoIosPartlySunny, IoIosSunny } from 'react-icons/io';
import { FaCloudRain, FaCloudShowersHeavy, FaSnowflake, FaSmog, FaBolt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ForecastOneDay from '../components/forecastOneDay';
import ForecastMoreDays from '../components/forecastMoreDays';

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

const getDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

export default function Forecast() {
  const { param1, param2, param3, param4 } = useParams();
  const [forecast, setForecast] = useState({ daily: null, hourly: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${param1}&longitude=${param2}&hourly=temperature_2m,precipitation_probability,rain,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,daylight_duration,rain_sum,precipitation_probability_max&timezone=auto&forecast_days=${param4}`)
      .then(response => response.json())
      .then(data => {
        console.log("Wetterdaten Täglich", data.daily);
        console.log("Wetterdaten Stündlich", data.hourly);
        setForecast({ daily: data.daily, hourly: data.hourly });
      })
      .catch(error => console.error('Fehler beim Abrufen der Wetterdaten:', error));
  }, [param1, param2, param3, param4]);

  const getWeatherCode = (code) => {

    let iconSize;
    if (param4 === '1') {
      iconSize = '15vw'; // 10% der Viewport-Breite
    } else {
      iconSize = '3vw'; // 5% der Viewport-Breite
    }

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

  const chartData = forecast.hourly?.time?.map((time, index) => ({
    time: formatTime(time),
    temperature: forecast.hourly.temperature_2m[index],
    precipitationProbability: forecast.hourly.precipitation_probability[index],
    rain: forecast.hourly.rain[index],
  })) || [];

  function handleForeCastDurationClick(days) {
    return () => {
      navigate(`/forecast/${param1}/${param2}/${param3}/${days}`);
    };
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start', // Startet die Komponente ab 64px von oben
          alignItems: 'center',
          minHeight: '100vh',
          paddingTop: '20px', // Top padding für die gesamte Komponente
        }}
      >
        <Box
          sx={{
            width: '100%', 
            maxWidth: 800,
            display: 'flex',
            justifyContent: 'center', // Zentriert das innere Box-Element horizontal
            marginBottom: 2, // Abstand nach unten
          }}
        >
          <ButtonGroup variant="contained" aria-label="forecast duration">
            <Button onClick={handleForeCastDurationClick(1)}>Heute</Button>
            <Button onClick={handleForeCastDurationClick(3)}>3 Tage</Button>
            <Button onClick={handleForeCastDurationClick(7)}>7 Tage</Button>
            <Button onClick={handleForeCastDurationClick(13)}>13 Tage</Button>
            <Button onClick={handleForeCastDurationClick(16)}>16 Tage</Button>
          </ButtonGroup>
        </Box>
        <Typography variant="h4" align="center" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Das Wetter in {param3}
        </Typography>
        <Space h={20} />
        {param4 === '1' && (
          <ForecastOneDay 
            forecast={forecast} 
            param3={param3} 
            formatTime={formatTime} 
            getDaylightDuration={getDaylightDuration} 
            getWeatherCode={getWeatherCode}
            chartData={chartData}
          />
        )}
        {parseInt(param4, 10) >= 3 && (
          <ForecastMoreDays
            forecast={forecast}
            getDate={getDate}
            formatTime={formatTime}
            getDaylightDuration={getDaylightDuration}
            getWeatherCode={getWeatherCode}
          />
        )}
      </Box>
    </ThemeProvider>
  );
}