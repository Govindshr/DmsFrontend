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
import AddRetailOrders from './Pages/AddRetailOrder';

const Layout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth(); // Use the user from AuthContext
const shouldRenderHeaderAndSidebar = true;


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
            <Route path="/login" element={<Login /> } />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<AddItems />} />
            <Route path="/add-order" element={<AddOrder />} />
            <Route path="/retail-order" element={<AddRetailOrders/>}/>
            <Route path="/order-life" element={<OrderLife />} />
            <Route path="/expense" element={<Expense />} />
            <Route path="/extra-sweets" element={<ExtraSweets />} />
            <Route path="/report" element={<Report />} />
            <Route path="/edit-order/:id" element={<EditOrder />} />
            {/* Add more protected routes as needed */}
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
