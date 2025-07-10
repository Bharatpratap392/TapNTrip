import React, { useState } from "react";
import { register, login, signInWithGoogle } from "../../utils/auth";
import { db } from "../../firebase-config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaPhone } from "react-icons/fa";
import { motion } from "framer-motion";
import { sendEmailVerification } from "firebase/auth";

const roles = [
  { value: "guide_provider", label: "Guide Provider", icon: <FaUser className="inline mr-2" /> },
  { value: "hotel_provider", label: "Hotel Provider", icon: <FaUser className="inline mr-2" /> },
  { value: "transport_provider", label: "Transport Provider", icon: <FaUser className="inline mr-2" /> },
  { value: "customer", label: "Customer", icon: <FaUser className="inline mr-2" /> },
  { value: "admin", label: "Admin", icon: <FaUser className="inline mr-2" /> }, // Added Admin role
];

const roleToDashboard = {
  guide_provider: "/service-dashboard",
  hotel_provider: "/service-dashboard",
  transport_provider: "/service-dashboard",
  customer: "/customer-dashboard",
  admin: "/admin-dashboard", // Added admin dashboard redirect
};

export default function PanelRegister() {
  const [role, setRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();

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
          status: role === "admin" ? "active" : "pending", // Admins are active by default
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
          status: role === "admin" ? "active" : "pending", // Admins are active by default
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-xl p-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          {isLogin ? "Sign In" : "Register"} for a Panel
        </h2>
        {verificationSent ? (
          <div className="text-center text-green-600 font-semibold">
            Verification email sent! Please check your inbox and verify your email before logging in.
          </div>
        ) : (
          <>
            {!isLogin && (
              <div className="flex justify-center mb-8">
                <div className="flex w-full flex-wrap gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-xl">
                  {roles.map(r => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={`flex-1 min-w-[120px] flex items-center justify-center px-4 py-3 rounded-lg font-semibold transition-all duration-150 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 ${role === r.value ? "bg-gradient-to-r from-blue-500 to-pink-500 text-white shadow-lg" : "bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                    >
                      {r.icon} {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
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