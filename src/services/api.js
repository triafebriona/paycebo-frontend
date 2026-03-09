import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const auth = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data)
};

export const payments = {
  createPayment: (data, apiKey) => api.post('/api/create-payment', data, {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  }),
  getAllPayments: () => api.get('/api/payments'),
  getPaymentDetails: (paymentId) => api.get(`/api/payment/${paymentId}`),
  // API for getting payment details for the hosted payment page
  getPaymentPage: (paymentId) => api.get(`/payment/${paymentId}`),
  // API for submitting payment details
  submitPayment: (data) => api.post('/payment/submit', data)
};

export const webhooks = {
  setWebhook: (url) => api.post('/api/webhook', { url }),
  getWebhook: () => api.get('/api/webhook')
};

export const testCards = {
  getAll: () => api.get('/api/testcards'),
  getById: (id) => api.get(`/api/testcards/${id}`),
  create: (data) => api.post('/api/testcards', data),
  update: (id, data) => api.put(`/api/testcards/${id}`, data),
  delete: (id) => api.delete(`/api/testcards/${id}`)
};

export const branding = {
  get: () => api.get('/api/branding'),
  update: (data) => api.put('/api/branding', data),
  getPaymentPageBranding: (merchantId) => api.get(`/api/branding/payment/${merchantId}`)
};

export const analytics = {
  getDashboardStats: () => api.get('/api/analytics/dashboard'),
  getTransactionsByDate: (period = 'month') => api.get(`/api/analytics/transactions-by-date?period=${period}`),
  getTransactionsByStatus: () => api.get('/api/analytics/transactions-by-status'),
  getTransactionsByCurrency: () => api.get('/api/analytics/transactions-by-currency'),
  getAmountDistribution: () => api.get('/api/analytics/amount-distribution')
};

export default api;