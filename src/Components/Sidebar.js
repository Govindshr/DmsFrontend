// src/components/Sidebar.js

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faList, faTag, faFile } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState(location.pathname);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleItemClick = (path) => {
    setSelectedItem(path);
    setIsSidebarOpen(false); // Close sidebar on item click (for mobile)
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ marginTop: '20px' }}>
          <img src='./images/logo.jpg' height={100} width={200} alt="Logo" />
        </div>
        <ul>
          <li className={selectedItem === '/dashboard' ? 'active' : ''}>
            <Link to="/dashboard" onClick={() => handleItemClick('/dashboard')}>
              <FontAwesomeIcon icon={faHouse} className="fa-icon" />
              Dashboard
            </Link>
          </li>
          <li className={selectedItem === '/order-life' ? 'active' : ''}>
            <Link to="/order-life" onClick={() => handleItemClick('/order-life')}>
              <FontAwesomeIcon icon={faList} className="fa-icon" />
              Order Status
            </Link>
          </li>
          <li className={selectedItem === '/add-order' ? 'active' : ''}>
            <Link to="/add-order" onClick={() => handleItemClick('/add-order')}>
              <FontAwesomeIcon icon={faTag} className="fa-icon" />
              Add New Order
            </Link>
          </li>
          <li className={selectedItem === '/expense' ? 'active' : ''}>
            <Link to="/expense" onClick={() => handleItemClick('/expense')}>
              <FontAwesomeIcon icon={faFile} className="fa-icon" />
              Expense
            </Link>
          </li>
          <li className={selectedItem === '/report' ? 'active' : ''}>
            <Link to="/report" onClick={() => handleItemClick('/report')}>
              <FontAwesomeIcon icon={faFile} className="fa-icon" />
              Reports
            </Link>
          </li>
        </ul>
      </div>

      <div className="hamburger" onClick={toggleSidebar}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>
  );
};

export default Sidebar;
