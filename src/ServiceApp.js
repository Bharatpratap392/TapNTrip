import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const ServiceApp = () => {
  const [fontSize, setFontSize] = useState(16);
  const [language, setLanguage] = useState('english');
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  // Mock data for existing services
  const [services, setServices] = useState([
    {
      id: 1,
      name: 'City Tour Package',
      type: 'guide',
      description: 'A comprehensive city tour covering major attractions',
      price: 1500,
    },
    {
      id: 2,
      name: 'Heritage Walk',
      type: 'guide',
      description: 'Explore the rich cultural heritage of the city',
      price: 800,
    },
  ]);

  const handleLogout = () => {
    navigate('/');
  };

  const handleFontSizeChange = (increase) => {
    setFontSize(prev => {
      const newSize = increase ? prev + 2 : prev - 2;
      return Math.min(Math.max(newSize, 14), 24); // Limit size between 14 and 24
    });
  };

  const renderServiceForm = () => {
    return (
      <div className="modern-card p-8 page-transition">
        <h3 className="text-2xl font-bold mb-6 text-gray-900">Add New Service</h3>
        <form className="space-y-6">
          <div className="form-group">
            <label className="block text-gray-700 text-lg font-semibold mb-2" htmlFor="serviceName">
              Service Name
            </label>
            <input
              id="serviceName"
              type="text"
              className="modern-input input-focus-effect"
              placeholder="Enter service name"
              aria-label="Service Name"
            />
          </div>
          <div className="form-group">
            <label className="block text-gray-700 text-lg font-semibold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="modern-input input-focus-effect"
              rows="4"
              placeholder="Describe your service"
              aria-label="Service Description"
            />
          </div>
          <div className="form-group">
            <label className="block text-gray-700 text-lg font-semibold mb-2" htmlFor="price">
              Price (₹)
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="100"
              className="modern-input input-focus-effect"
              placeholder="Enter price"
              aria-label="Service Price"
            />
          </div>
          <button
            type="submit"
            className="accessible-button w-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 button-press"
          >
            Add Service
          </button>
        </form>
      </div>
    );
  };

  const renderServicesList = () => {
    return (
      <div className="modern-card p-8 page-transition">
        <h3 className="text-2xl font-bold mb-6 text-gray-900">Your Services</h3>
        <div className="space-y-6">
          {services.map(service => (
            <div 
              key={service.id} 
              className="card-hover modern-card p-6 hover:bg-gray-50 transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h4 className="text-xl font-semibold text-gray-900">{service.name}</h4>
                  <p className="text-gray-600 text-lg">{service.description}</p>
                  <p className="text-indigo-600 text-xl font-semibold">₹{service.price}</p>
                </div>
                <div className="space-x-4">
                  <button 
                    className="accessible-button bg-indigo-50 text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 button-press"
                    aria-label={`Edit ${service.name}`}
                  >
                    Edit
                  </button>
                  <button 
                    className="accessible-button bg-red-50 text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 button-press"
                    aria-label={`Delete ${service.name}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" 
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 page-transition">
              Service Provider Dashboard
            </h1>
            <div className="flex items-center space-x-6">
              <div className="tooltip">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="modern-input input-focus-effect py-2"
                  aria-label="Select Language"
                >
                  <option value="english">English</option>
                  <option value="hindi">हिंदी</option>
                  <option value="tamil">தமிழ்</option>
                  <option value="telugu">తెలుగు</option>
                  <option value="marathi">मराठी</option>
                </select>
                <span className="tooltip-text">Change Language</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleFontSizeChange(false)}
                  className="accessible-button bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2"
                  aria-label="Decrease Font Size"
                >
                  A-
                </button>
                <button
                  onClick={() => handleFontSizeChange(true)}
                  className="accessible-button bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2"
                  aria-label="Increase Font Size"
                >
                  A+
                </button>
              </div>
              
              <button
                onClick={handleLogout}
                className="accessible-button bg-red-50 text-red-600 hover:bg-red-100"
                aria-label="Logout"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`accessible-button tab-transition ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            aria-label="View Dashboard"
            aria-pressed={activeTab === 'dashboard'}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('add-service')}
            className={`accessible-button tab-transition ${
              activeTab === 'add-service'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            aria-label="Add New Service"
            aria-pressed={activeTab === 'add-service'}
          >
            Add New Service
          </button>
        </div>

        {activeTab === 'dashboard' ? renderServicesList() : renderServiceForm()}
      </main>
    </div>
  );
};

export default ServiceApp; 