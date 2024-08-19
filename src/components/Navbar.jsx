import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Logo from '../assets/WeatherLogo.png';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';

export default function Navigation() {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

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

  const getFlagUrl = (countryCode) => {
    return `https://hatscripts.github.io/circle-flags/flags/${countryCode.toLowerCase()}.svg`;
  };

  const handleOptionChange = (event, value) => {
    console.log('Selected option:', value);
    if (value) {
      navigate(`/forecast/${value.latitude}/${value.longitude}/${value.name}`);
    }
  };

  return (
    <>
      <Navbar fixed="top" bg="primary" data-bs-theme="dark">
        <Container className="d-flex align-items-center">
          <Navbar.Brand href="/" className="me-3">
            <img
              alt=""
              src={Logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            Wetter-App
          </Navbar.Brand>
          <Autocomplete
            options={options}
            getOptionLabel={(option) => option.name}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            onChange={handleOptionChange}
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
            renderInput={(params) => <TextField {...params} label="Standort suchen" variant="outlined" />}
            sx={{ width: 300 }} // Hier die Breite des Autocomplete-Feldes anpassen
          />
        </Container>
      </Navbar>
    </>
  );
}