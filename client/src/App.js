import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage"; // Importă pagina HomePage
import Dashboard from "./components/Dashboard/Dashboard"; // Pagină de dashboard
import Profile from "./components/Profile/Profile";
import Wardrobe from './components/Wardrobe/Wardrobe';
import AddToWardrobe from './components/Wardrobe/AddToWardrobe';
import Sidebar from './components/Sidebar/Sidebar';
import CalendarPlanner from './components/CalendarPlanner/CalendarPlanner';
import AIAssistant from './components/AIAssistant/AIAssistant';
import MyOutfits from './components/MyOutfits/MyOutfits';
import SettingsPage from './components/SettingsPage/SettingsPage';

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
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/wardrobe" element={<Wardrobe />} />
        <Route path="/wardrobe/add" element={<AddToWardrobe />} />
        <Route path="/calendar" element={<CalendarPlanner />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/outfits" element={<MyOutfits />} />
        <Route path="/settings" element={<SettingsPage />} />
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
