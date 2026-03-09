import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ApiKeyDisplay from '../components/ApiKeyDisplay';
import WebhookSetup from '../components/WebhookSetup';
import TransactionList from '../components/TransactionList';
import PaymentForm from '../components/PaymentForm';
import TestCardManager from '../components/TestCardManager';
import BrandingManager from '../components/BrandingManager';
import { payments } from '../services/api';

const MerchantDashboard = () => {
  const [merchant, setMerchant] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('transactions');

  useEffect(() => {
    const merchantData = localStorage.getItem('merchant');
    if (merchantData) {
      setMerchant(JSON.parse(merchantData));
    }
    
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await payments.getAllPayments();
      setTransactions(response.data);
    } catch (err) {
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentCreated = () => {
    fetchTransactions();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'transactions':
        return (
          <div className="mt-6">
            {loading ? (
              <p className="text-center">Loading transactions...</p>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : (
              <TransactionList transactions={transactions} />
            )}
          </div>
        );
      case 'api':
        return (
          <div className="mt-6">
            {merchant && <ApiKeyDisplay apiKey={merchant.api_key} />}
          </div>
        );
      case 'webhook':
        return (
          <div className="mt-6">
            <WebhookSetup />
          </div>
        );
      case 'test':
        return (
          <div className="mt-6">
            <PaymentForm onSuccess={handlePaymentCreated} />
          </div>
        );
      case 'testcards':
        return (
          <div className="mt-6">
            <TestCardManager />
          </div>
        );
      case 'branding':
        return (
          <div className="mt-6">
            <BrandingManager />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Merchant Dashboard" />
      
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome, {merchant ? merchant.name : 'Merchant'}
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your payments and integration settings
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                </svg>
                <span className="font-medium">Sandbox Mode</span>
              </div>
              
              <button 
                onClick={() => setActiveTab('test')}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path>
                </svg>
                New Payment
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">Total Transactions</h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">All time</span>
            </div>
            <div className="mt-2">
              <div className="text-3xl font-bold text-gray-900">{transactions.length}</div>
              <div className="text-sm text-gray-500 mt-1">Processed payments</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">Success Rate</h3>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Last 30 days</span>
            </div>
            <div className="mt-2">
              <div className="text-3xl font-bold text-gray-900">
                {transactions.length ? 
                  Math.round((transactions.filter(t => t.status === 'success').length / transactions.length) * 100) + '%' 
                  : '0%'}
              </div>
              <div className="text-sm text-gray-500 mt-1">Payment success rate</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">API Status</h3>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Online</span>
            </div>
            <div className="mt-2">
              <div className="text-3xl font-bold text-gray-900">100%</div>
              <div className="text-sm text-gray-500 mt-1">Uptime in last 24h</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">Webhook Status</h3>
              <span className={`${activeTab === 'webhook' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                {activeTab === 'webhook' ? 'Configure' : 'Active'}
              </span>
            </div>
            <div className="mt-2">
              <div className="text-3xl font-bold text-gray-900">{activeTab === 'webhook' ? 'Setup' : 'Ready'}</div>
              <div className="text-sm text-gray-500 mt-1">Notification delivery</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              <button
                className={`px-6 py-4 font-medium text-sm flex items-center ${
                  activeTab === 'transactions'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('transactions')}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"></path>
                </svg>
                Transactions
              </button>
              <button
                className={`px-6 py-4 font-medium text-sm flex items-center ${
                  activeTab === 'api'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('api')}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h10v4H5V6zm10 6H5v2h10v-2z" clipRule="evenodd"></path>
                  <path d="M15 7h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1V6a1 1 0 112 0v1z"></path>
                </svg>
                API Keys
              </button>
              <button
                className={`px-6 py-4 font-medium text-sm flex items-center ${
                  activeTab === 'webhook'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('webhook')}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                </svg>
                Webhooks
              </button>
              <button
                className={`px-6 py-4 font-medium text-sm flex items-center ${
                  activeTab === 'test'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('test')}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z"></path>
                </svg>
                Test Payment
              </button>
              <button
                className={`px-6 py-4 font-medium text-sm flex items-center ${
                  activeTab === 'testcards'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('testcards')}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                  <path d="M8 11a1 1 0 100-2 1 1 0 000 2zm0 0a1 1 0 000 2m0-2v2m0-6V4m0 6h2m-2 0h-2" />
                </svg>
                Test Cards
              </button>
              <button
                className={`px-6 py-4 font-medium text-sm flex items-center ${
                  activeTab === 'branding'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('branding')}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                </svg>
                Branding
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantDashboard;