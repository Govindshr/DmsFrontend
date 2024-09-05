// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';
import AddItems from './Pages/Additems';
import AddOrder from './Pages/AddOrder';
import OrderLife from './Pages/OrderLife';
import Dashboard from './Pages/Dashboard';
import Expense from './Pages/Expense';
import Report from './Pages/Report';
import ExtraSweets from './Pages/ExtraSweets';
import EditOrder from './Pages/EditOrder';
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
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/inventory" element={<AddItems />} />
              <Route path="/add-order" element={<AddOrder />} />
              <Route path="/order-life" element={<OrderLife />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/expense" element={<Expense />} />
              <Route path="/extra-sweets" element={<ExtraSweets />} />
              <Route path="/report" element={<Report />} />
              <Route path="/edit-order/:id" element={<EditOrder />} />
              {/* Add more routes as needed */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
