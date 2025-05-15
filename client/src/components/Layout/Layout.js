import React from 'react';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="main-content">
      <div className="page-container">
        {children}
      </div>
    </div>
  );
};

export default Layout; 