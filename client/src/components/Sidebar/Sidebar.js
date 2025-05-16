import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTshirt, FaHome, FaUser, FaCog, FaShoppingBag, FaChevronLeft, FaRegCalendarAlt, FaPlusSquare, FaSignOutAlt } from 'react-icons/fa';
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
    { path: '/add-item', icon: <FaShoppingBag />, label: 'Add to Wardrobe' },
    { path: '/create-outfit', icon: <FaPlusSquare />, label: 'Create Outfit' },
    { path: '/calendar', icon: <FaRegCalendarAlt />, label: 'Calendar Planner' },
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