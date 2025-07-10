import React from 'react';

// --- GuideEarnings: View earnings and payout history ---
const GuideEarnings = () => (
  <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-3xl mx-auto">
    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Tour Guide Earnings</h2>
    <p className="mb-6 text-gray-600 dark:text-gray-300">View your tour guide earnings and payout history here.</p>
    {/* --- Earnings Table/Chart Placeholder --- */}
    <div className="text-center text-gray-400 py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
      Earnings summary and payout history will appear here.
    </div>
  </div>
);

export default GuideEarnings; 