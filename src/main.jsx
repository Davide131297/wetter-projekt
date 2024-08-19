import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { MantineProvider } from '@mantine/core';
import Root from "./root";

import Home from "./routes/home";
import Forecast from './routes/forecast';

//CSS
import './index.css';
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/forecast/:param1/:param2",
        element: <Forecast />,
      },
      // Weitere Routen
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider>
      <div id='content'>
        <RouterProvider router={router} />
      </div>
    </MantineProvider>
  </StrictMode>,
);