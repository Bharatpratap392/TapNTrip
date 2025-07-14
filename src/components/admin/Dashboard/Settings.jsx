import React from 'react';
import { MdSettings, MdDarkMode, MdLightMode } from 'react-icons/md';
import { useTheme } from '../../../contexts/ThemeContext';

const Settings = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="space-y-10">
      <div className="glassmorphism bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl flex items-center gap-6 mb-6">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <MdSettings className="w-10 h-10 text-gray-700 dark:text-gray-200 drop-shadow-lg" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white drop-shadow-lg">Settings</h1>
          <p className="text-lg text-gray-500 dark:text-gray-300 mt-2">Manage your preferences</p>
        </div>
      </div>
      <div className="glassmorphism bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              {isDarkMode ? <MdDarkMode className="w-5 h-5 text-purple-600 dark:text-purple-400" /> : <MdLightMode className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
            </div>
            <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Appearance</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Toggle between light and dark mode</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
          <span className="text-sm font-bold text-gray-900 dark:text-white">Dark Mode</span>
          <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${isDarkMode ? 'bg-blue-600' : 'bg-gray-200'}`}
              aria-label="Toggle dark mode"
            >
              <span className="sr-only">Toggle dark mode</span>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-200 ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`}></span>
          </button>
            </div>
          </div>
      <div className="flex flex-col items-center justify-center min-h-[150px] text-gray-400">
        <p className="text-base">More settings coming soon.</p>
      </div>
    </div>
  );
};

export default Settings;