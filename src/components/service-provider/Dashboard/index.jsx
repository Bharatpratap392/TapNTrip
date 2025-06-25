import React, { useState } from 'react';
import Layout from './Layout';
import HotelDashboard from './HotelDashboard';
import TravelGuideDashboard from './TravelGuideDashboard';
import TransportDashboard from './TransportDashboard';
import AddService from './AddService';

const ServiceProviderDashboard = () => {
  const [selectedProvider, setSelectedProvider] = useState('Hotel Provider');
  const [activeTab, setActiveTab] = useState('overview');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderDashboard = () => {
    if (activeTab === 'add-service') {
      return <AddService providerType={selectedProvider} />;
    }

    switch (selectedProvider) {
      case 'Hotel Provider':
        return <HotelDashboard activeTab={activeTab} />;
      case 'Travel Guide':
        return <TravelGuideDashboard activeTab={activeTab} />;
      case 'Transport Provider':
        return <TransportDashboard activeTab={activeTab} />;
      default:
        return <HotelDashboard activeTab={activeTab} />;
    }
  };

  const handleProviderChange = (provider) => {
    setSelectedProvider(provider);
    setActiveTab('overview'); // Reset to overview when provider changes
  };

  return (
    <Layout 
      selectedProvider={selectedProvider} 
      onProviderChange={handleProviderChange}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      {renderDashboard()}
    </Layout>
  );
};

export default ServiceProviderDashboard; 