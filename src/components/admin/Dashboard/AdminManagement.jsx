import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase-config';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

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
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900 dark:text-white">{admin.status || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminManagement; 