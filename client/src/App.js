import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage"; // Importă pagina HomePage
import LoginPage from "./components/LoginPage/LoginPage"; // Importă LoginPage
import Dashboard from "./components/Dashboard/Dashboard"; // Pagină de dashboard

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Ruta pentru pagina home */}
          <Route path="/login" element={<LoginPage />} /> {/* Corectat ruta pentru login */}
          <Route path="/dashboard" element={<Dashboard />} /> {/* Adaugă dashboard-ul */}
          {/* Alte rute */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
