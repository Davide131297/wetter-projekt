import React, { useState, useEffect } from "react";
import { Space, Center, SimpleGrid, Checkbox } from "@mantine/core";
import Autocomplete from '@mui/material/Autocomplete';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/de'; // Importieren Sie die deutsche Lokalisierung für dayjs
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert'; // Importieren Sie die Alert-Komponente
import { Grid, Container } from '@mui/material';
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { is } from "date-fns/locale";

dayjs.locale('de'); // Setzen Sie die Lokalisierung auf Deutsch

export default function HistoricalWeather() {
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [valueStart, setValueStart] = useState(null);
    const [valueEnd, setValueEnd] = useState(null);
    const [checked, setChecked] = useState({tempMax: null, tempMin: null, tempMean: null, rainSumm: null, snowSumm: null, sunshineDuration: null});  
    const [alertMessage, setAlertMessage] = useState(''); // Zustand für die Alert-Nachricht
    const [chartData, setChartData] = useState([]); // Zustand für die Diagrammdaten

    useEffect(() => {
        if (inputValue) {
          fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${inputValue}&count=3&language=de&format=json`)
            .then(response => response.json())
            .then(data => {
              if (data.results) {
                const uniqueResults = data.results.filter((item, index, self) =>
                  index === self.findIndex((t) => (
                    t.name === item.name && t.country === item.country
                  ))
                );
                setOptions(uniqueResults || []);
              } else {
                setOptions([]);
              }
            })
            .catch(error => {
              console.error('Error fetching data:', error);
            });
        }
    }, [inputValue]);

    useEffect(() => {
        const isCheckedNotNull = Object.values(checked).some(value => value !== null);
        if (selectedOption && valueStart && valueEnd && isCheckedNotNull) {
            setAlertMessage('');
        }
    }, [selectedOption, valueStart, valueEnd, checked]);

    useEffect(() => {
        console.log('chartData:', chartData);
    }, [chartData]);

    const getFlagUrl = (countryCode) => {
        return `https://hatscripts.github.io/circle-flags/flags/${countryCode.toLowerCase()}.svg`;
    };

    const handleCheckboxChange = (event) => {
        const { id, checked } = event.target;
        setChecked((prevState) => ({
            ...prevState,
            [id]: checked
        }));
    };

    const getSelectedParameters = () => {
        const params = [];
        if (checked.tempMax) params.push("temperature_2m_max");
        if (checked.tempMin) params.push("temperature_2m_min");
        if (checked.tempMean) params.push("temperature_2m_mean");
        if (checked.rainSumm) params.push("rain_sum");
        if (checked.snowSumm) params.push("snowfall_sum");
        if (checked.sunshineDuration) params.push("sunshine_duration");
        return params.join(",");
    };

    const isAnyCheckboxChecked = () => {
        return Object.values(checked).some(value => value);
    };

    function handleShowHistoricalWeather() {
        if (!selectedOption) {
            setAlertMessage('Kein Standort ausgewählt');
            return;
        } else if (!valueStart || !valueEnd) {
            setAlertMessage('Kein Start- oder Enddatum ausgewählt');
            return;
        } else if (!isAnyCheckboxChecked()) {
            setAlertMessage('Mindestens eine Option muss ausgewählt werden');
            return;
        } else {
            const selectedParams = getSelectedParameters();
            const formattedStartDate = valueStart && dayjs(valueStart).isValid() ? dayjs(valueStart).format('YYYY-MM-DD') : null;
            const formattedEndDate = valueEnd && dayjs(valueEnd).isValid() ? dayjs(valueEnd).format('YYYY-MM-DD') : null;
        
            if (!formattedStartDate || !formattedEndDate) {
                console.error('Ungültiges Start- oder Enddatum');
                return;
            }
            console.log('Daten werden abgerufen...');
            fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${selectedOption.latitude}&longitude=${selectedOption.longitude}&start_date=${formattedStartDate}&end_date=${formattedEndDate}&daily=${selectedParams}&timezone=auto`)
                .then(response => response.json())
                .then(data => {
                    console.log('data:', data);
                    if (data && data.daily && data.daily.time) {
                        const formattedData = data.daily.time.map((time, index) => ({
                            time,
                            temperature_2m_max: (data.daily.temperature_2m_max && data.daily.temperature_2m_max[index]) || null,
                            temperature_2m_min: (data.daily.temperature_2m_min && data.daily.temperature_2m_min[index]) || null,
                            temperature_2m_mean: (data.daily.temperature_2m_mean && data.daily.temperature_2m_mean[index]) || null,
                            rain_sum: (data.daily.rain_sum && data.daily.rain_sum[index]) || null,
                            snowfall_sum: (data.daily.snowfall_sum && data.daily.snowfall_sum[index]) || null,
                            sunshine_duration: (data.daily.sunshine_duration && (data.daily.sunshine_duration[index] / 3600).toFixed(2))|| null
                        }));
                        setChartData(formattedData);
                    }
                })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        }
    }

    return (
        <>
        <Space h="md" />
        <Center>
            <h1>Historisches Wetter</h1>
        </Center>
        <Space h="md" />
        <div>
            <Center>
                <h4>Standort und Zeit</h4>
            </Center>
        </div>
        <Center>
            <div>
            <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center' }}>
                <Grid container spacing={2} justifyContent="center" sx={{ width: isMobile ? 230 : '100%' }}>
                    <Grid item xs={12} sm={4}>
                        <Autocomplete
                            options={options}
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            onInputChange={(event, newInputValue) => {
                                setInputValue(newInputValue);
                            }}
                            onChange={(event, newValue) => {
                                setSelectedOption(newValue);
                            }}
                            renderOption={(props, option) => (
                                <Box component="li" {...props} key={`${option.name}-${option.country_code}`}>
                                    <Avatar
                                        alt={option.country_code}
                                        src={getFlagUrl(option.country_code)}
                                        sx={{ width: 24, height: 24, marginRight: 1 }}
                                    />
                                    {option.name}
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField 
                                    {...params} 
                                    label="Standort suchen" 
                                    variant="outlined" 
                                    sx={{ width: isMobile ? 207 : '100%' }}
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: selectedOption ? (
                                            <Avatar
                                                alt={selectedOption.country_code}
                                                src={getFlagUrl(selectedOption.country_code)}
                                                sx={{ width: 24, height: 24, marginRight: 1 }}
                                            />
                                        ) : null,
                                    }}
                                />
                            )}
                            noOptionsText="Keine Ergebnisse gefunden"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                            <DatePicker
                                label="Startdatum wählen"
                                value={valueStart}
                                onChange={(newValue) => setValueStart(newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                                inputFormat="DD.MM.YYYY"
                                format="DD.MM.YYYY"
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                            <DatePicker
                                label="Enddatum wählen"
                                value={valueEnd}
                                onChange={(newValue) => setValueEnd(newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                                inputFormat="DD.MM.YYYY"
                                format="DD.MM.YYYY"
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>
            </Container>
            </div>
        </Center>
        <Space h="md" />
        <Center>
            <h4>Optionen</h4>
        </Center>
        <Center>
            <Box>
            <SimpleGrid cols={2} spacing="sm">
                    <div>
                        <Checkbox id="tempMax" label="Maximale Temperatur" onChange={handleCheckboxChange} />
                    </div>
                    <div>
                        <Checkbox id="tempMin" label="Minimale Temperatur" onChange={handleCheckboxChange} />
                    </div>
                    <div>
                        <Checkbox id="tempMean" label="Durchschnittstemperatur" onChange={handleCheckboxChange} />
                    </div>
                    <div>
                        <Checkbox id="rainSumm" label="Regensumme" onChange={handleCheckboxChange} />
                    </div>
                    <div>
                        <Checkbox id="snowSumm" label="Schneesumme" onChange={handleCheckboxChange} />
                    </div>
                    <div>
                        <Checkbox id="sunshineDuration" label="Sonnenstunden" onChange={handleCheckboxChange} />
                    </div>
                </SimpleGrid>
            </Box>
        </Center>
        <Space h="md" />
        <Center>
            <Button 
                variant="contained" 
                onClick={handleShowHistoricalWeather}
            >
                Historische Wetterdaten anzeigen
            </Button>
        </Center>
        {alertMessage && (
            <Center>
                <Alert severity="error">{alertMessage}</Alert>
            </Center>
        )}
        <Space h="md" />
        <Center>
            <ResponsiveContainer width="95%" height={400}>
                <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="time"
                        tickFormatter={(time) => {
                            const parsedDate = new Date(time);
                            if (!isNaN(parsedDate)) {
                            const options = { day: '2-digit', month: '2-digit' };
                            return parsedDate.toLocaleDateString('de-DE', options);
                            }
                            return '';
                        }}
                    />
                    <YAxis 
                        yAxisId="left" 
                        label={{ value: 'Temperatur (°C)', angle: -90, position: 'insideLeft', offset: 10 }} 
                        domain={['auto', 'auto']}
                        tick={{ fontSize: 10 }}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        label={{ value: 'Regen (mm)', angle: -90, position: 'insideRight', offset: 15, dy: -30 }}
                        domain={['auto', 'auto']}
                        tick={{ fontSize: 10 }}
                    />
                    <Tooltip />
                    <Legend />
                    {checked.tempMax && 
                        <Line yAxisId="left" type="monotone" dataKey="temperature_2m_max" name="Maximale Temperatur" stroke="#8884d8" />
                    }
                    {checked.tempMin && 
                        <Line yAxisId="left" type="monotone" dataKey="temperature_2m_min" name="Minimale Temperatur" stroke="#82ca9d" />
                    }
                    {checked.tempMean && 
                        <Line yAxisId="left" type="monotone" dataKey="temperature_2m_mean" name="Durchschnittstemperatur" stroke="#ffc658" />
                    }
                    {checked.rainSumm && 
                        <Bar yAxisId="right" dataKey="rain_sum" fill="#413ea0" name="Regen in mm" />
                    }
                    {checked.snowSumm && 
                        <Bar yAxisId="left" dataKey="snowfall_sum" fill="#ff7300" name="Schnee in cm" />
                    }
                    {checked.sunshineDuration && 
                        <Line yAxisId="left" type="monotone" dataKey="sunshine_duration" name="Sonnenstunden" stroke="#ff7300" />
                    }
                </ComposedChart>
            </ResponsiveContainer>
        </Center>
        </>
    );
}