// src/AdminApp.js

import React, { useState } from 'react';
import Layout from './components/admin/Dashboard/Layout';
import AdminDashboard from './components/admin/Dashboard/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import ServiceManagementNew from './components/admin/Dashboard/ServiceManagementNew';
import BookingManagement from './components/admin/Dashboard/BookingManagement';
import ContentManagement from './components/admin/Dashboard/ContentManagement';
import Settings from './components/admin/Dashboard/Settings';
import AdminManagement from './components/admin/Dashboard/AdminManagement';
import PaymentManagement from './components/admin/Dashboard/PaymentManagement';

function AdminApp() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminDashboard />;
      case 'users':
        return <UserManagement />;
      case 'services':
        return <ServiceManagementNew />;
      case 'bookings':
        return <BookingManagement />;
      case 'content':
        return <ContentManagement />;
      case 'settings':
        return <Settings />;
      case 'admins':
        return <AdminManagement />;
      case 'payments':
        return <PaymentManagement />;
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
