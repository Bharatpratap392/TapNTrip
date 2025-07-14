import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase-config';
import { MdBusiness, MdEmail, MdPhone } from 'react-icons/md';

const getServiceColor = (type) => {
  switch (type) {
    case 'hotel': return 'bg-purple-100 text-purple-800';
    case 'transport': return 'bg-blue-100 text-blue-800';
    case 'guide': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'suspended': return 'bg-red-100 text-red-800';
    case 'blocked': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const ServiceManagementNew = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingProviderId, setUpdatingProviderId] = useState(null);

  useEffect(() => {
    async function fetchProviders() {
      setLoading(true);
      const snap = await getDocs(collection(db, 'service_providers'));
      setProviders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }
    fetchProviders();
  }, []);

  const handleStatusChange = async (providerId, newStatus) => {
    setUpdatingProviderId(providerId);
    try {
      await updateDoc(doc(db, 'service_providers', providerId), { status: newStatus });
      setProviders(prev => prev.map(p => p.id === providerId ? { ...p, status: newStatus } : p));
    } catch (err) {
      alert('Failed to update status.');
    }
    setUpdatingProviderId(null);
  };

  const filteredProviders = statusFilter === 'all' ? providers : providers.filter(p => p.status === statusFilter);

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading providers...</div>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl shadow-xl glassmorphism bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-8 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Service Management</h2>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Provider</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Service Type</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredProviders.length === 0 ? (
            <tr>
              <td colSpan="4" className="py-8 px-6 text-center text-gray-500 dark:text-gray-400">
                <div className="flex flex-col items-center gap-2">
                  <MdBusiness className="w-8 h-8 text-gray-400" />
                  <p className="font-medium">No service providers found.</p>
                </div>
              </td>
            </tr>
          ) : (
            filteredProviders.map(provider => (
              <tr key={provider.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 text-white font-bold text-lg shadow-md">
                    {(provider.hotelName || provider.ownerName || provider.companyName || provider.name || 'U')[0]}
                  </span>
                  <span>{provider.hotelName || provider.ownerName || provider.companyName || provider.name || 'Unknown Provider'}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${getServiceColor(provider.providerType)}`}>
                    {provider.providerType || '-'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="block text-gray-900 dark:text-white">{provider.email || 'No email'}</span>
                  <span className="block text-gray-500 dark:text-gray-400 text-xs">{provider.phone || 'No phone'}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">
                    <select
                      className={`px-3 py-1 rounded-full text-xs font-bold border-none focus:ring-2 focus:ring-blue-400 ${getStatusColor(provider.status)} ${updatingProviderId === provider.id ? 'opacity-50' : ''}`}
                      value={provider.status || 'pending'}
                      disabled={updatingProviderId === provider.id}
                      onChange={e => handleStatusChange(provider.id, e.target.value)}
                      style={{ minWidth: 110 }}
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
                      <option value="blocked">Blocked</option>
                    </select>
                    {updatingProviderId === provider.id && (
                      <svg className="animate-spin h-4 w-4 text-gray-500 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                    )}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceManagementNew; 