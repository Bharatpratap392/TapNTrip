// src/AdminApp.js

import React, { useState } from 'react';
import Layout from './components/admin/Dashboard/Layout';
import AdminDashboard from './components/admin/Dashboard/AdminDashboard';
import UserManagement from './components/admin/Dashboard/UserManagement';
import ServiceManagement from './components/admin/Dashboard/ServiceManagement';
import BookingManagement from './components/admin/Dashboard/BookingManagement';
import ContentManagement from './components/admin/Dashboard/ContentManagement';
import Settings from './components/admin/Dashboard/Settings';

function AdminApp() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminDashboard />;
      case 'users':
        return <UserManagement />;
      case 'services':
        return <ServiceManagement />;
      case 'bookings':
        return <BookingManagement />;
      case 'content':
        return <ContentManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default AdminApp;
