// Datei: routes/root.jsx
import { Outlet } from "react-router-dom";
import Navigation from "./components/Navbar"; // Beispiel für eine Navbar-Komponente

const Root = () => {
  return (
    <div>
      <Navigation />
      <Outlet /> {/* Hier wird der Inhalt der untergeordneten Routen gerendert */}
    </div>
  );
};

export default Root;