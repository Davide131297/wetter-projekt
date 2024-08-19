import React, { useState, useEffect } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';
import { Center, Container, Group, TextInput, Button, Select, Table } from '@mantine/core';
import { FaArrowRight, FaLocationArrow } from "react-icons/fa";

export default function Home() {
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [weatherData, setWeatherData] = useState({ rain: null, temperature: null, time: null });
    const [value, setValue] = useState(''); // Sucheingabe
    const [valueDays, setValueDays] = useState(''); // Tage
    const [searchedData, setSearchedData] = useState([]); // Ergebnisse aus der Suche
    const [searchedLocation, setSearchedLocation] = useState({ latitude: null, longitude: null, countryCode: null });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                    fetchWeatherData(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error("Error fetching location: ", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, []);

    useEffect(() => {
        if (value) {
            fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${value}&count=3&language=de&format=json`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    setSearchedData(data.results || []);
                });
        }
    }, [value]);

    const fetchWeatherData = (latitude, longitude) => {
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,rain&timezone=Europe%2FLondon&forecast_days=${valueDays || 7}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setWeatherData({
                    rain: data.hourly.rain,
                    temperature: data.hourly.temperature_2m,
                    time: data.hourly.time
                });
            });
    };

    const filterData = (data, step) => {
        return data.filter((_, index) => index % step === 0);
    };

    const formatWeatherData = () => {
        const { time, temperature, rain } = weatherData;
        if (!time || !temperature || !rain) return [];
        const step = Math.ceil(time.length / 50); // Adjust step to reduce data points
        const filteredTime = filterData(time, step);
        const filteredTemperature = filterData(temperature, step);
        const filteredRain = filterData(rain, step);
        return filteredTime.map((t, index) => ({
            time: t,
            temperature: filteredTemperature[index],
            rain: filteredRain[index]
        }));
    };

    const formattedWeatherData = formatWeatherData();

    const formatXAxis = (tickItem) => {
        const date = parseISO(tickItem);
        return format(date, 'dd.MM HH:mm');
    };

    function handleSelect(item) {
        console.log(item);
        fetchWeatherData(item.latitude, item.longitude);
    }

    function handleFetchCurrentLocation() {
        if (navigator.geolocation) {
            setValue('');
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                    fetchWeatherData(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error("Error fetching location: ", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }

    return (
        <>
            <Container> 
                <Center>    
                    <h1>Home</h1>
                </Center>
            </Container>

            <Container>
                <Group>
                    <TextInput
                        label="Stadt eingeben"
                        placeholder="Berlin"
                        value={value}
                        onChange={(event) => setValue(event.currentTarget.value)}
                    />
                    <Select 
                        data={[
                            { value: '1', label: '1 Tag' },
                            { value: '3', label: '3 Tage' },
                            { value: '7', label: '7 Tage (Default)' },
                            { value: '14', label: '14 Tage' },
                            { value: '16', label: '16 Tage' }
                          ]}
                        value={valueDays} 
                        onChange={setValueDays} 
                    />
                    <Button onClick={handleFetchCurrentLocation} leftIcon={<FaLocationArrow />}>
                        Standort verwenden
                    </Button>
                </Group>
                    <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Land</Table.Th>
                            <Table.Th>Name</Table.Th>
                            <Table.Th></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {searchedData.map((item, index) => (
                            <Table.Tr key={index}>
                                <Table.Td>
                                    <img src={`https://hatscripts.github.io/circle-flags/flags/${item.country_code.toLowerCase()}.svg`} width="48" alt="Country Flag" />
                                </Table.Td>
                                <Table.Td>{item.name}</Table.Td>
                                <Table.Td>
                                    <Button 
                                        rightSection={<FaArrowRight size={14} />}
                                        onClick={() => {handleSelect(item)}}
                                    >
                                        Ansehen
                                    </Button>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Container>

            {searchedLocation.latitude && searchedLocation.longitude && searchedLocation.countryCode ? (
                <img src={`https://hatscripts.github.io/circle-flags/flags/${searchedLocation.countryCode}.svg`} width="48" alt="Country Flag" />
            ) : null}

            {location.latitude && location.longitude ? (
                <>
                    <Container>
                        <ComposedChart width={800} height={280} data={formattedWeatherData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="time" tickFormatter={formatXAxis} interval={10} angle={-45} textAnchor="end" tickLine={false} />
                            <YAxis yAxisId="left" label={{ value: '°C', angle: -90, position: 'insideLeft' }} />
                            <YAxis yAxisId="right" orientation="right" label={{ value: 'mm', angle: -90, position: 'insideLeft', offset: 20 }} />
                            <Tooltip />
                            <Legend verticalAlign="top" align="right" />
                            <Bar yAxisId="right" dataKey="rain" fill="#000099" />
                            <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#ff3300" />
                        </ComposedChart>
                    </Container>
                </>
            ) : (
                <p>Fetching location...</p>
            )}
        </>
    );
}