import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Header = ({ title }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('merchant');
    navigate('/login');
  };
  
  return (
    <header className="bg-gradient-to-r from-primary-800 via-primary-700 to-primary-600 text-white shadow-xl relative z-10 sticky top-0 left-0">
      <div className="container mx-auto">
        {/* Top notification bar */}
        <div className="bg-accent-500 py-1 text-center text-white text-sm font-medium">
          <span className="inline-flex items-center">
            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
            </svg>
            Developer Mode - No real payments are processed
          </span>
        </div>
        
        {/* Main header content */}
        <div className="flex justify-between items-center py-4 px-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <div className="bg-white p-1.5 rounded-lg shadow-md mr-2">
                <svg className="w-7 h-7 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 10H21M7 15H8M12 15H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <Link to={localStorage.getItem('token') ? '/dashboard' : '/'} className="text-2xl font-bold tracking-tight">
                Pay<span className="text-accent-300">Cebo</span>
              </Link>
            </div>
            {title && (
              <div className="hidden md:flex items-center">
                <div className="h-6 w-px bg-primary-400/30 mx-3"></div>
                <span className="text-primary-100 text-xl font-light">{title}</span>
              </div>
            )}
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6 mr-4">
              <Link to="/docs" className="text-primary-100 hover:text-white transition-colors">
                Documentation
              </Link>
              <Link to="/pricing" className="text-primary-100 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link to="/support" className="text-primary-100 hover:text-white transition-colors">
                Support
              </Link>
            </nav>
            
            {localStorage.getItem('token') ? (
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                  {localStorage.getItem('merchant') ? JSON.parse(localStorage.getItem('merchant')).name.charAt(0).toUpperCase() : 'U'}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-white text-primary-700 px-5 py-2 rounded-md font-medium hover:bg-gray-100 transition duration-200 shadow-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4 justify-center items-center">
                <Link to="/login" className="text-white hover:text-primary-100 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-accent-500 hover:bg-accent-600 text-white px-5 py-2 rounded-md font-medium transition duration-200 shadow-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-primary-800 pb-4 px-6">
            <nav className="flex flex-col space-y-3 mb-4">
              <Link to="/docs" className="text-primary-100 hover:text-white py-2 transition-colors">
                Documentation
              </Link>
              <Link to="/pricing" className="text-primary-100 hover:text-white py-2 transition-colors">
                Pricing
              </Link>
              <Link to="/support" className="text-primary-100 hover:text-white py-2 transition-colors">
                Support
              </Link>
            </nav>
            
            {localStorage.getItem('token') ? (
              <div className="pt-2 border-t border-primary-700">
                <button
                  onClick={handleLogout}
                  className="w-full bg-white text-primary-700 px-5 py-2 rounded-md font-medium hover:bg-gray-100 transition duration-200 shadow-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-primary-700 flex flex-col space-y-2">
                <Link to="/login" className="text-white hover:text-primary-100 py-2 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-accent-500 hover:bg-accent-600 text-white px-5 py-2 rounded-md font-medium transition duration-200 shadow-sm text-center">
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;