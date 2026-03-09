import React, { useState, useEffect } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom';

const PaymentResult = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  
  useEffect(() => {
    // First try to get state from location (React Router navigation)
    if (location.state?.status) {
      setPaymentStatus(location.state.status);
      setPaymentId(location.state.paymentId);
    } 
    // If no state, try to get from URL params (direct access or redirect)
    else {
      const statusParam = searchParams.get('status');
      const paymentIdParam = searchParams.get('payment_id');
      
      if (statusParam) {
        setPaymentStatus(statusParam);
      } else {
        // Default to failed if no status is provided
        setPaymentStatus('failed');
      }
      
      if (paymentIdParam) {
        setPaymentId(paymentIdParam);
      }
    }
  }, [location.state, searchParams]);
  
  const isSuccess = paymentStatus === 'success';
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
          isSuccess ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {isSuccess ? (
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        
        <h1 className={`text-2xl font-bold mt-6 ${
          isSuccess ? 'text-green-600' : 'text-red-600'
        }`}>
          Payment {isSuccess ? 'Successful' : 'Failed'}
        </h1>
        
        {paymentId && (
          <p className="text-gray-600 mt-2">
            Payment ID: {paymentId}
          </p>
        )}
        
        <p className="text-gray-600 mt-4">
          {isSuccess 
            ? 'Your payment has been processed successfully.' 
            : 'There was an issue processing your payment. Please try again.'}
        </p>
        
        <div className="mt-8">
          <Link
            to="/dashboard"
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-sm transition duration-200"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;