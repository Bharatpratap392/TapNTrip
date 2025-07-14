import React from "react";
import { useNavigate } from 'react-router-dom';
import { auth } from "../firebase-config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Role-based route paths
export const ROUTE_PATHS = {
  CUSTOMER: '/customer-dashboard',
  SERVICE_PROVIDER: '/service-dashboard',
  ADMIN: '/admin-dashboard',
  LOGIN: '/login',
};

// Protected route paths by role
export const PROTECTED_PATHS = {
  customer: ['/customer-dashboard', '/bookings', '/profile'],
  service_provider: ['/service-dashboard', '/services', '/bookings', '/earnings', '/profile'],
  admin: ['/admin-dashboard', '/users', '/content', '/analytics', '/settings'],
};

// Role-based redirect paths after login
export const getRedirectPath = (role) => {
  switch (role) {
    case 'customer':
      return ROUTE_PATHS.CUSTOMER;
    case 'service_provider':
      return ROUTE_PATHS.SERVICE_PROVIDER;
    case 'admin':
      return ROUTE_PATHS.ADMIN;
    default:
      return ROUTE_PATHS.LOGIN;
  }
};

// Check if user has access to current path
export const hasAccess = (role, path) => {
  if (!role) return false;
  return PROTECTED_PATHS[role]?.some(protectedPath => path.startsWith(protectedPath));
};

// Hook to protect routes
export const useAuthRedirect = (user) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate(ROUTE_PATHS.LOGIN, { replace: true });
      return;
    }

    const path = window.location.pathname;
    if (!hasAccess(user.role, path)) {
      navigate(getRedirectPath(user.role), { replace: true });
    }
  }, [user, navigate]);
};

// Register (Sign Up)
export const register = (email, password) => createUserWithEmailAndPassword(auth, email, password);

// Login (Sign In)
export const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

// Google Sign-In
export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}; 