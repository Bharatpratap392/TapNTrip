// src/AdminApp.js

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { signOut } from 'firebase/auth'; // Import signOut
import { FirebaseContext } from './index'; // Import the FirebaseContext

function AdminApp() {
  const { db, auth, user, appId } = useContext(FirebaseContext); // Access Firebase instances and user
  const navigate = useNavigate(); // Initialize useNavigate
  const [username, setUsername] = useState(user ? user.email || "Guide Admin" : "Guide Admin"); // Use Firebase user email if available
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [fontSize, setFontSize] = useState(16);

  // Handler for language selection dropdown
  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    // In a real application, you would integrate an i18n library here
    // to dynamically change the content language based on the selection.
  };

  // Function to increase font size, with a maximum limit
  const increaseFontSize = () => {
    setFontSize(prevSize => Math.min(prevSize + 2, 24));
  };

  // Function to decrease font size, with a minimum limit
  const decreaseFontSize = () => {
    setFontSize(prevSize => Math.max(prevSize - 2, 12));
  };

  // Helper function to apply dynamic font size using Tailwind's arbitrary value syntax
  const getDynamicFontSizeClass = () => {
    if (fontSize > 20) return `text-[${fontSize}px] leading-relaxed`;
    return `text-[${fontSize}px]`;
  };

  // Dynamic font size for smaller elements like input placeholders or labels
  const getSmallerDynamicFontSizeClass = () => {
    return `text-[${Math.max(fontSize - 2, 12)}px]`;
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirect to landing page after logout
    } catch (error) {
      console.error("Error logging out:", error);
      // Optionally, display an error message to the user
    }
  };

  return (
    <div className="flex flex-col h-screen bg-saarthi-main-bg font-body text-saarthi-text-primary overflow-hidden">
      {/* 1. Header Section - Reused from Customer App */}
      <header className="w-full bg-saarthi-header text-saarthi-card-bg p-4 lg:px-8 flex items-center justify-between shadow-xl flex-shrink-0">
        {/* Left Top: Application Name / Icon */}
        <div className="flex items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            TapNTrip
          </h1>
        </div>

        {/* Right Top: Search Icon, Greetings, Language Dropdown, Font Size Buttons, Profile Section */}
        <div className="flex items-center space-x-4 lg:space-x-8">
          {/* Search Icon (optional for admin, can be removed if not needed) */}
          <button className=" hover:text-saarthi-text-secondary p-2 rounded-full hover:bg-saarthi-header/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-saarthi-text-secondary text-black">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <span className="sr-only">Search</span>
          </button>

          {/* Introduction/Greetings with dynamic username and font size */}
          <span className={`${getDynamicFontSizeClass()} font-semibold hidden md:inline-block text-black`}>Hi, {username}</span>

          {/* Language Dropdown for Indian Languages */}
          <div className="relative">
            <select
              className="bg-saarthi-button-secondary rounded-lg p-2 appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-saarthi-text-secondary cursor-pointer border border-transparent hover:border-saarthi-text-secondary text-black"
              value={selectedLanguage}
              onChange={handleLanguageChange}
              style={{ fontSize: `${Math.max(fontSize - 2, 14)}px` }}
            >
              <option value="English">English</option>
              <option value="Hindi">हिंदी</option>
              <option value="Tamil">தமிழ்</option>
              <option value="Telugu">తెలుగు</option>
              <option value="Marathi">मराठी</option>
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-black">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </span>
          </div>

          {/* Font Size Change Buttons (A- for decrease, A+ for increase) */}
          <div className="flex space-x-2">
            <button
              onClick={decreaseFontSize}
              className="bg-saarthi-button-secondary text-black rounded-lg p-2 hover:bg-saarthi-button-secondary/80 focus:outline-none focus:ring-2 focus:ring-saarthi-text-secondary text-sm font-bold transition-colors duration-200"
              aria-label="Decrease font size"
            >
              A-
            </button>
            <button
              onClick={increaseFontSize}
              className="bg-saarthi-button-secondary text-black rounded-lg p-2 hover:bg-saarthi-button-secondary/80 focus:outline-none focus:ring-2 focus:ring-saarthi-text-secondary text-lg font-bold transition-colors duration-200"
              aria-label="Increase font size"
            >
              A+
            </button>
          </div>

          {/* Profile Section with Logout Button */}
          <div className="relative group">
            <button className="flex items-center space-x-2 text-black hover:text-saarthi-text-secondary p-2 rounded-full hover:bg-saarthi-header/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-saarthi-text-secondary">
              <img src="/AVATAR.png" alt="Profile" className="h-9 w-9 rounded-full border-2 border-saarthi-card-bg" />
              <span className="hidden md:inline font-medium">Profile</span>
            </button>
            {/* Dropdown for Logout */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out transform scale-95 group-hover:scale-100">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area for Admin - Guides' Dashboard */}
      <div className="flex flex-1 overflow-hidden">
        {/* Admin Sidebar (simplified or specific to guide functions) */}
        <aside className="w-64 bg-saarthi-sidebar p-6 border-r border-saarthi-input-border shadow-inner flex-shrink-0 overflow-y-auto">
          <nav className="space-y-6">
            <div className="border-b border-saarthi-input-border/50 pb-4 mb-4">
              <h3 className={`text-xl font-semibold text-black mb-4 font-heading ${getDynamicFontSizeClass()}`}>Guide Tools</h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className={`flex items-center text-saarthi-text-primary hover:text-saarthi-button-secondary font-medium transition-colors duration-200 ${getDynamicFontSizeClass()} p-2 rounded-lg hover:bg-saarthi-card-bg/50`}>
                    <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM5 8a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zM5 12a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"></path></svg>
                    Upload Packages
                  </a>
                </li>
                <li>
                  <a href="#" className={`flex items-center text-saarthi-text-primary hover:text-saarthi-button-secondary font-medium transition-colors duration-200 ${getDynamicFontSizeClass()} p-2 rounded-lg hover:bg-saarthi-card-bg/50`}>
                    <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v2H7V3a1 1 0 10-2 0v2H4zm-2 4h16v6a2 2 0 01-2 2H4a2 2 0 01-2-2V9z" clipRule="evenodd"></path></svg>
                    Manage Bookings
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Admin Dashboard Content Area */}
        <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
          <section className="bg-saarthi-card-bg p-6 lg:p-8 rounded-xl shadow-xl border border-saarthi-border-light">
            <h2 className={`text-2xl lg:text-3xl font-bold text-black mb-6 font-heading ${getDynamicFontSizeClass()}`}>Upload Your Pilgrimage Packages</h2>
            <p className={`${getDynamicFontSizeClass()} text-saarthi-text-primary mt-4 mb-6`}>Use the form below to add new trip packages that will be visible to customers on the main platform.</p>

            {/* Package Upload Form Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="packageName" className={`block text-saarthi-text-primary font-semibold mb-2 ${getSmallerDynamicFontSizeClass()}`}>Package Name</label>
                <input type="text" id="packageName" placeholder="e.g., Char Dham Yatra (Guide Name)" className="shadow-sm appearance-none border border-saarthi-input-border rounded-lg w-full py-3 px-4 text-saarthi-text-primary leading-tight focus:outline-none focus:ring-2 focus:ring-saarthi-button-primary focus:border-transparent text-base" style={{ fontSize: `${Math.max(fontSize * 0.9, 14)}px` }} />
              </div>
              <div>
                <label htmlFor="packageDescription" className={`block text-saarthi-text-primary font-semibold mb-2 ${getSmallerDynamicFontSizeClass()}`}>Description</label>
                <textarea id="packageDescription" placeholder="Detailed description of the package" rows="4" className="shadow-sm appearance-none border border-saarthi-input-border rounded-lg w-full py-3 px-4 text-saarthi-text-primary leading-tight focus:outline-none focus:ring-2 focus:ring-saarthi-button-primary focus:border-transparent text-base" style={{ fontSize: `${Math.max(fontSize * 0.9, 14)}px` }}></textarea>
              </div>
              <div>
                <label htmlFor="price" className={`block text-saarthi-text-primary font-semibold mb-2 ${getSmallerDynamicFontSizeClass()}`}>Price (per person)</label>
                <input type="number" id="price" min="0" placeholder="e.g., 15000" className="shadow-sm appearance-none border border-saarthi-input-border rounded-lg w-full py-3 px-4 text-saarthi-text-primary leading-tight focus:outline-none focus:ring-2 focus:ring-saarthi-button-primary focus:border-transparent text-base" style={{ fontSize: `${Math.max(fontSize * 0.9, 14)}px` }} />
              </div>
              <div>
                <label htmlFor="duration" className={`block text-saarthi-text-primary font-semibold mb-2 ${getSmallerDynamicFontSizeClass()}`}>Duration (days)</label>
                <input type="number" id="duration" min="1" placeholder="e.g., 7" className="shadow-sm appearance-none border border-saarthi-input-border rounded-lg w-full py-3 px-4 text-saarthi-text-primary leading-tight focus:outline-none focus:ring-2 focus:ring-saarthi-button-primary focus:border-transparent text-base" style={{ fontSize: `${Math.max(fontSize * 0.9, 14)}px` }} />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="imageUpload" className={`block text-saarthi-text-primary font-semibold mb-2 ${getSmallerDynamicFontSizeClass()}`}>Package Image</label>
                <input type="file" id="imageUpload" accept="image/*" className="shadow-sm appearance-none border border-saarthi-input-border rounded-lg w-full py-3 px-4 text-saarthi-text-primary leading-tight focus:outline-none focus:ring-2 focus:ring-saarthi-button-primary focus:border-transparent text-base file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-saarthi-button-secondary file:text-saarthi-text-primary hover:file:bg-saarthi-button-primary hover:file:text-saarthi-card-bg transition duration-300" />
              </div>
            </div>
            <button className="mt-8 bg-saarthi-button-primary hover:bg-saarthi-button-secondary text-saarthi-card-bg font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out text-lg shadow-md hover:shadow-lg">
              Submit Package
            </button>
          </section>

          {/* Section for Managing Existing Packages (Placeholder) */}
          <section className="mt-8 bg-saarthi-card-bg p-6 lg:p-8 rounded-xl shadow-xl border border-saarthi-border-light">
            <h2 className={`text-2xl lg:text-3xl font-bold text-black font-heading ${getDynamicFontSizeClass()}`}>Your Existing Packages</h2>
            <p className={`${getDynamicFontSizeClass()} text-saarthi-text-primary mt-4`}>A list of all packages you have uploaded will appear here, with options to edit or remove them.</p>
            {/* Example placeholder for package cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <div className="border border-saarthi-border-light rounded-xl p-4 bg-saarthi-card-bg shadow-lg hover:shadow-xl transition-shadow duration-200">
                <h3 className={`font-semibold text-xl font-heading ${getDynamicFontSizeClass()} text-black`}>Guide's Kedarnath Trip</h3>
                <p className={`text-saarthi-text-primary ${getSmallerDynamicFontSizeClass()} mt-2`}>A spiritual journey to Kedarnath with personalized guide assistance.</p>
                <button className="mt-4 bg-saarthi-button-secondary text-saarthi-text-primary font-bold py-2 px-4 rounded-lg hover:bg-saarthi-button-primary transition-colors duration-200 text-base shadow-sm hover:shadow-md" style={{ fontSize: `${Math.max(fontSize * 0.9, 14)}px` }}>Edit Details</button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default AdminApp;
