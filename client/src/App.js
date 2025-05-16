import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage"; // Importă pagina HomePage
import Dashboard from "./components/Dashboard/Dashboard"; // Pagină de dashboard
import ProfilePage from "./components/ProfilePage/ProfilePage";
import Wardrobe from './components/Wardrobe/Wardrobe';
import Sidebar from './components/Sidebar/Sidebar';
import CalendarPlanner from './components/CalendarPlanner/CalendarPlanner';
import CreateOutfit from './components/CreateOutfit/CreateOutfit';

// Create a wrapper component to handle the conditional rendering
const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="app">
      {!isHomePage && <Sidebar />}
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Ruta pentru pagina home */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Adaugă dashboard-ul */}
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/wardrobe" element={<Wardrobe />} />
        <Route path="/calendar" element={<CalendarPlanner />} />
        <Route path="/create-outfit" element={<CreateOutfit />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
