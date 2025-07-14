# 🧳 TapNTrip — Your Personalized Travel Companion 🚀

A full-stack travel booking platform built using modern web technologies for all age groups — with a special focus on elderly users. Accessibility, safety, multilingual support, and seamless booking experiences are at the core. TapNTrip offers a personalized, scalable, and intuitive platform with robust role-based dashboards and powerful admin control.

---

## 🔥 Why TapNTrip?

TapNTrip is more than just a travel booking site — it’s a mission-driven platform to simplify travel planning. With features like tier-based rewards, real-time location tracking, voice assistant, and elderly-friendly UI/UX, TapNTrip ensures a secure and personalized journey.

---

## 🌟 Core Features

### 🧑‍💼 Multi-Role Authentication System
- **Customer Panel** – Book Flights, Hotels, Trains, Buses, and Packages.
- **Service Provider Panel** – Manage services as a hotel, transport, guide, or package provider.
- **Admin Panel** – Full backend control over users, listings, bookings, and platform content.

### ✨ User-Focused Add-ons
- 📒 **My Journal** – Upload photos and write notes about your trip.
- 🧠 **AI Assistant** – Voice-optimized smart assistant for easier navigation.
- 🛡️ **SOS & Reminders** – Emergency trigger for elderly and customizable trip reminders.
- 💎 **Rewards System** – Silver and Gold tiers with discounts, benefits, and free cancellations.
- 📍 **Family Tracker** – Real-time location sharing for added safety.
- 🌍 **Multi-language Support** – English, Hindi, Tamil, and Telugu.
- 🌓 **Dark Mode** – Accessible, toggleable light/dark theme.

---

## 💻 Tech Stack

| Category             | Tech Stack / Tools                              |
|----------------------|--------------------------------------------------|
| **Frontend**         | React.js, TypeScript                             |
| **Styling/UI**       | Tailwind CSS, ShadCN UI, Lucide-react            |
| **Routing**          | React Router                                     |
| **State Management** | React Context API                                |
| **Backend/Auth**     | Firebase Auth, Firestore, Firebase Storage       |
| **i18n**             | i18next, react-i18next                           |
| **Testing**          | Jest                                             |
| **Build Tools**      | PostCSS, Babel                                   |
| **Deployment**       | Vercel                                           |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: Version 16.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **Git**: For cloning the repository

### Installation

1. **Clone or Download the Repository**
   ```bash
   git clone https://github.com/Bharatpratap392/tapntrip.git
   cd tapntrip
   ```
   
   Or download the ZIP file and extract it, then navigate to the folder.

2. **Install Dependencies**
   ```bash
   npm install
   ```
   
   If you encounter any errors, try:
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Set up Environment Variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
   ```

4. **Start the Development Server**
   ```bash
   # Start on default port (3000)
   npm start
   
   # Start on port 3001
   npm run start:3001
   ```

5. **Open Your Browser**
   
   Navigate to `http://localhost:3000` or `http://localhost:3001`

## 🛠️ Available Scripts

- `npm start` - Start development server on port 3000
- `npm run start:3001` - Start development server on port 3001
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Check for linting errors
- `npm run lint:fix` - Fix linting errors automatically
- `npm run format` - Format code with Prettier
- `npm run clean` - Clean install (remove node_modules and reinstall)

## 🔧 Troubleshooting

### Common Installation Issues

1. **Node Version Issues**
   ```bash
   # Check your Node.js version
   node --version
   
   # If below 16.0.0, update Node.js
   # Download from: https://nodejs.org/
   ```

2. **Permission Errors (Linux/Mac)**
   ```bash
   # Fix npm permissions
   sudo chown -R $USER:$GROUP ~/.npm
   sudo chown -R $USER:$GROUP ~/.config
   ```

3. **Port Already in Use**
   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   
   # Or use a different port
   npm run start:3001
   ```

4. **Firebase Configuration Issues**
   - Ensure all Firebase environment variables are set correctly
   - Check that your Firebase project is properly configured
   - Verify that Authentication and Firestore are enabled

5. **Package Installation Errors**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Delete node_modules and package-lock.json
   rm -rf node_modules package-lock.json
   
   # Reinstall dependencies
   npm install
   ```

### Platform-Specific Issues

**Windows:**
- Use Git Bash or WSL for better compatibility
- Ensure you have the latest version of Node.js

**macOS:**
- Use Homebrew to install Node.js: `brew install node`
- If you get permission errors, use `sudo npm install`

**Linux:**
- Use NodeSource repository for latest Node.js versions
- Install build tools: `sudo apt-get install build-essential`

## 📁 Project Structure

```
TapNTrip/
├── public/                 # Static files
├── src/
│   ├── components/         # React components
│   │   ├── admin/         # Admin panel components
│   │   ├── common/        # Shared components
│   │   ├── customer/      # Customer dashboard components
│   │   └── service-provider/ # Service provider components
│   ├── contexts/          # React contexts
│   ├── services/          # API and Firebase services
│   ├── utils/             # Utility functions
│   ├── translations/      # i18n translation files
│   └── styles/            # CSS and theme files
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
└── README.md             # This file
```

## 🔐 Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password and Google)
3. Enable Firestore Database
4. Enable Storage (if using file uploads)
5. Copy your Firebase config to `.env.local`

## 🌐 Features

- **Multi-role Authentication**: Customer, Service Provider, Admin
- **Real-time Booking System**: Hotel, Transport, Guide services
- **Multi-language Support**: English, Hindi, Tamil, Telugu
- **Responsive Design**: Works on all devices
- **Dark/Light Theme**: User preference support
- **Accessibility Features**: Elderly-friendly interface
- **Real-time Chat**: Customer support
- **Payment Integration**: Secure payment processing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 🔄 Updates

To update the project:

```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Start the development server
npm start
```

---

**Happy Coding! 🚀**
