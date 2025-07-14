import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { MdPhotoCamera, MdSave, MdDelete, MdAdd } from 'react-icons/md';
import { addJournalEntry, getMyJournals, deleteJournalEntry } from '../../services/firestoreService';
import { storage } from '../../firebase-config';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

// TODO: Integrate backend for photo uploads and group trip sharing

const MyJournal = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [journalHistory, setJournalHistory] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editNote, setEditNote] = useState('');
  const [editPhotos, setEditPhotos] = useState([]);
  const [editPhotoFiles, setEditPhotoFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getMyJournals().then(entries => {
        setJournalHistory(entries.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
        setLoading(false);
      });
    }
  }, [user]);

  const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const oversized = files.find(file => file.size > MAX_FILE_SIZE);
    if (oversized) {
      toast.error('File too large. Max size is 25MB.');
      return;
    }
    setPhotos([...photos, ...files]);
  };

  const handleNoteChange = (e) => setNote(e.target.value);

  const uploadPhotos = async (files) => {
    if (!user) throw new Error('Not authenticated');
    const urls = [];
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) throw new Error('File too large. Max size is 25MB.');
      try {
        const fileRef = storageRef(storage, `journals/${user.uid}/${Date.now()}_${file.name}`);
        setIsSaving(true);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        urls.push(url);
      } catch (err) {
        toast.error('Upload failed. Please check your internet connection or try a smaller file.');
        setIsSaving(false);
        throw err;
      }
    }
    return urls;
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('You must be logged in to save a journal entry.');
      return;
    }
    setIsSaving(true);
    try {
      let photoUrls = [];
      if (photos.length > 0) {
        photoUrls = await uploadPhotos(photos);
      }
      await addJournalEntry({
        note,
        photos: photoUrls,
        group: null, // Placeholder for group sharing
        email: user?.email || '',
      });
      setNote('');
      setPhotos([]);
      // Refresh history
      const entries = await getMyJournals();
      setJournalHistory(entries.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
      toast.success('Journal entry saved!');
    } catch (err) {
      toast.error('Failed to save journal entry: ' + (err.message || err));
    }
    setIsSaving(false);
  };

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setEditNote(entry.note);
    setEditPhotos(entry.photos || []);
    setEditPhotoFiles([]);
  };

  const handleEditPhotoUpload = (e) => {
    setEditPhotoFiles([...editPhotoFiles, ...Array.from(e.target.files)]);
  };

  const handleEditSave = async () => {
    setIsSaving(true);
    let photoUrls = editPhotos;
    if (editPhotoFiles.length > 0) {
      const uploaded = await uploadPhotos(editPhotoFiles);
      photoUrls = [...editPhotos, ...uploaded];
    }
    // Update Firestore (merge)
    await addJournalEntry({
      note: editNote,
      photos: photoUrls,
      group: null,
      id: editingId,
      updatedAt: new Date(),
    });
    setEditingId(null);
    setEditNote('');
    setEditPhotos([]);
    setEditPhotoFiles([]);
    // Refresh history
    const entries = await getMyJournals();
    setJournalHistory(entries.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
    setIsSaving(false);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    await deleteJournalEntry(id);
    const entries = await getMyJournals();
    setJournalHistory(entries.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
    setDeletingId(null);
    toast.success('Journal entry deleted!');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`w-full max-w-2xl mx-auto ${isDarkMode ? 'bg-[#1a1e2e] text-white' : 'bg-white text-gray-900'} rounded-3xl shadow-2xl overflow-hidden`}
      >
        {/* Header */}
        <div className={`p-8 ${isDarkMode ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'} text-white`}>
          <h2 className="text-3xl font-bold text-center mb-2">My Travel Journal</h2>
          <p className="text-center opacity-90">Capture your memories and experiences</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Photo Upload Section */}
          <motion.div variants={cardVariants} className="space-y-4">
            <label className="block">
              <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3 block`}>
                📸 Upload Photos
              </span>
              <div className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                isDarkMode 
                  ? 'border-gray-600 hover:border-purple-400 bg-gray-800/50' 
                  : 'border-gray-300 hover:border-blue-400 bg-gray-50'
              }`}>
                <input 
                  type="file" 
                  multiple 
                  onChange={handlePhotoUpload} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                />
                <MdPhotoCamera className="mx-auto text-4xl mb-3 text-gray-400" />
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Click to upload photos or drag and drop
                </p>
              </div>
            </label>

            {/* Photo Gallery */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group"
                  >
                    <img 
                      src={URL.createObjectURL(photo)} 
                      alt="journal" 
                      className="w-full h-32 object-cover rounded-lg shadow-md"
                    />
                    <button
                      onClick={() => removePhoto(idx)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <MdDelete size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Notes Section */}
          <motion.div variants={cardVariants} className="space-y-4">
            <label className="block">
              <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3 block`}>
                📝 Trip Notes
              </span>
              <textarea 
                value={note} 
                onChange={handleNoteChange} 
                placeholder="Write about your trip experiences, memories, and thoughts..."
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 resize-none ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-400'
                } focus:outline-none focus:ring-2 focus:ring-opacity-50 min-h-[120px]`}
              />
            </label>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={cardVariants} className="flex gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={isSaving}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                isSaving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              <MdSave size={20} />
              {isSaving ? 'Saving...' : 'Save Journal'}
            </motion.button>
          </motion.div>

          {/* TODO: Add group trip sharing features */}
          <motion.div variants={cardVariants} className={`text-center p-4 rounded-xl ${
            isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'
          }`}>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              💡 Coming soon: Share your journal with travel companions
            </p>
          </motion.div>

          {/* Journal History Section */}
          {loading ? (
            <div className="text-center py-8">Loading your journal entries...</div>
          ) : (
            <div className="mt-10">
              <h3 className="text-2xl font-bold mb-4 text-center">My Journal History</h3>
              {journalHistory.length === 0 ? (
                <div className="text-center text-gray-400">No journal entries yet.</div>
              ) : (
                <div className="space-y-8">
                  {journalHistory.map(entry => (
                    <motion.div key={entry.id} className={`p-6 rounded-2xl shadow-lg ${isDarkMode ? 'bg-[#23263a]' : 'bg-gray-50'}`}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      {editingId === entry.id ? (
                        <div className="space-y-4">
                          <textarea
                            value={editNote}
                            onChange={e => setEditNote(e.target.value)}
                            className="w-full p-3 rounded-lg border-2 focus:outline-none focus:ring-2 min-h-[80px]"
                          />
                          <div className="flex flex-wrap gap-2 mb-2">
                            {editPhotos.map((url, idx) => (
                              <div key={idx} className="relative group">
                                <img src={url} alt="journal" className="w-24 h-24 object-cover rounded-lg" />
                                {/* Optionally add remove photo button */}
                              </div>
                            ))}
                            {editPhotoFiles.map((file, idx) => (
                              <img key={idx} src={URL.createObjectURL(file)} alt="new" className="w-24 h-24 object-cover rounded-lg" />
                            ))}
                          </div>
                          <input type="file" multiple onChange={handleEditPhotoUpload} className="mb-2" accept="image/*" />
                          <div className="flex gap-2">
                            <button onClick={handleEditSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
                            <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-gray-400 text-white rounded-lg">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-lg">{new Date(entry.createdAt?.seconds * 1000).toLocaleString()}</span>
                            <div className="flex gap-2">
                              <button onClick={() => handleEdit(entry)} className="px-3 py-1 bg-purple-500 text-white rounded-lg">Edit</button>
                              <button
                                onClick={() => handleDelete(entry.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded-lg flex items-center gap-1"
                                disabled={deletingId === entry.id}
                              >
                                <MdDelete size={18} />
                                {deletingId === entry.id ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                          </div>
                          <p className="mb-3 whitespace-pre-line">{entry.note}</p>
                          {entry.photos && entry.photos.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {entry.photos.map((url, idx) => (
                                <img key={idx} src={url} alt="journal" className="w-24 h-24 object-cover rounded-lg" />
                              ))}
                            </div>
                          )}
                          {/* Placeholder for group sharing */}
                          <div className="text-xs text-blue-400 mt-2">Group sharing: Coming soon</div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MyJournal; 