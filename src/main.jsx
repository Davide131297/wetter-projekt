import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { MantineProvider } from '@mantine/core';
import './index.css'
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Root from "./routes/root";
import Home from "./routes/home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider>
      <Root />
      <RouterProvider router={router} />
    </MantineProvider>
  </StrictMode>,
)
