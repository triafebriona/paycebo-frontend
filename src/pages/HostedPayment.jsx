import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { payments } from '../services/api';
import { createGlobalStyle } from 'styled-components';

const HostedPayment = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [branding, setBranding] = useState({
    primary_color: '#6366F1',
    accent_color: '#4F46E5',
    background_color: '#F9FAFB',
    text_color: '#111827',
    button_text_color: '#FFFFFF',
    font_family: 'Inter, system-ui, sans-serif',
    border_radius: '0.5rem',
    show_powered_by: true
  });

  useEffect(() => {
    fetchPaymentDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId]);

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      const response = await payments.getPaymentPage(paymentId);
      setPaymentDetails(response.data);
      
      // Set branding if available
      if (response.data.branding) {
        setBranding(response.data.branding);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load payment details');
    } finally {
      setLoading(false);
    }
  };
  
  // Create dynamic styles based on branding
  const BrandingStyles = createGlobalStyle`
    .payment-container {
      background-color: ${branding.background_color};
      color: ${branding.text_color};
      font-family: ${branding.font_family};
    }
    
    .payment-card {
      border-radius: ${branding.border_radius};
    }
    
    .payment-button {
      background-color: ${branding.primary_color};
      color: ${branding.button_text_color};
      border-radius: ${branding.border_radius};
    }
    
    .payment-button:hover {
      background-color: ${branding.accent_color};
    }
    
    .payment-input {
      border-radius: ${branding.border_radius};
    }
    
    .payment-input:focus {
      border-color: ${branding.primary_color};
      box-shadow: 0 0 0 1px ${branding.primary_color};
    }
    
    .payment-text {
      color: ${branding.text_color};
    }
    
    .payment-brand-color {
      color: ${branding.primary_color};
    }
    
    .payment-brand-bg {
      background-color: ${branding.primary_color};
    }
  `;

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 16) {
      setCardNumber(value);
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    if (value.length <= 5) {
      setExpiry(value);
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handleSubmitCard = (e) => {
    e.preventDefault();
    
    if (cardNumber.length !== 16) {
      setError('Card number must be 16 digits');
      return;
    }
    
    if (expiry.length !== 5) {
      setError('Expiry must be in MM/YY format');
      return;
    }
    
    if (cvv.length !== 3) {
      setError('CVV must be 3 digits');
      return;
    }
    
    setError('');
    setShowOtp(true);
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }
    
    try {
      setSubmitting(true);
      const response = await payments.submitPayment({
        payment_id: paymentId,
        card_number: cardNumber,
        expiry,
        cvv,
        otp
      });
      
      // Check if there's a redirect URL in the response
      if (response.data.redirect_url) {
        // Check if the redirect URL is the payment-result page in our app
        const isInternalRedirect = response.data.redirect_url.includes('/payment-result');
        
        if (isInternalRedirect) {
          // Use React Router for internal redirects to keep state
          navigate('/payment-result', { 
            state: { 
              status: response.data.status,
              paymentId: response.data.payment_id
            } 
          });
        } else {
          // For external redirects, use window.location with status in query params
          const redirectUrl = new URL(response.data.redirect_url);
          redirectUrl.searchParams.append('status', response.data.status);
          redirectUrl.searchParams.append('payment_id', response.data.payment_id);
          window.location.href = redirectUrl.toString();
        }
      } else {
        // Fallback to payment result page if no redirect URL
        navigate('/payment-result', { 
          state: { 
            status: response.data.status,
            paymentId: response.data.payment_id
          } 
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment processing failed');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl">Loading payment details...</p>
      </div>
    );
  }

  if (error && !paymentDetails) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <BrandingStyles />
      <div className="min-h-screen payment-container flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 payment-card shadow-card max-w-md w-full border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            {branding.logo_url ? (
              <img 
                src={branding.logo_url} 
                alt="Merchant Logo" 
                className="h-8 w-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <svg className="w-8 h-8 payment-brand-color" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8V16M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
            <h1 className="text-2xl font-bold payment-text">{branding.logo_url ? 'Secure Checkout' : 'PayCebo'}</h1>
          </div>
          <div className="flex items-center space-x-1 bg-green-50 px-3 py-1 rounded-full">
            <svg className="w-4 h-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-green-700 font-medium">Secure Payment</span>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Amount</span>
            <span className="font-bold text-xl text-gray-800">
              {paymentDetails?.amount} {paymentDetails?.currency}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Payment ID</span>
            <span className="font-mono text-sm text-gray-700">{paymentId.substring(0, 8)}...</span>
          </div>
        </div>
        
        {!showOtp ? (
          <form onSubmit={handleSubmitCard} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="card-number">
                Card Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                </div>
                              <input
                id="card-number"
                type="text"
                className="pl-10 w-full px-4 py-3 border border-gray-300 payment-input focus:outline-none focus:ring-2 transition duration-200"
                placeholder="4111 1111 1111 1111"
                value={cardNumber}
                onChange={handleCardNumberChange}
                required
              />
              </div>
              <p className="text-xs text-gray-500 mt-1 pl-1">
                Use 4111 1111 1111 1111 for success or 5500 0000 0000 0004 for failure
              </p>
            </div>
            
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="expiry">
                  Expiry Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="expiry"
                    type="text"
                    className="pl-10 w-full px-4 py-3 border border-gray-300 payment-input focus:outline-none focus:ring-2 transition duration-200"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={handleExpiryChange}
                    required
                  />
                </div>
              </div>
              
              <div className="w-1/2">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="cvv">
                  CVV
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="cvv"
                    type="text"
                    className="pl-10 w-full px-4 py-3 border border-gray-300 payment-input focus:outline-none focus:ring-2 transition duration-200"
                    placeholder="123"
                    value={cvv}
                    onChange={handleCvvChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full payment-button font-medium py-3 px-4 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm transition duration-200"
            >
              Continue to Payment
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmitPayment} className="space-y-6">
            <div className="text-center">
              <label className="block text-gray-700 text-lg font-medium mb-3" htmlFor="otp">
                Enter One-Time Password
              </label>
              <p className="text-sm text-gray-500 mb-4">
                A verification code has been sent to your registered mobile number
              </p>
              <div className="flex justify-center">
                <input
                  id="otp"
                  type="text"
                  className="w-48 py-3 border border-gray-300 payment-input focus:outline-none focus:ring-2 transition duration-200 text-center text-2xl tracking-widest"
                  placeholder="123456"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Enter any 6 digits for this demo
              </p>
            </div>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full payment-button font-medium py-3 px-4 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm transition duration-200"
              disabled={submitting}
            >
              {submitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Payment...
                </div>
              ) : 'Complete Payment'}
            </button>
          </form>
        )}
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4">
            <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-gray-600">
              This is a test payment gateway. No real money will be charged.
            </p>
          </div>
          
          <div className="flex justify-center mt-4 space-x-6">
            <img src="https://cdn-icons-png.flaticon.com/128/196/196578.png" alt="Visa" className="h-8" />
            <img src="https://cdn-icons-png.flaticon.com/128/196/196561.png" alt="MasterCard" className="h-8" />
            <img src="https://cdn-icons-png.flaticon.com/128/196/196539.png" alt="Amex" className="h-8" />
            <img src="https://cdn-icons-png.flaticon.com/128/196/196581.png" alt="Discover" className="h-8" />
          </div>
        </div>
      </div>
      {branding.show_powered_by && (
        <div className="text-center py-4 text-xs text-gray-500">
          Powered by <span className="payment-brand-color font-medium">PayCebo</span>
        </div>
      )}
    </div>
    </>
  );
};

export default HostedPayment;