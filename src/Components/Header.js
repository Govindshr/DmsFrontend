import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, } from '@fortawesome/free-solid-svg-icons';
import { faSignOut } from '@fortawesome/free-solid-svg-icons/faSignOut';
import { useAuth } from '../context/AuthContext'; // Import the Auth context
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };
  return (
    <header className="header">
      <div className="logo-section">
        {/* <img src="your-logo-url-here.png" alt="Logo" className="logo" /> */}
        <div className="brand">
          <h1>DMS</h1>
          {/* <p>live your passion!</p> */}
        </div>
      </div>
      <div className="header-actions">
        <FontAwesomeIcon icon={faSearch} style={{ color: '#333' }} className="header-icon" />
      
        <FontAwesomeIcon
          icon={faSignOut}
          style={{ cursor: 'pointer' , color: '#333'}}
          className="header-icon" 
          data-tooltip-id="packed-tooltip"
          data-tooltip-content="Log Out"
          onClick={() => handleLogout()}
        />
        <Tooltip id="packed-tooltip" place="top" type="dark" effect="solid" />
        <div className="profile">
          <img src="./images/IMG_20220221_231310_117.jpg" alt="Profile" className="profile-pic" />
          {/* <span className="profile-name">Klubba</span> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
