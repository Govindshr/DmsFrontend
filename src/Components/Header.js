import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = () => {
  
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
        <FontAwesomeIcon icon={faSearch} style={{color:'#333'}} className="header-icon" />
        <FontAwesomeIcon icon={faBell} style={{color:'#333'}} className="header-icon" />
        <div className="profile">
          <img src="./images/IMG_20220221_231310_117.jpg" alt="Profile" className="profile-pic" />
          {/* <span className="profile-name">Klubba</span> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
