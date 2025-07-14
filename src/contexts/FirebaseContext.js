import React, { createContext, useContext } from 'react';
import { auth, db, analytics } from '../firebase-config';

const FirebaseContext = createContext(null);

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
  const appId = process.env.REACT_APP_FIREBASE_APP_ID || 'default-app-id';
  
  const value = {
    auth,
    db,
    analytics,
    appId
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseContext; 