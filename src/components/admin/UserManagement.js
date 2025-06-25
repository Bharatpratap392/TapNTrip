import React, { useState } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh@citytours.com',
      role: 'service_provider',
      type: 'transport',
      status: 'active',
      registrationDate: '2024-03-10',
    },
    {
      id: 2,
      name: 'Priya Singh',
      email: 'priya@gmail.com',
      role: 'customer',
      status: 'active',
      registrationDate: '2024-03-12',
    },
    {
      id: 3,
      name: 'Taj Hotels',
      email: 'info@tajhotels.com',
      role: 'service_provider',
      type: 'hotel',
      status: 'pending',
      registrationDate: '2024-03-15',
    },
  ]);

  const [filter, setFilter] = useState({
    role: 'all',
    status: 'all',
  });

  const handleStatusChange = (userId, newStatus) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const filteredUsers = users.filter(user => {
    if (filter.role !== 'all' && user.role !== filter.role) return false;
    if (filter.status !== 'all' && user.status !== filter.status) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="modern-card p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <div className="flex space-x-4">
            <select
              value={filter.role}
              onChange={(e) => setFilter({ ...filter, role: e.target.value })}
              className="modern-input input-focus-effect py-2"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="service_provider">Service Providers</option>
            </select>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="modern-input input-focus-effect py-2"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700">Name</th>
                <th className="text-left py-3 px-4 text-gray-700">Email</th>
                <th className="text-left py-3 px-4 text-gray-700">Role</th>
                <th className="text-left py-3 px-4 text-gray-700">Type</th>
                <th className="text-left py-3 px-4 text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-gray-700">Registration Date</th>
                <th className="text-left py-3 px-4 text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100">
                  <td className="py-4 px-4">{user.name}</td>
                  <td className="py-4 px-4">{user.email}</td>
                  <td className="py-4 px-4 capitalize">{user.role.replace('_', ' ')}</td>
                  <td className="py-4 px-4 capitalize">{user.type || '-'}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : user.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">{user.registrationDate}</td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      {user.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(user.id, 'active')}
                            className="accessible-button bg-green-50 text-green-600 hover:bg-green-100 py-1 px-3"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(user.id, 'suspended')}
                            className="accessible-button bg-red-50 text-red-600 hover:bg-red-100 py-1 px-3"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {user.status === 'active' && (
                        <button
                          onClick={() => handleStatusChange(user.id, 'suspended')}
                          className="accessible-button bg-red-50 text-red-600 hover:bg-red-100 py-1 px-3"
                        >
                          Suspend
                        </button>
                      )}
                      {user.status === 'suspended' && (
                        <button
                          onClick={() => handleStatusChange(user.id, 'active')}
                          className="accessible-button bg-green-50 text-green-600 hover:bg-green-100 py-1 px-3"
                        >
                          Reactivate
                        </button>
                      )}
                      <button className="accessible-button bg-gray-50 text-gray-600 hover:bg-gray-100 py-1 px-3">
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement; 