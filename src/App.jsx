import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MerchantDashboard from './pages/MerchantDashboard';
import HostedPayment from './pages/HostedPayment';
import PaymentResult from './pages/PaymentResult';
import ProtectedRoute from './components/ProtectedRoute';
import PaymentRedirectPage from './pages/PaymentRedirectPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <MerchantDashboard />
            </ProtectedRoute>
          } />
          <Route path="/payment/:paymentId" element={<HostedPayment />} />
          <Route path="/payment-result" element={<PaymentResult />} />
          <Route path="/payment-finish" element={<PaymentResult />} />
          <Route path="/pay" element={<PaymentRedirectPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;