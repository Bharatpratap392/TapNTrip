import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { MdAdd, MdDelete, MdEdit, MdNotifications, MdAccessTime, MdLocationOn, MdPriorityHigh } from 'react-icons/md';
// TODO: Integrate with backend and prayer time API

const Reminders = () => {
  const { isDarkMode } = useTheme();
  const [reminder, setReminder] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderType, setReminderType] = useState('general');
  const [reminders, setReminders] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    // Load saved reminders from localStorage
    const saved = localStorage.getItem('travelReminders');
    if (saved) {
      setReminders(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Save reminders to localStorage
    localStorage.setItem('travelReminders', JSON.stringify(reminders));
  }, [reminders]);

  const handleAdd = () => {
    if (!reminder || !reminderTime) return;
    
    const newReminder = {
      id: Date.now(),
      text: reminder,
      time: reminderTime,
      type: reminderType,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setReminders([...reminders, newReminder]);
    setReminder('');
    setReminderTime('');
    setReminderType('general');
    setShowAddForm(false);

    // Schedule browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      const notificationTime = new Date(reminderTime);
      const now = new Date();
      const timeUntilNotification = notificationTime.getTime() - now.getTime();
      
      if (timeUntilNotification > 0) {
        setTimeout(() => {
          new Notification('Travel Reminder', { 
            body: reminder,
            icon: '/favicon.ico'
          });
        }, timeUntilNotification);
      }
    } else if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  const handleDelete = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const handleToggleComplete = (id) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
  };

  const handleEdit = (id) => {
    const reminderToEdit = reminders.find(r => r.id === id);
    if (reminderToEdit) {
      setReminder(reminderToEdit.text);
      setReminderTime(reminderToEdit.time);
      setReminderType(reminderToEdit.type);
      setEditingId(id);
      setShowAddForm(true);
    }
  };

  const handleSaveEdit = () => {
    if (!reminder || !reminderTime) return;
    
    setReminders(reminders.map(r => 
      r.id === editingId 
        ? { ...r, text: reminder, time: reminderTime, type: reminderType }
        : r
    ));
    
    setReminder('');
    setReminderTime('');
    setReminderType('general');
    setEditingId(null);
    setShowAddForm(false);
  };

  const getReminderIcon = (type) => {
    switch (type) {
      case 'prayer': return '🕌';
      case 'medical': return '💊';
      case 'travel': return '✈️';
      case 'food': return '🍽️';
      case 'emergency': return '🚨';
      default: return '⏰';
    }
  };

  const getReminderColor = (type) => {
    switch (type) {
      case 'prayer': return 'bg-purple-500';
      case 'medical': return 'bg-red-500';
      case 'travel': return 'bg-blue-500';
      case 'food': return 'bg-orange-500';
      case 'emergency': return 'bg-red-600';
      default: return 'bg-gray-500';
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

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
        >
          <h1 className="text-4xl font-bold mb-2">Travel Reminders</h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Never miss important moments during your journey
          </p>
        </motion.div>

        {/* Add Reminder Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(!showAddForm)}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${
              isDarkMode
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
            } shadow-lg hover:shadow-xl`}
          >
            <MdAdd size={24} />
            {showAddForm ? 'Cancel' : 'Add Reminder'}
          </motion.button>
        </motion.div>

        {/* Add/Edit Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`mb-8 p-6 rounded-2xl shadow-lg ${
                isDarkMode ? 'bg-[#1a1e2e] border border-gray-700' : 'bg-white border border-gray-200'
              }`}
            >
              <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {editingId ? 'Edit Reminder' : 'New Reminder'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Reminder Text
                  </label>
                  <input
                    type="text"
                    value={reminder}
                    onChange={(e) => setReminder(e.target.value)}
                    placeholder="e.g., Take medicine, Prayer time, Flight check-in"
                    className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-400'
                    } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Reminder Time
                  </label>
                  <input
                    type="datetime-local"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-600 text-white focus:border-purple-400'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-400'
                    } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Reminder Type
                </label>
                <select
                  value={reminderType}
                  onChange={(e) => setReminderType(e.target.value)}
                  className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-600 text-white focus:border-purple-400'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-400'
                  } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                >
                  <option value="general">General</option>
                  <option value="prayer">Prayer Time</option>
                  <option value="medical">Medical</option>
                  <option value="travel">Travel</option>
                  <option value="food">Food</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={editingId ? handleSaveEdit : handleAdd}
                  disabled={!reminder || !reminderTime}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                    !reminder || !reminderTime
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg'
                  }`}
                >
                  {editingId ? 'Update Reminder' : 'Add Reminder'}
                </motion.button>
                
                {editingId && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setEditingId(null);
                      setReminder('');
                      setReminderTime('');
                      setReminderType('general');
                      setShowAddForm(false);
                    }}
                    className="flex-1 py-3 px-6 rounded-lg font-semibold bg-gray-500 hover:bg-gray-600 text-white transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reminders List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {reminders.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className={`text-center py-12 rounded-2xl ${
                isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'
              }`}
            >
              <MdNotifications className="mx-auto text-6xl text-gray-400 mb-4" />
              <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No reminders yet. Add your first reminder to get started!
              </p>
            </motion.div>
          ) : (
            reminders.map((reminderItem) => (
              <motion.div
                key={reminderItem.id}
                variants={itemVariants}
                className={`p-6 rounded-2xl shadow-lg transition-all duration-200 ${
                  reminderItem.completed
                    ? `${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100'} opacity-60`
                    : isDarkMode
                    ? 'bg-[#1a1e2e] border border-gray-700'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-full ${getReminderColor(reminderItem.type)} text-white`}>
                      <span className="text-2xl">{getReminderIcon(reminderItem.type)}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`text-lg font-semibold ${
                          reminderItem.completed
                            ? 'line-through'
                            : isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {reminderItem.text}
                        </h3>
                        {reminderItem.type === 'emergency' && (
                          <MdPriorityHigh className="text-red-500" size={20} />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <MdAccessTime size={16} />
                          {new Date(reminderItem.time).toLocaleString()}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          reminderItem.type === 'emergency'
                            ? 'bg-red-100 text-red-800'
                            : reminderItem.type === 'medical'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {reminderItem.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleComplete(reminderItem.id)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        reminderItem.completed
                          ? 'bg-green-500 text-white'
                          : isDarkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                      }`}
                    >
                      {reminderItem.completed ? '✓' : '○'}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(reminderItem.id)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        isDarkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                      }`}
                    >
                      <MdEdit size={16} />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(reminderItem.id)}
                      className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
                    >
                      <MdDelete size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Reminders; 