import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdAnnouncement,
  MdHelp,
  MdGavel,
  MdPublish,
  MdUnpublished,
} from 'react-icons/md';
import { useTheme } from '../../../contexts/ThemeContext';

const ContentManagement = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('announcements');
  const [showEditor, setShowEditor] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [content, setContent] = useState([
    {
      id: 1,
      title: 'Welcome to TapNTrip',
      content: 'Experience the best travel services with TapNTrip...',
      status: 'published',
      lastUpdated: '2024-03-15',
    },
    {
      id: 2,
      title: 'New Features Coming Soon',
      content: 'We are excited to announce new features...',
      status: 'draft',
      lastUpdated: '2024-03-14',
    },
  ]);

  const handleEdit = (item) => {
    setEditingContent(item);
    setShowEditor(true);
  };

  const handlePublish = (id, type) => {
    setContent(content.map(item => 
      item.id === id ? { ...item, status: 'published' } : item
    ));
  };

  const handleUnpublish = (id, type) => {
    setContent(content.map(item => 
      item.id === id ? { ...item, status: 'draft' } : item
    ));
  };

  const handleDelete = (id, type) => {
    setContent(content.filter(item => item.id !== id));
  };

  const handleSave = () => {
    if (editingContent) {
      setContent(content.map(item => 
        item.id === editingContent.id ? editingContent : item
      ));
    } else {
      setContent([...content, {
        id: Date.now(),
        ...editingContent,
        status: 'draft',
        lastUpdated: new Date().toISOString().split('T')[0],
      }]);
    }
    setShowEditor(false);
    setEditingContent(null);
  };

  return (
    <div className="space-y-6">
      {/* Content Type Tabs */}
      <div className="flex space-x-4">
        {['announcements', 'faqs', 'policies'].map((tab) => (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              activeTab === tab
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            aria-label={`Switch to ${tab} tab`}
            aria-pressed={activeTab === tab}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Add New Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setEditingContent(null);
          setShowEditor(true);
        }}
        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
          transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-label={`Add new ${activeTab.slice(0, -1)}`}
      >
        <MdAdd className="w-5 h-5 mr-2 transform transition-transform duration-300 hover:rotate-90" />
        Add New {activeTab.slice(0, -1)}
      </motion.button>

      {/* Content List */}
      <div className="space-y-4">
        {content.map((item) => (
            <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg border ${
              isDarkMode 
                ? 'bg-[#1f2937] border-[#2d3348]' 
                : 'bg-white border-gray-200'
            } transform transition-all duration-300 hover:scale-105 hover:shadow-lg`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  {item.content}
                </p>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    item.status === 'published'
                      ? 'bg-green-900/30 text-green-300'
                      : 'bg-yellow-900/30 text-yellow-300'
                  }`}>
                    {item.status}
                  </span>
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                    Last updated: {item.lastUpdated}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(item)}
                  className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-900 
                    dark:hover:text-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
                  aria-label={`Edit ${item.title}`}
                >
                  <MdEdit className="w-5 h-5" />
                </motion.button>
                {item.status === 'published' ? (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleUnpublish(item.id, activeTab.slice(0, -1))}
                    className="p-1 text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 
                      dark:hover:text-yellow-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 rounded"
                    aria-label={`Unpublish ${item.title}`}
                  >
                    <MdUnpublished className="w-5 h-5" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePublish(item.id, activeTab.slice(0, -1))}
                    className="p-1 text-green-600 dark:text-green-400 hover:text-green-900 
                      dark:hover:text-green-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded"
                    aria-label={`Publish ${item.title}`}
                  >
                    <MdPublish className="w-5 h-5" />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(item.id, activeTab.slice(0, -1))}
                  className="p-1 text-red-600 dark:text-red-400 hover:text-red-900 
                    dark:hover:text-red-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded"
                  aria-label={`Delete ${item.title}`}
                >
                  <MdDelete className="w-5 h-5" />
                </motion.button>
              </div>
              </div>
            </motion.div>
          ))}
      </div>

      {/* Content Editor Modal */}
      {showEditor && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`${
              isDarkMode 
                ? 'bg-[#1f2937] border-[#2d3348]' 
                : 'bg-white border-gray-200'
            } rounded-lg p-6 w-full max-w-2xl border transform transition-all duration-300 hover:shadow-xl`}
          >
            <h2 className="text-xl font-semibold mb-4">
              {editingContent ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={editingContent?.title || ''}
                  onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-[#2d3348] border-[#3d4458] text-white' 
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200`}
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium mb-1">
                  Content
                </label>
                <textarea
                  id="content"
                  value={editingContent?.content || ''}
                  onChange={(e) => setEditingContent({ ...editingContent, content: e.target.value })}
                  rows={6}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-[#2d3348] border-[#3d4458] text-white' 
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200`}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowEditor(false)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-gray-100' 
                      : 'text-gray-600 hover:text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50`}
                  aria-label="Cancel editing"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  aria-label="Save changes"
                >
                  Save
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ContentManagement; 