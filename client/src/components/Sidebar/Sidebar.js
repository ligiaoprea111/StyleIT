import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTshirt, FaHome, FaUser, FaCog, FaShoppingBag, FaChevronLeft, FaRegCalendarAlt, FaSignOutAlt, FaRobot, FaFolderOpen } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: <FaHome />, label: 'Home' },
    { path: `/profile/${userId}`, icon: <FaUser />, label: 'Profile' },
    { path: '/wardrobe', icon: <FaTshirt />, label: 'Wardrobe' },
    { path: '/wardrobe/add', icon: <FaShoppingBag />, label: 'Add to Wardrobe' },
    { path: '/outfits', icon: <FaFolderOpen />, label: 'My Outfits' },
    { path: '/calendar', icon: <FaRegCalendarAlt />, label: 'Calendar Planner' },
    { path: '/ai-assistant', icon: <FaRobot />, label: 'AI Assistant' },
    { path: '/settings', icon: <FaCog />, label: 'Settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FaChevronLeft className={`toggle-icon ${isCollapsed ? 'rotated' : ''}`} />
      </button>
      <div className="sidebar-header">
        <img src={process.env.PUBLIC_URL + '/logo_final.png'} alt="StyleIT Logo" className="sidebar-logo" />
        <h3>StyleIT</h3>
      </div>
      <Nav className="flex-column">
        {navItems.map((item) => (
          <Nav.Item key={item.path}>
            <Nav.Link
              as={Link}
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Nav.Link>
          </Nav.Item>
        ))}
        <Nav.Item className="mt-auto">
          <Nav.Link onClick={handleLogout} className="logout-link">
            <span className="nav-icon"><FaSignOutAlt /></span>
            <span className="nav-label">Logout</span>
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default Sidebar; 