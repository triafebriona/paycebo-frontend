import React, { useState, useEffect } from 'react';
import { branding as brandingApi } from '../services/api';

const BrandingManager = () => {
  const [branding, setBranding] = useState({
    logo_url: '',
    primary_color: '#6366F1',
    accent_color: '#4F46E5',
    background_color: '#F9FAFB',
    text_color: '#111827',
    button_text_color: '#FFFFFF',
    font_family: 'Inter, system-ui, sans-serif',
    border_radius: '0.5rem',
    show_powered_by: true
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  
  const fontOptions = [
    'Inter, system-ui, sans-serif',
    'Arial, sans-serif',
    'Helvetica, Arial, sans-serif',
    'Georgia, serif',
    'Roboto, sans-serif',
    'Verdana, sans-serif',
    'Tahoma, sans-serif',
    'Trebuchet MS, sans-serif',
    'Times New Roman, serif'
  ];
  
  const radiusOptions = [
    { label: 'None', value: '0' },
    { label: 'Small', value: '0.25rem' },
    { label: 'Medium', value: '0.5rem' },
    { label: 'Large', value: '0.75rem' },
    { label: 'Extra Large', value: '1rem' },
    { label: 'Full', value: '9999px' }
  ];
  
  useEffect(() => {
    fetchBranding();
  }, []);
  
  const fetchBranding = async () => {
    try {
      setLoading(true);
      const response = await brandingApi.get();
      setBranding({
        logo_url: response.data.logo_url || '',
        primary_color: response.data.primary_color || '#6366F1',
        accent_color: response.data.accent_color || '#4F46E5',
        background_color: response.data.background_color || '#F9FAFB',
        text_color: response.data.text_color || '#111827',
        button_text_color: response.data.button_text_color || '#FFFFFF',
        font_family: response.data.font_family || 'Inter, system-ui, sans-serif',
        border_radius: response.data.border_radius || '0.5rem',
        show_powered_by: response.data.show_powered_by !== false
      });
      setError('');
    } catch (err) {
      setError('Failed to load branding settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBranding(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      setSaving(true);
      await brandingApi.update(branding);
      setSuccess('Branding settings saved successfully');
    } catch (err) {
      setError('Failed to save branding settings');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };
  
  const resetToDefaults = () => {
    setBranding({
      logo_url: '',
      primary_color: '#6366F1',
      accent_color: '#4F46E5',
      background_color: '#F9FAFB',
      text_color: '#111827',
      button_text_color: '#FFFFFF',
      font_family: 'Inter, system-ui, sans-serif',
      border_radius: '0.5rem',
      show_powered_by: true
    });
  };
  
  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">Loading branding settings...</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Payment Page Branding</h2>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
              previewMode 
                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {previewMode ? 'Exit Preview' : 'Preview'}
          </button>
        </div>
      </div>
      
      {previewMode ? (
        <div className="mb-6">
          <div className="p-6 border rounded-lg" style={{
            backgroundColor: branding.background_color,
            color: branding.text_color,
            fontFamily: branding.font_family,
            borderRadius: branding.border_radius
          }}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                {branding.logo_url && (
                  <img 
                    src={branding.logo_url} 
                    alt="Logo" 
                    className="h-10 mr-3" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                      e.target.style.filter = 'grayscale(100%)';
                    }}
                  />
                )}
                <h3 className="text-xl font-bold" style={{ color: branding.text_color }}>
                  {branding.logo_url ? 'Your Company' : 'PayCebo'}
                </h3>
              </div>
              <div className="text-sm font-medium" style={{ color: branding.text_color }}>
                ₹100.00
              </div>
            </div>
            
            <div className="mb-6 p-4 rounded-lg" style={{ 
              backgroundColor: `${branding.background_color === '#F9FAFB' ? '#FFFFFF' : '#F9FAFB'}`,
              borderRadius: branding.border_radius
            }}>
              <div className="text-sm mb-1" style={{ color: branding.text_color }}>Payment Amount</div>
              <div className="text-2xl font-bold" style={{ color: branding.text_color }}>₹100.00</div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" style={{ color: branding.text_color }}>
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="4111 1111 1111 1111"
                  disabled
                  style={{ 
                    borderRadius: branding.border_radius,
                    borderColor: branding.primary_color
                  }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: branding.text_color }}>
                  Expiry Date
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="MM/YY"
                  disabled
                  style={{ 
                    borderRadius: branding.border_radius
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: branding.text_color }}>
                  CVV
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="123"
                  disabled
                  style={{ 
                    borderRadius: branding.border_radius
                  }}
                />
              </div>
            </div>
            
            <button
              type="button"
              className="w-full py-2 px-4 font-medium rounded-md"
              disabled
              style={{ 
                backgroundColor: branding.primary_color,
                color: branding.button_text_color,
                borderRadius: branding.border_radius
              }}
            >
              Pay ₹100.00
            </button>
            
            {branding.show_powered_by && (
              <div className="mt-6 text-center text-xs opacity-70" style={{ color: branding.text_color }}>
                Powered by PayCebo
              </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setPreviewMode(false)}
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              Back to Settings
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="logo-url">
                Logo URL
              </label>
              <input
                id="logo-url"
                name="logo_url"
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://your-domain.com/logo.png"
                value={branding.logo_url}
                onChange={handleChange}
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter a URL to your company logo (transparent PNG or SVG recommended)
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="primary-color">
                  Primary Color
                </label>
                <div className="flex">
                  <input
                    id="primary-color"
                    name="primary_color"
                    type="color"
                    className="h-10 w-10 border border-gray-300 rounded-md cursor-pointer"
                    value={branding.primary_color}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    className="ml-2 flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={branding.primary_color}
                    name="primary_color"
                    onChange={handleChange}
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                    title="Valid hex color code (e.g. #FF0000)"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Main brand color for buttons and highlights
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="accent-color">
                  Accent Color
                </label>
                <div className="flex">
                  <input
                    id="accent-color"
                    name="accent_color"
                    type="color"
                    className="h-10 w-10 border border-gray-300 rounded-md cursor-pointer"
                    value={branding.accent_color}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    className="ml-2 flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={branding.accent_color}
                    name="accent_color"
                    onChange={handleChange}
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                    title="Valid hex color code (e.g. #FF0000)"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Secondary color for hover states and gradients
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="background-color">
                  Background Color
                </label>
                <div className="flex">
                  <input
                    id="background-color"
                    name="background_color"
                    type="color"
                    className="h-10 w-10 border border-gray-300 rounded-md cursor-pointer"
                    value={branding.background_color}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    className="ml-2 flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={branding.background_color}
                    name="background_color"
                    onChange={handleChange}
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                    title="Valid hex color code (e.g. #FF0000)"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Page background color
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="text-color">
                  Text Color
                </label>
                <div className="flex">
                  <input
                    id="text-color"
                    name="text_color"
                    type="color"
                    className="h-10 w-10 border border-gray-300 rounded-md cursor-pointer"
                    value={branding.text_color}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    className="ml-2 flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={branding.text_color}
                    name="text_color"
                    onChange={handleChange}
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                    title="Valid hex color code (e.g. #FF0000)"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Main text color
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="button-text-color">
                  Button Text Color
                </label>
                <div className="flex">
                  <input
                    id="button-text-color"
                    name="button_text_color"
                    type="color"
                    className="h-10 w-10 border border-gray-300 rounded-md cursor-pointer"
                    value={branding.button_text_color}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    className="ml-2 flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={branding.button_text_color}
                    name="button_text_color"
                    onChange={handleChange}
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                    title="Valid hex color code (e.g. #FF0000)"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Text color for buttons
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="font-family">
                  Font Family
                </label>
                <select
                  id="font-family"
                  name="font_family"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={branding.font_family}
                  onChange={handleChange}
                >
                  {fontOptions.map(font => (
                    <option key={font} value={font} style={{ fontFamily: font }}>
                      {font.split(',')[0]}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Font for all text on the payment page
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="border-radius">
                  Border Radius
                </label>
                <select
                  id="border-radius"
                  name="border_radius"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={branding.border_radius}
                  onChange={handleChange}
                >
                  {radiusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label} ({option.value})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Roundness of corners for buttons and inputs
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                id="show-powered-by"
                name="show_powered_by"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={branding.show_powered_by}
                onChange={handleChange}
              />
              <label htmlFor="show-powered-by" className="ml-2 block text-sm text-gray-700">
                Show "Powered by PayCebo" footer
              </label>
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
            
            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={resetToDefaults}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Reset to Defaults
              </button>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setPreviewMode(true)}
                  className="px-4 py-2 border border-primary-300 rounded-md text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Preview
                </button>
                
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  disabled={saving}
                >
                  {saving ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </div>
                  ) : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default BrandingManager;