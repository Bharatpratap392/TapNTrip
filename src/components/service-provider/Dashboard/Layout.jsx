import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiLogOut, FiMenu, FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { MdDirectionsCar, MdHotel, MdTour, MdRoom, MdKingBed, MdMeetingRoom } from 'react-icons/md';
import { BiBookContent, BiHomeAlt, BiTrip } from 'react-icons/bi';
import { FaUserCircle, FaUsers, FaRoute, FaHotel, FaUmbrellaBeach } from 'react-icons/fa';
import { RiDashboardFill, RiHotelFill, RiUserSettingsFill, RiBookmarkFill } from 'react-icons/ri';
import { IoMdCompass } from 'react-icons/io';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { auth } from '../../../firebase-config';
import { signOut } from 'firebase/auth';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import Profile from './Profile';
import Settings from './Settings';
import './Dashboard.css';

const Layout = ({ children, selectedProvider, onProviderChange, activeTab, onTabChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [zoom, setZoom] = useState(100);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const handleReset = () => {
    setZoom(100);
  };

  const providerOptions = ['Hotel Provider', 'Travel Guide', 'Transport Provider'];

  const getSidebarSections = () => {
    const mainNavigation = [
      { 
        name: 'Overview', 
        icon: <RiDashboardFill />,
        onClick: () => onTabChange('overview')
      },
      { 
        name: 'Home', 
        icon: <BiHomeAlt />,
        onClick: () => onTabChange('home')
      }
    ];

    const providerSpecificItems = {
      'Hotel Provider': [
        { 
          name: 'Hotels', 
          icon: <RiHotelFill />,
          onClick: () => onTabChange('add-service')
        },
        { 
          name: 'Bookings', 
          icon: <RiBookmarkFill />,
          onClick: () => onTabChange('bookings')
        }
      ],
      'Travel Guide': [
        { 
          name: 'Tours', 
          icon: <IoMdCompass />,
          onClick: () => onTabChange('add-service')
        },
        { 
          name: 'Bookings', 
          icon: <RiBookmarkFill />,
          onClick: () => onTabChange('bookings')
        }
      ],
      'Transport Provider': [
        { 
          name: 'Vehicles', 
          icon: <MdDirectionsCar />,
          onClick: () => onTabChange('add-service')
        },
        { 
          name: 'Bookings', 
          icon: <RiBookmarkFill />,
          onClick: () => onTabChange('bookings')
        }
      ]
    };

    const reports = [
      {
        name: 'Analytics',
        icon: <HiOutlineDocumentReport />,
        onClick: () => onTabChange('analytics')
      },
      {
        name: 'All Bookings',
        icon: <BiBookContent />,
        onClick: () => onTabChange('all-bookings')
      }
    ];

    const userSettings = [
      { 
        name: 'Profile', 
        icon: <FaUserCircle />,
        onClick: () => onTabChange('profile')
      },
      { 
        name: 'Settings', 
        icon: <RiUserSettingsFill />,
        onClick: () => onTabChange('settings')
      }
    ];

    return [
      {
        title: 'Main',
        items: mainNavigation
      },
      {
        title: 'Management',
        items: providerSpecificItems[selectedProvider]
      },
      {
        title: 'Reports',
        items: reports
      },
      {
        title: 'Account',
        items: userSettings
      }
    ];
  };

  const getProviderSpecificContent = () => {
    switch (selectedProvider) {
      case 'Hotel Provider':
        return {
          actions: [
            { label: 'Add New Room', icon: <MdKingBed /> },
            { label: 'Manage Bookings', icon: <RiBookmarkFill /> },
            { label: 'Room Status', icon: <MdMeetingRoom /> }
          ],
          stats: [
            { value: '45', label: 'Total Rooms', icon: <MdHotel /> },
            { value: '28', label: 'Active Bookings', icon: <RiBookmarkFill /> },
            { value: '₹1,25,000', label: 'Total Revenue', icon: <HiOutlineDocumentReport /> }
          ],
          tabs: ['Overview', 'Rooms', 'Bookings'],
          bookings: [
            {
              passenger: 'David Lee',
              type: 'Deluxe Room',
              date: '2024-03-15',
              duration: '5 days',
              status: 'confirmed',
              amount: '₹25,000'
            },
            {
              passenger: 'Emma White',
              type: 'Suite',
              date: '2024-03-16',
              duration: '3 days',
              status: 'pending',
              amount: '₹15,000'
            }
          ]
        };

      case 'Travel Guide':
        return {
          actions: [
            { label: 'Add New Tour', icon: <MdTour /> },
            { label: 'Manage Bookings', icon: <RiBookmarkFill /> },
            { label: 'Tour Status', icon: <FaRoute /> }
          ],
          stats: [
            { value: '8', label: 'Active Tours', icon: <BiTrip /> },
            { value: '32', label: 'Total Tourists', icon: <FaUsers /> },
            { value: '₹85,000', label: 'Total Revenue', icon: <HiOutlineDocumentReport /> }
          ],
          tabs: ['Overview', 'Tours', 'Bookings'],
          bookings: [
            {
              passenger: 'Sarah Johnson',
              type: 'City Tour',
              date: '2024-03-15',
              duration: '2 days',
              status: 'confirmed',
              amount: '₹8,000'
            },
            {
              passenger: 'Mike Brown',
              type: 'Adventure Trek',
              date: '2024-03-18',
              duration: '3 days',
              status: 'pending',
              amount: '₹12,000'
            }
          ]
        };

      case 'Transport Provider':
        return {
          actions: [
            { label: 'Add New Vehicle', icon: <MdDirectionsCar /> },
            { label: 'Manage Bookings', icon: <RiBookmarkFill /> },
            { label: 'Vehicle Status', icon: <MdDirectionsCar /> }
          ],
          stats: [
            { value: '12', label: 'Total Vehicles', icon: <MdDirectionsCar /> },
            { value: '6', label: 'Active Bookings', icon: <RiBookmarkFill /> },
            { value: '₹55,000', label: 'Total Revenue', icon: <HiOutlineDocumentReport /> }
          ],
          tabs: ['Overview', 'Vehicles', 'Bookings'],
          bookings: [
            {
              passenger: 'David Lee',
              type: 'SUV',
              date: '2024-03-15',
              duration: '5 days',
              status: 'confirmed',
              amount: '₹25,000'
            },
            {
              passenger: 'Emma White',
              type: 'Sedan',
              date: '2024-03-16',
              duration: '3 days',
              status: 'pending',
              amount: '₹15,000'
            }
          ]
        };

      default:
        return null;
    }
  };

  const content = getProviderSpecificContent();

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      case 'overview':
      case 'dashboard':
      case 'add-service':
      case 'bookings':
        return children;
      default:
        return children;
    }
  };

  return (
    <div className={`dashboard-container ${isDarkMode ? 'dark' : ''}`} style={{ zoom: `${zoom}%` }}>
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        className={`sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}
      >
        {getSidebarSections().map((section, index) => (
          <div key={section.title} className="sidebar-section">
            <div className="sidebar-section-title">{section.title}</div>
            <nav className="sidebar-nav">
              {section.items.map((item) => (
                <motion.button
                  key={item.name}
                  onClick={item.onClick}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`nav-item ${
                    activeTab === (item.name.toLowerCase() === 'overview' ? 'overview' : item.name.toLowerCase().replace(' ', '-'))
                      ? 'active'
                      : ''
                  }`}
                >
                  {item.icon}
                  <span className="nav-text">{item.name}</span>
                </motion.button>
              ))}
            </nav>
            {index < getSidebarSections().length - 1 && <div className="sidebar-divider" />}
          </div>
        ))}
      </motion.aside>

      {/* Main Content */}
      <main className={`main-content ${!isSidebarOpen ? 'ml-20' : ''}`}>
        {/* Header */}
        <header className="header">
          <div className="header-section">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="btn"
              aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <FiMenu className="w-6 h-6" />
            </motion.button>

            <div className="user-info">
              <span className="user-name">John Doe</span>
              <span className="user-role">{selectedProvider}</span>
            </div>

            <select
              value={selectedProvider}
              onChange={(e) => onProviderChange(e.target.value)}
              className="btn"
            >
              {providerOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="header-section">
            <div className="zoom-controls">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleZoomOut}
                className="btn"
                aria-label="Zoom out"
              >
                <FiZoomOut className="w-6 h-6" />
              </motion.button>
              
              <span className="zoom-value">{zoom}%</span>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleZoomIn}
                className="btn"
                aria-label="Zoom in"
              >
                <FiZoomIn className="w-6 h-6" />
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="btn"
            >
              Reset
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="btn"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <FiSun className="w-6 h-6 text-yellow-500" />
              ) : (
                <FiMoon className="w-6 h-6" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="btn btn-primary"
              aria-label="Logout"
            >
              <FiLogOut className="w-6 h-6" />
            </motion.button>
          </div>
        </header>

        <div className="p-6">
          {/* Action Buttons */}
          <div className="action-buttons animate-fade-in">
            {content.actions.map((action, index) => (
              <button key={index} className="action-button">
                {action.icon}
                <span>{action.label}</span>
              </button>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="stats-container animate-fade-in">
            {content.stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                {React.cloneElement(stat.icon, { className: 'stat-icon' })}
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="tabs animate-fade-in">
            {content.tabs.map((tab, index) => (
              <button key={index} className={`tab ${index === 0 ? 'active' : ''}`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Recent Bookings */}
          <div className="section-title animate-fade-in">Recent Bookings</div>
          <div className="animate-fade-in">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>PASSENGER</th>
                  <th>{selectedProvider === 'Hotel Provider' ? 'ROOM TYPE' : 
                      selectedProvider === 'Travel Guide' ? 'TOUR TYPE' : 'VEHICLE TYPE'}</th>
                  <th>{selectedProvider === 'Hotel Provider' ? 'CHECK-IN' : 
                      selectedProvider === 'Travel Guide' ? 'TOUR DATE' : 'PICKUP DATE'}</th>
                  <th>DURATION</th>
                  <th>STATUS</th>
                  <th>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {content.bookings.map((booking, index) => (
                  <tr key={index}>
                    <td>{booking.passenger}</td>
                    <td>{booking.type}</td>
                    <td>{booking.date}</td>
                    <td>{booking.duration}</td>
                    <td>
                      <span className={`status-badge ${booking.status}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="amount">{booking.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Layout; 