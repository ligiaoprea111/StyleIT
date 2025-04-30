import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage"; // Importă pagina HomePage
import Dashboard from "./components/Dashboard/Dashboard"; // Pagină de dashboard
import ProfilePage from "./components/ProfilePage/ProfilePage";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Ruta pentru pagina home */}
          <Route path="/dashboard" element={<Dashboard />} /> {/* Adaugă dashboard-ul */}
          <Route path="/profile" element={<ProfilePage userId={1} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
