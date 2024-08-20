import { FiSunrise, FiSunset } from 'react-icons/fi';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Space } from '@mantine/core';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { IoIosSunny } from 'react-icons/io';

export default function ForecastOneDay({ forecast, param3, formatTime, getDaylightDuration, getWeatherCode, chartData }) {
    return (
        <>
        {forecast.daily && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                padding: 1,
                borderRadius: 1,
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              <Box sx={{ flex: 1, marginRight: { xs: 0, sm: 1 } }}>
                <Typography variant="h6" component="div" sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                  Aktuelles Wetter in {param3}
                </Typography>
                <Box sx={{ marginBottom: 1 }}>
                  <Typography variant="body2" color="inherit" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                    Sonnenaufgang: {formatTime(forecast.daily.sunrise[0])} <FiSunrise size={16} color='yellow' />
                  </Typography>
                  <Typography variant="body2" color="inherit" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                    Sonnenuntergang: {formatTime(forecast.daily.sunset[0])} <FiSunset size={16} color='yellow' />
                  </Typography>
                  <Typography variant="body2" color="inherit" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                    Tageslichtdauer: {getDaylightDuration(forecast.daily.daylight_duration[0])} Stunden <IoIosSunny size={16} color='yellow' />
                  </Typography>
                </Box>
                <Box sx={{ marginBottom: 1 }}>
                  <Typography variant="body2" color="inherit" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                    Maximale Temperatur: {forecast.daily.temperature_2m_max[0]}°C
                  </Typography>
                  <Typography variant="body2" color="inherit" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                    Minimale Temperatur: {forecast.daily.temperature_2m_min[0]}°C
                  </Typography>
                </Box>
                <Box sx={{ marginBottom: 1 }}>
                  <Typography variant="body2" color="inherit" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                    Regenwahrscheinlichkeit: {forecast.daily.precipitation_probability_max[0]}%
                  </Typography>
                  <Typography variant="body2" color="inherit" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
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
                <Typography variant="h4" color="inherit" sx={{ mb: 1, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                  {getWeatherCode(forecast.daily.weather_code[0])}
                </Typography>
              </Box>
            </Box>
          )}
          <Space h={10} />
          {forecast.hourly && (
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" label={{ value: 'Zeit', position: 'insideBottomRight', offset: -5 }} />
                <YAxis 
                  yAxisId="left" 
                  label={{ value: 'Temperatur (°C)', angle: -90, position: 'insideLeft', offset: 10 }} 
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  label={{ 
                    value: 'Regenmenge (mm)', 
                    angle: -90, 
                    position: 'insideRight', 
                    offset: 15, 
                    dy: -30
                  }} 
                  domain={['auto', 'auto']} 
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  yAxisId="right2" 
                  orientation="right" 
                  label={{ 
                    value: 'Regenwahrscheinlichkeit (%)', 
                    angle: -90, 
                    position: 'insideRight', 
                    offset: 15, 
                    dy: -80  
                  }} 
                  domain={[0, 100]}  
                  tick={{ fontSize: 10 }}
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
        </>
    );
}