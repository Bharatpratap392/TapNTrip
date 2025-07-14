import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [zoomLevel, setZoomLevel] = useState(100);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    // Apply zoom to the entire page smoothly
    const root = document.documentElement;
    root.style.transform = `scale(${zoomLevel / 100})`;
    root.style.transformOrigin = 'top left';
    root.style.transition = 'transform 0.3s ease-in-out';
    
    // Adjust body width to prevent horizontal scrolling
    const body = document.body;
    body.style.width = `${100 / (zoomLevel / 100)}%`;
    body.style.minHeight = `${100 / (zoomLevel / 100)}vh`;
  }, [zoomLevel]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const increaseZoom = () => {
    setZoomLevel(prev => Math.min(prev + 10, 150));
  };

  const decreaseZoom = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
  };

  const resetZoom = () => {
    setZoomLevel(100);
  };

  const value = useMemo(() => ({
    isDarkMode, 
    toggleTheme,
    zoomLevel,
    increaseZoom,
    decreaseZoom,
    resetZoom
  }), [isDarkMode, zoomLevel]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 