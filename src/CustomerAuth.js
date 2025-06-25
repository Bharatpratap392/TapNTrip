// src/CustomerAuth.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useFirebase } from './contexts/FirebaseContext'; // Import the useFirebase hook

function CustomerAuth() {
  const { auth, db, appId } = useFirebase(); // Use the hook instead of useContext
  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    try {
      let userCredential;
      if (isRegistering) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Store customer data in Firestore
        const userId = userCredential.user.uid;
        // Path: /artifacts/{appId}/users/{userId}/customers/{customerId}
        const customerDocRef = doc(db, `artifacts/${appId}/users/${userId}/customers`, userId);
        await setDoc(customerDocRef, {
          email: email,
          role: 'customer',
          registeredAt: new Date().toISOString(),
        });
        setMessage('Registration successful! You can now log in.');
        setIsRegistering(false); // Switch to login view after successful registration
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        setMessage('Login successful!');
        navigate('/customer-dashboard'); // Redirect to customer dashboard
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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 font-sans text-gray-800 p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-200 text-center w-full max-w-md">
        <h2 className="text-3xl font-bold text-black font-heading mb-6">
          {isRegistering ? 'Customer Register' : 'Customer Login'}
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
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
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
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              required
            />
          </div>
          {isRegistering && (
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                required
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out text-lg"
            disabled={loading}
          >
            {loading ? 'Processing...' : (isRegistering ? 'Register' : 'Login')}
          </button>
        </form>

        <p className="text-gray-700 mt-6">
          {isRegistering ? (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setIsRegistering(false)}
                className="text-blue-500 hover:underline"
              >
                Login here
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => setIsRegistering(true)}
                className="text-blue-500 hover:underline"
              >
                Register here
              </button>
            </>
          )}
        </p>
        <Link to="/" className="mt-8 inline-block text-blue-500 hover:underline">← Back to Home</Link>
      </div>
    </div>
  );
}

export default CustomerAuth;
