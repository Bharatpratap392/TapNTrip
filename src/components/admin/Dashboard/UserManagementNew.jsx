import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase-config';

const getAvatarText = (user) => {
  if (user.avatar && user.avatar.trim()) return user.avatar;
  if (user.firstName || user.lastName) {
    const first = user.firstName ? user.firstName[0] : '';
    const last = user.lastName ? user.lastName[0] : '';
    return (first + last).toUpperCase() || '-';
  }
  if (user.email && user.email.length > 0) return user.email[0].toUpperCase();
  return '-';
};

const getRoleColor = (role) => {
  switch (role) {
    case 'admin': return 'bg-purple-100 text-purple-800';
    case 'provider': return 'bg-blue-100 text-blue-800';
    case 'customer': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

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

const UserManagementNew = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      const snap = await getDocs(collection(db, 'users'));
      // Only include users with role 'customer'
      const customers = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(u => u.role === 'customer');
      setUsers(customers);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  const handleStatusChange = async (userId, newStatus) => {
    setUpdatingUserId(userId);
    try {
      await updateDoc(doc(db, 'users', userId), { status: newStatus });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    } catch (err) {
      alert('Failed to update status.');
    }
    setUpdatingUserId(null);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading users...</div>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl shadow-xl glassmorphism bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">User Management</h2>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">First Name</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Last Name</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Email</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Role</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {users.map(user => (
            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 text-white font-bold text-lg shadow-md">{getAvatarText(user)}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{user.firstName || '-'}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="font-semibold text-gray-900 dark:text-white">{user.lastName || '-'}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="font-semibold text-gray-900 dark:text-white">{user.email || '-'}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${getRoleColor(user.role)}`}>{user.role || '-'}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center gap-1">
                  <select
                    className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(user.status)} ${updatingUserId === user.id ? 'opacity-50' : ''}`}
                    value={user.status || 'inactive'}
                    disabled={updatingUserId === user.id}
                    onChange={e => handleStatusChange(user.id, e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                    <option value="blocked">Blocked</option>
                    <option value="suspend">Suspend</option>
                  </select>
                  {updatingUserId === user.id && (
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

export default UserManagementNew; 