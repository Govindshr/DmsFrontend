import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Import the Auth context you will create
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
import Login from './Pages/Login';
import './App.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth(); // Use the user from AuthContext
  const shouldRenderHeaderAndSidebar = location.pathname !== '/login' && user;

  return (
    <div className="App">
      {shouldRenderHeaderAndSidebar && <Header />}
      <div className="content-area">
        {shouldRenderHeaderAndSidebar && <Sidebar />}
        <div className="main-content">{children}</div>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider> {/* Wrap everything in AuthProvider to make context available */}
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/inventory" element={<ProtectedRoute><AddItems /></ProtectedRoute>} />
            <Route path="/add-order" element={<ProtectedRoute><AddOrder /></ProtectedRoute>} />
            <Route path="/order-life" element={<ProtectedRoute><OrderLife /></ProtectedRoute>} />
            <Route path="/expense" element={<ProtectedRoute><Expense /></ProtectedRoute>} />
            <Route path="/extra-sweets" element={<ProtectedRoute><ExtraSweets /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
            <Route path="/edit-order/:id" element={<ProtectedRoute><EditOrder /></ProtectedRoute>} />
            {/* Add more protected routes as needed */}
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
