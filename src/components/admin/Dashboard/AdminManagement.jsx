import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase-config';

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'inactive': return 'bg-gray-100 text-gray-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'blocked': return 'bg-red-100 text-red-800';
    case 'suspend': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingAdminId, setUpdatingAdminId] = useState(null);

  useEffect(() => {
    async function fetchAdmins() {
      setLoading(true);
      const snap = await getDocs(collection(db, 'users'));
      const adminList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(u => u.role === 'admin');
      setAdmins(adminList);
      setLoading(false);
    }
    fetchAdmins();
  }, []);

  const handleStatusChange = async (adminId, newStatus) => {
    setUpdatingAdminId(adminId);
    try {
      await updateDoc(doc(db, 'users', adminId), { status: newStatus });
      setAdmins(prev => prev.map(a => a.id === adminId ? { ...a, status: newStatus } : a));
    } catch (err) {
      alert('Failed to update status.');
    }
    setUpdatingAdminId(null);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading admins...</div>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl shadow-xl glassmorphism bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 p-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Admin Management</h2>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">First Name</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Last Name</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Email</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {admins.map(admin => (
            <tr key={admin.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:via-purple-50 hover:to-pink-50 dark:hover:from-gray-800 dark:hover:via-gray-900 dark:hover:to-gray-800 transition-all">
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900 dark:text-white">{admin.firstName || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900 dark:text-white">{admin.lastName || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900 dark:text-white">{admin.email || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                <span className="inline-flex items-center gap-1">
                  <select
                    className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(admin.status)} ${updatingAdminId === admin.id ? 'opacity-50' : ''}`}
                    value={admin.status || 'inactive'}
                    disabled={updatingAdminId === admin.id}
                    onChange={e => handleStatusChange(admin.id, e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                    <option value="blocked">Blocked</option>
                    <option value="suspend">Suspend</option>
                  </select>
                  {updatingAdminId === admin.id && (
                    <svg className="animate-spin h-4 w-4 text-gray-500 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                  )}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminManagement; 