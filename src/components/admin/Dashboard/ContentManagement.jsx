import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase-config';
import {
  MdAdd, MdEdit, MdDelete, MdPublish, MdUnpublished, MdContentCopy, MdDescription, MdAnnouncement, MdHelp, MdGavel, MdClose
} from 'react-icons/md';
import { useTheme } from '../../../contexts/ThemeContext';
import { AnimatePresence } from 'framer-motion';

const getStatusColor = (status) => {
  switch (status) {
    case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800';
    case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-200 dark:border-gray-800';
  }
};

const ContentManagement = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('announcements');
  const [showEditor, setShowEditor] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      const snap = await getDocs(collection(db, 'content'));
      setContent(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(item => item.type === activeTab));
      setLoading(false);
    }
    fetchContent();
  }, [activeTab]);

  const handleEdit = (item) => {
    setEditingContent(item);
    setShowEditor(true);
  };

  const handlePublish = async (id) => {
    await updateDoc(doc(db, 'content', id), { status: 'published' });
    setContent(prev => prev.map(item => item.id === id ? { ...item, status: 'published' } : item));
  };

  const handleUnpublish = async (id) => {
    await updateDoc(doc(db, 'content', id), { status: 'draft' });
    setContent(prev => prev.map(item => item.id === id ? { ...item, status: 'draft' } : item));
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'content', id));
    setContent(prev => prev.filter(item => item.id !== id));
  };

  const handleSave = async () => {
    if (editingContent && editingContent.id) {
      await updateDoc(doc(db, 'content', editingContent.id), editingContent);
      setContent(prev => prev.map(item => item.id === editingContent.id ? editingContent : item));
    } else if (editingContent) {
      const docRef = await addDoc(collection(db, 'content'), {
        ...editingContent,
        type: activeTab,
        status: 'draft',
        lastUpdated: new Date().toISOString().split('T')[0],
      });
      setContent(prev => [...prev, { ...editingContent, id: docRef.id, type: activeTab, status: 'draft', lastUpdated: new Date().toISOString().split('T')[0] }]);
    }
    setShowEditor(false);
    setEditingContent(null);
  };

  const getTabIcon = (tab) => {
    switch (tab) {
      case 'announcements': return <MdAnnouncement className="w-5 h-5" />;
      case 'faqs': return <MdHelp className="w-5 h-5" />;
      case 'policies': return <MdGavel className="w-5 h-5" />;
      default: return <MdDescription className="w-5 h-5" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    hover: { 
      scale: 1.02,
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading content...</div>;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      {/* Modern Page Header */}
      <motion.div variants={cardVariants} className="glassmorphism bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl flex items-center gap-6 mb-6">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <MdContentCopy className="w-10 h-10 text-gray-700 dark:text-gray-200 drop-shadow-lg" />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white drop-shadow-lg">Content Management</h2>
          <p className="text-lg text-gray-500 dark:text-gray-300 mt-2">Manage announcements, FAQs, and policies</p>
        </div>
      </motion.div>

      {/* Modern Content Type Tabs */}
      <div className="flex gap-2 mb-6">
        {['announcements', 'faqs', 'policies'].map((tab) => (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm ${activeTab === tab ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
            aria-label={`Switch to ${tab} tab`}
            aria-pressed={activeTab === tab}
          >
            {getTabIcon(tab)}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Modern Content List */}
      <motion.div variants={cardVariants} className="glassmorphism bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl">
        <div className="p-8 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <MdDescription className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage your {activeTab} content
            </p>
          </div>
          <div className="flex-1"></div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setEditingContent({ title: '', description: '' }); setShowEditor(true); }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <MdAdd className="w-5 h-5" />
            Add New {activeTab.slice(0, -1)}
          </motion.button>
        </div>
        <div className="p-8">
          <div className="space-y-4">
            {content.length === 0 ? (
              <div className="text-center text-gray-400 dark:text-gray-500 py-12">No {activeTab} yet.</div>
            ) : (
              content.map(item => (
                <motion.div key={item.id} whileHover={{ scale: 1.01 }} className="flex items-center gap-4 p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">{item.title || 'Untitled'}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description || 'No description.'}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(item.status)}`}>{item.status}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item)} className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-all shadow-sm" title="Edit"><MdEdit /></button>
                    <button onClick={() => handlePublish(item.id)} className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all shadow-sm" title="Publish"><MdPublish /></button>
                    <button onClick={() => handleUnpublish(item.id)} className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-all shadow-sm" title="Unpublish"><MdUnpublished /></button>
                    <button onClick={() => handleDelete(item.id)} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all shadow-sm" title="Delete"><MdDelete /></button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.div>

      {/* Modern Editor Modal (logic unchanged, UI modernized) */}
      <AnimatePresence>
        {showEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingContent ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowEditor(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200"
                  aria-label="Close editor"
                >
                  <MdClose className="w-5 h-5" />
                </motion.button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={editingContent?.title || ''}
                    onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder={`Enter ${activeTab.slice(0, -1)} title...`}
                  />
                </div>
                
                <div>
                  <label htmlFor="content" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Content
                  </label>
                  <textarea
                    id="content"
                    value={editingContent?.description || ''}
                    onChange={(e) => setEditingContent({ ...editingContent, description: e.target.value })}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder={`Enter ${activeTab.slice(0, -1)} content...`}
                  />
                </div>
                
                <div className="flex justify-end gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowEditor(false)}
                    className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    aria-label="Cancel editing"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    aria-label="Save changes"
                  >
                    Save
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ContentManagement; 