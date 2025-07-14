import React from 'react';

// --- GuideReviews: View and manage reviews ---
const GuideReviews = () => (
  <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-3xl mx-auto">
    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Tour Guide Reviews</h2>
    <p className="mb-6 text-gray-600 dark:text-gray-300">View and manage reviews for your tour guide services here.</p>
    {/* --- Reviews List/Summary Placeholder --- */}
    <div className="text-center text-gray-400 py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
      Reviews and ratings will appear here.
    </div>
  </div>
);

export default GuideReviews; 