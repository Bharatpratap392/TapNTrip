import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdCheckCircle, MdCancel, MdPerson, MdDashboard, MdAnalytics, MdInfo, MdLocationOn, MdPhone, MdEmail, MdStore, MdPeople, MdBookOnline, MdPayment } from 'react-icons/md';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase-config';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]); // Local only
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      const usersSnap = await getDocs(collection(db, 'users'));
      const totalUsers = usersSnap.size;
      const activeProvidersSnap = await getDocs(query(collection(db, 'service_providers'), where('status', '==', 'active')));
      const activeProviders = activeProvidersSnap.size;
      const pendingSnap = await getDocs(query(collection(db, 'service_providers'), where('status', '==', 'pending')));
      const pendingApprovals = pendingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const bookingsSnap = await getDocs(collection(db, 'bookings'));
      const totalBookings = bookingsSnap.size;
      let totalRevenue = 0;
      bookingsSnap.forEach(doc => {
        const data = doc.data();
        if (data.paymentStatus === 'paid') {
          const amt = typeof data.amount === 'string' ? parseFloat(data.amount.replace(/[^\d.]/g, '')) : Number(data.amount);
          totalRevenue += amt || 0;
        }
      });
      setStats({ totalUsers, activeProviders, totalBookings, totalRevenue });
      setPendingApprovals(pendingApprovals);
    setLoading(false);
    }
    fetchDashboardData();
  }, []);

  const refreshPendingApprovals = async () => {
    const pendingSnap = await getDocs(query(collection(db, 'service_providers'), where('status', '==', 'pending')));
    setPendingApprovals(pendingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // Approve provider and sync status in both collections
  const confirmApprove = async () => {
    if (selectedProvider) {
      // Update status in both service_providers and users collections
      await updateDoc(doc(db, 'service_providers', selectedProvider.id), { status: 'active' });
      if (selectedProvider.userId) {
        await updateDoc(doc(db, 'users', selectedProvider.userId), { status: 'active' });
      }
      await refreshPendingApprovals();
      setRecentActivities(prev => [{
        id: Date.now(),
        type: 'Provider Approved',
        description: `${selectedProvider.businessName} approved by Admin`,
        time: 'Just now',
        status: 'completed',
        user: selectedProvider.name
      }, ...prev]);
      setShowApprovalModal(false);
      setSelectedProvider(null);
    }
  };

  // Reject provider and sync status in both collections
  const confirmReject = async () => {
    if (selectedProvider && rejectReason) {
      // Update status in both service_providers and users collections
      await updateDoc(doc(db, 'service_providers', selectedProvider.id), { status: 'rejected', rejectionReason: rejectReason });
      if (selectedProvider.userId) {
        await updateDoc(doc(db, 'users', selectedProvider.userId), { status: 'rejected' });
      }
      await refreshPendingApprovals();
      setRecentActivities(prev => [{
        id: Date.now(),
        type: 'Provider Rejected',
        description: `${selectedProvider.businessName} rejected: ${rejectReason}`,
        time: 'Just now',
        status: 'completed',
        user: selectedProvider.name
      }, ...prev]);
      setShowRejectModal(false);
      setSelectedProvider(null);
      setRejectReason('');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="glassmorphism bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3 mt-4"></div>
            </div>
          ))}
        </div>
        <div className="glassmorphism bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl">
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
          </div>
          <div className="p-8">
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-20 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Animation variants (kept for UI polish)
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-10">
      {/* Header */}
      <div className="glassmorphism bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl flex items-center gap-6">
        <div className="p-4 bg-white/30 dark:bg-gray-900/30 rounded-xl">
          <MdDashboard className="w-10 h-10 text-white drop-shadow-lg" />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white drop-shadow-lg">Admin Dashboard</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">Monitor and manage your platform's performance</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <motion.div whileHover={{ scale: 1.04 }} className="glassmorphism bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-blue-200 dark:border-blue-800 flex flex-col items-start">
          <div className="flex items-center gap-3 mb-2">
            <MdPeople className="w-7 h-7 text-gray-900 dark:text-white" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">Total Users</span>
          </div>
          <span className="text-3xl font-extrabold text-gray-900 dark:text-white drop-shadow-lg">{stats.totalUsers?.toLocaleString() || 'N/A'}</span>
        </motion.div>
        <motion.div whileHover={{ scale: 1.04 }} className="glassmorphism bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-green-200 dark:border-green-800 flex flex-col items-start">
          <div className="flex items-center gap-3 mb-2">
            <MdStore className="w-7 h-7 text-gray-900 dark:text-white" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">Active Providers</span>
          </div>
          <span className="text-3xl font-extrabold text-gray-900 dark:text-white drop-shadow-lg">{stats.activeProviders?.toLocaleString() || 'N/A'}</span>
        </motion.div>
        <motion.div whileHover={{ scale: 1.04 }} className="glassmorphism bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-pink-200 dark:border-pink-800 flex flex-col items-start">
          <div className="flex items-center gap-3 mb-2">
            <MdBookOnline className="w-7 h-7 text-gray-900 dark:text-white" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">Total Bookings</span>
          </div>
          <span className="text-3xl font-extrabold text-gray-900 dark:text-white drop-shadow-lg">{stats.totalBookings?.toLocaleString() || 'N/A'}</span>
        </motion.div>
        <motion.div whileHover={{ scale: 1.04 }} className="glassmorphism bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-purple-200 dark:border-purple-800 flex flex-col items-start">
          <div className="flex items-center gap-3 mb-2">
            <MdPayment className="w-7 h-7 text-gray-900 dark:text-white" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">Total Revenue</span>
          </div>
          <span className="text-3xl font-extrabold text-gray-900 dark:text-white drop-shadow-lg">₹{stats.totalRevenue?.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2}) || 'N/A'}</span>
        </motion.div>
      </div>

      {/* Pending Approvals */}
      <div className="glassmorphism bg-white dark:bg-gray-900/80 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MdCheckCircle className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pending Provider Approvals</h2>
            <span className="ml-2 px-3 py-1 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-sm font-semibold">{pendingApprovals.length}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingApprovals.map((provider) => (
            <motion.div key={provider.id} whileHover={{ scale: 1.02 }} className="glassmorphism bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-md flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <MdPerson className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{provider.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{provider.businessName} ({provider.type})</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400">
                <span><MdEmail className="inline mr-1" />{provider.email}</span>
                <span><MdPhone className="inline mr-1" />{provider.phone}</span>
                <span><MdLocationOn className="inline mr-1" />{provider.location}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => { setSelectedProvider(provider); setShowApprovalModal(true); }} className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-all">Approve</button>
                <button onClick={() => { setSelectedProvider(provider); setShowRejectModal(true); }} className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-all">Reject</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity (local only) */}
      <div className="glassmorphism bg-white dark:bg-gray-900/80 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <MdAnalytics className="w-6 h-6 text-purple-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
        </div>
        <div className="space-y-4">
          {recentActivities.slice(0, 6).map((activity) => (
            <motion.div key={activity.id} whileHover={{ scale: 1.01 }} className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <MdInfo className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-gray-800 dark:text-gray-200 font-semibold">{activity.description}</p>
                <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${activity.status === 'completed' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>{activity.status}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Approval Modal */}
      <AnimatePresence>
        {showApprovalModal && selectedProvider && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <MdCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Approve Provider</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Are you sure you want to approve <strong className="text-gray-900 dark:text-white">{selectedProvider.businessName}</strong>? This will grant them access to provide services on the platform.
              </p>
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={confirmApprove} className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md">Approve</motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowApprovalModal(false)} className="flex-1 py-3 px-4 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md">Cancel</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && selectedProvider && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                  <MdCancel className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Reject Provider</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                Are you sure you want to reject <strong className="text-gray-900 dark:text-white">{selectedProvider.businessName}</strong>?
              </p>
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Reason for rejection</label>
                <input type="text" value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white" placeholder="Enter reason..." />
              </div>
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={confirmReject} className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md">Reject</motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowRejectModal(false)} className="flex-1 py-3 px-4 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md">Cancel</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminDashboard; 