// src/AdminAuth.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { FirebaseContext } from './index'; // Import the FirebaseContext

function AdminAuth() {
  const { auth, db, appId } = useContext(FirebaseContext);
  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState(''); // New field for admin registration
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // For success messages

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (isRegistering && password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (isRegistering && !companyName.trim()) {
      setError("Company Name is required for registration.");
      setLoading(false);
      return;
    }

    try {
      let userCredential;
      if (isRegistering) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Store guide data in Firestore
        const userId = userCredential.user.uid;
        // Path: /artifacts/{appId}/users/{userId}/guides/{guideId}
        const guideDocRef = doc(db, `artifacts/${appId}/users/${userId}/guides`, userId);
        await setDoc(guideDocRef, {
          email: email,
          companyName: companyName,
          role: 'guide',
          registeredAt: new Date().toISOString(),
        });
        setMessage('Registration successful! You can now log in.');
        setIsRegistering(false); // Switch to login view after successful registration
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        setMessage('Login successful!');
        navigate('/admin-dashboard'); // Redirect to admin dashboard
      }
    } catch (err) {
      console.error("Auth Error:", err);
      let errorMessage = "An unexpected error occurred.";
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use. Try logging in or use a different email.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-saarthi-main-bg font-body text-saarthi-text-primary p-4">
      <div className="bg-saarthi-card-bg p-8 rounded-xl shadow-xl border border-saarthi-border-light text-center w-full max-w-md">
        <h2 className="text-3xl font-bold text-black font-heading mb-6">
          {isRegistering ? 'Admin Register' : 'Admin Login'}
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {message && <p className="text-green-500 mb-4">{message}</p>}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow-sm appearance-none border border-saarthi-input-border rounded-lg w-full py-3 px-4 text-saarthi-text-primary leading-tight focus:outline-none focus:ring-2 focus:ring-saarthi-button-primary focus:border-transparent text-base"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-sm appearance-none border border-saarthi-input-border rounded-lg w-full py-3 px-4 text-saarthi-text-primary leading-tight focus:outline-none focus:ring-2 focus:ring-saarthi-button-primary focus:border-transparent text-base"
              required
            />
          </div>
          {isRegistering && (
            <>
              <div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="shadow-sm appearance-none border border-saarthi-input-border rounded-lg w-full py-3 px-4 text-saarthi-text-primary leading-tight focus:outline-none focus:ring-2 focus:ring-saarthi-button-primary focus:border-transparent text-base"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="shadow-sm appearance-none border border-saarthi-input-border rounded-lg w-full py-3 px-4 text-saarthi-text-primary leading-tight focus:outline-none focus:ring-2 focus:ring-saarthi-button-primary focus:border-transparent text-base"
                  required
                />
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full bg-saarthi-button-primary text-saarthi-card-bg font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out text-lg"
            disabled={loading}
          >
            {loading ? 'Processing...' : (isRegistering ? 'Register as Admin' : 'Login as Admin')}
          </button>
        </form>

        <p className="text-saarthi-text-primary mt-6">
          {isRegistering ? (
            <>
              Already have an admin account?{' '}
              <button
                onClick={() => setIsRegistering(false)}
                className="text-saarthi-button-primary hover:underline"
              >
                Login here
              </button>
            </>
          ) : (
            <>
              New guide?{' '}
              <button
                onClick={() => setIsRegistering(true)}
                className="text-saarthi-button-primary hover:underline"
              >
                Register your company
              </button>
            </>
          )}
        </p>
        <Link to="/" className="mt-8 inline-block text-saarthi-button-primary hover:underline">← Back to Home</Link>
      </div>
    </div>
  );
}

export default AdminAuth;
