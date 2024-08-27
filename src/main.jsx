import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import Root from "./root";

import Home from "./routes/home";
import Forecast from './routes/forecast';
import HistoricalWeather from './routes/historicalWeather';

//CSS
import './index.css';
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/dates/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const router = (
  <Router>
    <Routes>
      <Route path="/" element={<Root />}>
        <Route index element={<Home />} />
        <Route path="forecast/:param1/:param2/:param3/:param4" element={<Forecast />} />
        <Route path="historicalWeather" element={<HistoricalWeather />} />
        {/* Weitere Routen */}
      </Route>
    </Routes>
  </Router>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider>
      <div id='content'>
        {router}
      </div>
    </MantineProvider>
  </StrictMode>,
);