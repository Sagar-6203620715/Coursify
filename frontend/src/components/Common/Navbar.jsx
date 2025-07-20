import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiBars3BottomRight, HiOutlineUser } from 'react-icons/hi2';
import { IoMdClose } from 'react-icons/io';
import SearchBar from './SearchBar';
import ChatDrawer from '../Layout/ChatDrawer';

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();

  const toggleNavDrawer = () => setNavDrawerOpen(!navDrawerOpen);

  const handleUserIconClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoggedIn) {
      setShowDropdown((prev) => !prev);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  // Close mobile menu when route changes
  useEffect(() => {
    setNavDrawerOpen(false);
  }, [location]);

  const navItems = [
    { name: 'Competitive Exams', path: '/competitive_exams' },
    { name: 'Tech', path: '/tech' },
    { name: 'Skills', path: '/skills' },
    { name: 'School', path: '/school' }
  ];

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between py-4 px-4 sm:px-6">
          {/* Logo */}
          <div className="flex-shrink-0 -ml-3 mr-8">
            <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200">
              Coursify
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center -mr-5 space-x-3 sm:space-x-4">
            {/* Admin Link */}
            <Link 
              to="/admin"
              className="hidden sm:block bg-gray-900 hover:bg-gray-800 px-3 py-2 rounded-md text-sm text-white font-medium transition-colors duration-200"
            >
              Admin
            </Link>

            {/* Search Bar */}
            <div className="hidden sm:block">
              <SearchBar />
            </div>

            {/* User Icon */}
            <div className="relative user-dropdown">
              {isLoggedIn ? (
                <button
                  id="user-menu-button"
                  onClick={handleUserIconClick}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="User menu"
                  aria-expanded={showDropdown}
                  aria-haspopup="true"
                >
                  <HiOutlineUser className="h-6 w-6 text-gray-700" />
                </button>
              ) : (
                <Link 
                  to="/login" 
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Login"
                >
                  <HiOutlineUser className="h-6 w-6 text-gray-700" />
                </Link>
              )}

              {/* User Dropdown */}
              {isLoggedIn && showDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-[60] transform opacity-100 scale-100 transition-all duration-200"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                >
                  <div className="py-1" role="none">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:bg-gray-100"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Search */}
            <div className="sm:hidden">
              <SearchBar />
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
              onClick={toggleNavDrawer}
              aria-label="Open menu"
            >
              <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>
      </nav>

      {/* ChatDrawer is handled by individual pages, not here */}

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed top-0 left-0 w-full max-w-sm h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          navDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
          <button 
            onClick={toggleNavDrawer}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
            aria-label="Close menu"
          >
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="p-4">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={toggleNavDrawer}
                className={`block px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Admin Link in Mobile Menu */}
            <Link
              to="/admin"
              onClick={toggleNavDrawer}
              className="block px-4 py-3 rounded-md text-base font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200"
            >
              Admin Panel
            </Link>
          </nav>

          {/* User Section in Mobile Menu */}
          {isLoggedIn && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setNavDrawerOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-4 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {navDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleNavDrawer}
        />
      )}
    </>
  );
};

export default Navbar;
