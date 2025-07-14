import React, { useEffect, useState } from "react";
import { register, login, signInWithGoogle } from "../../utils/auth";
import { db } from "../../firebase-config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaPhone, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import { sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase-config';
import { toast } from "react-toastify";
import { useAuth } from '../../contexts/AuthContext';

const roles = [
  { value: "guide_provider", label: "Guide Provider", icon: <FaUser className="inline mr-2" /> },
  { value: "hotel_provider", label: "Hotel Provider", icon: <FaUser className="inline mr-2" /> },
  { value: "transport_provider", label: "Transport Provider", icon: <FaUser className="inline mr-2" /> },
  { value: "customer", label: "Customer", icon: <FaUser className="inline mr-2" /> },
  { value: "admin", label: "Admin", icon: <FaUser className="inline mr-2" /> },
];

const roleToDashboard = {
  guide_provider: "/service-dashboard",
  hotel_provider: "/service-dashboard",
  transport_provider: "/service-dashboard",
  service_provider: "/service-dashboard",
  customer: "/customer-dashboard",
  admin: "/admin-dashboard",
};

export default function PanelRegister({ isLoginMode }) {
  const location = useLocation();
  const { user } = useAuth();
  const [role, setRole] = useState(location.state?.role || "");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(isLoginMode || false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!role && !isLogin) {
      navigate('/select-provider-role', { replace: true });
    }
  }, [role, isLogin, navigate]);

  useEffect(() => {
    if (isLoginMode) setIsLogin(true);
  }, [isLoginMode]);

  // Redirect authenticated users away from login/register
  useEffect(() => {
    if (user && isLogin) {
      // Only show 'Already Signed In' on login page
      setError('Already Signed In. Redirecting...');
      setTimeout(() => {
        navigate(roleToDashboard[user.role] || "/customer-dashboard");
      }, 1200);
    }
  }, [user, isLogin, navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      let userCredential;
      if (isLogin) {
        userCredential = await login(email, password);
      } else {
        if (!role || !firstName || !lastName || !mobile) throw new Error("Please fill all fields");
        userCredential = await register(email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email,
          role,
          ...( ["hotel_provider", "guide_provider", "transport_provider"].includes(role) ? { providerType: role } : {} ),
          firstName,
          lastName,
          mobile,
          status: role === "admin" ? "active" : "pending",
        });
        await sendEmailVerification(userCredential.user);
        setVerificationSent(true);
        setLoading(false);
        return;
      }
      const userRole = role || (await getDoc(doc(db, "users", userCredential.user.uid))).data()?.role;
      navigate(roleToDashboard[userRole] || "/customer-dashboard");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    setError("");
    setLoading(true);
    try {
      if (!role && !isLogin) throw new Error("Please select a role/panel");
      const result = await signInWithGoogle();
      const userDocRef = doc(db, "users", result.user.uid);
      const userDoc = await getDoc(userDocRef);
      let userRole = role;
      if (!userDoc.exists() && !isLogin) {
        let firstName = '';
        let lastName = '';
        if (result.user.displayName) {
          const nameParts = result.user.displayName.split(' ');
          firstName = nameParts[0] || '';
          lastName = nameParts.slice(1).join(' ') || '';
        }
        await setDoc(userDocRef, {
          email: result.user.email,
          role,
          ...( ["hotel_provider", "guide_provider", "transport_provider"].includes(role) ? { providerType: role } : {} ),
          status: role === "admin" ? "active" : "pending",
          firstName,
          lastName,
          mobile: '',
        });
      } else {
        userRole = userDoc.data()?.role;
      }
      navigate(roleToDashboard[userRole] || "/customer-dashboard");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter your email address first.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent! Check your inbox.');
      setResetEmailSent(true);
    } catch (error) {
      toast.error('Failed to send reset email. Please check your email address.');
    }
  };

  const handleBack = () => {
    navigate(-1, { replace: true });
  };

  const getCurrentStep = () => {
    if (role === 'service_provider') return 3;
    if (role) return 2;
    return 1;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-xl p-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 pt-12"
      >
        <button
          onClick={handleBack}
          className="absolute left-6 top-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <FaArrowLeft /> Back
        </button>
        
        {/* Step Progress */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getCurrentStep() >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
              1
            </div>
            <div className={`w-12 h-1 ${getCurrentStep() >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getCurrentStep() >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
              2
            </div>
            <div className={`w-12 h-1 ${getCurrentStep() >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getCurrentStep() >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
              3
            </div>
          </div>
        </div>
        
        <h2 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          {isLogin ? "Sign In" : "Register"} for a Panel
        </h2>
        {verificationSent ? (
          <div className="text-center text-green-600 font-semibold">
            Verification email sent! Please check your inbox and verify your email before logging in.
          </div>
        ) : (
          <>
            <form onSubmit={handleAuth} className="space-y-5">
              {!isLogin && (
                <div className="flex gap-4">
                  <div className="relative w-1/2">
                    <FaUser className="absolute left-3 top-3 text-gray-400" />
                    <input
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="First Name"
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white text-base transition"
                      required
                    />
                  </div>
                  <div className="relative w-1/2">
                    <FaUser className="absolute left-3 top-3 text-gray-400" />
                    <input
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="Last Name"
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white text-base transition"
                      required
                    />
                  </div>
                </div>
              )}
              {!isLogin && (
                <div className="relative">
                  <FaPhone className="absolute left-3 top-3 text-gray-400" />
                  <input
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    placeholder="Mobile Number"
                    type="tel"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white text-base transition"
                    required
                  />
                </div>
              )}
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email"
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white text-base transition"
                  required
                />
              </div>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white text-base transition"
                  required
                />
              </div>
              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
              {!isLogin && (
                <div className="relative">
                  <FaLock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white text-base transition"
                    required
                  />
                </div>
              )}
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-500 to-pink-500 text-white shadow-md hover:from-blue-600 hover:to-pink-600 transition"
                disabled={loading}
              >
                {loading ? "Processing..." : isLogin ? "Sign In" : "Register"}
              </button>
            </form>
            <button
              onClick={handleGoogleAuth}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              disabled={loading}
            >
              <FaGoogle className="text-red-500 text-xl" />
              {isLogin ? "Sign In with Google" : "Register with Google"}
            </button>
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 dark:text-blue-400 underline font-semibold"
              >
                {isLogin ? "Don't have an account? Register" : "Already have an account? Sign In"}
              </button>
            </div>
            {error && <div className="mt-2 text-red-600 text-center">{error}</div>}
          </>
        )}
      </motion.div>
    </div>
  );
} 