// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';
import AddItems from './Pages/Additems';
import AddOrder from './Pages/AddOrder';
import OrderLife from './Pages/OrderLife';
import Dashboard from './Pages/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="content-area">
          <Sidebar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/inventory" />} />
              <Route path="/inventory" element={<AddItems />} />
              <Route path="/add-order" element={<AddOrder />} />
              <Route path="/order-life" element={<OrderLife />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Add more routes as needed */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
