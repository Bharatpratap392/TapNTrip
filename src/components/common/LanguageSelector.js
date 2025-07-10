import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSelector = ({ isDarkMode }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', label: 'EN', fullLabel: 'English' },
    { code: 'hi', label: 'हिंदी', fullLabel: 'Hindi' },
    { code: 'ta', label: 'தமிழ்', fullLabel: 'Tamil' },
    { code: 'te', label: 'తెలుగు', fullLabel: 'Telugu' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
    // Save to localStorage
    localStorage.setItem('i18nextLng', langCode);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center px-3 py-2 rounded-lg ${
          isDarkMode 
            ? 'bg-[#2d3348] hover:bg-[#3a4056] text-white' 
            : 'bg-blue-50 hover:bg-blue-100 text-gray-700'
        } transition-all duration-200`}
      >
        <span className="font-medium">{currentLanguage.label}</span>
        <svg 
          className={`ml-1 w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute right-0 mt-1 w-40 rounded-lg shadow-lg z-50 ${
              isDarkMode ? 'bg-[#2d3348] border-[#3a4056]' : 'bg-white border-gray-200'
            } border overflow-hidden`}
          >
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => changeLanguage(language.code)}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    isDarkMode 
                      ? 'hover:bg-[#3a4056] text-white' 
                      : 'hover:bg-gray-100 text-gray-700'
                  } ${language.code === currentLanguage.code ? 
                      isDarkMode ? 'bg-[#3a4056]' : 'bg-gray-100' 
                      : ''
                  } transition-colors duration-150`}
                >
                  <div className="flex items-center">
                    <span className="font-medium">{language.label}</span>
                    <span className="ml-2 text-xs opacity-70">
                      {language.fullLabel}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector; 