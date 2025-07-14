import React, { useState, useEffect } from 'react';
// import { useUser } from '@clerk/clerk-react'; // Uncomment if Clerk is set up
import { sendEmergencyAlert, getHealthProfile } from '../../services/firestoreService';

const EmergencyButton = ({ showFloating = true, onShowEmergency }) => {
  const [showModal, setShowModal] = useState(false);
  const [location, setLocation] = useState(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [showOnLock, setShowOnLock] = useState(false);
  const [healthProfile, setHealthProfile] = useState(null);
  const [error, setError] = useState(null);

  // const { user } = useUser(); // Clerk user
  const userId = 'mock-user-id'; // Replace with user.id from Clerk

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getHealthProfile();
        setHealthProfile(data);
      } catch (e) {
        setHealthProfile(null);
      }
    }
    if (showModal) fetchProfile();
  }, [showModal]);

  const handleEmergency = () => {
    if (onShowEmergency) {
      onShowEmergency();
      return;
    }
    setError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation(pos.coords),
        () => setError('Location access denied')
      );
    }
    setShowModal(true);
  };

  const handleSendAlert = async () => {
    setSending(true);
    setError(null);
    try {
      await sendEmergencyAlert({
        location,
        healthProfile,
        showOnLock,
      });
      setSent(true);
    } catch (e) {
      setError('Failed to send alert.');
    }
    setSending(false);
  };

  return (
    <div>
      <button
        style={showFloating ? {
          background: 'red', color: 'white', fontSize: '1.5rem', padding: '1rem', borderRadius: '1rem', position: 'fixed', bottom: 24, right: 24, zIndex: 10000
        } : {
          background: 'red', color: 'white', fontSize: '1.5rem', padding: '1rem', borderRadius: '1rem', margin: '2rem auto', display: 'block'
        }}
        onClick={handleEmergency}
        aria-label="Emergency Button"
      >
        🚨 Emergency
      </button>
      {showModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-70"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl p-8 max-w-sm w-full shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-red-700">Medical Info</h2>
            {healthProfile ? (
              <ul className="mb-4 text-gray-900">
                <li><b>Conditions:</b> {healthProfile.conditions}</li>
                <li><b>Medications:</b> {healthProfile.medications}</li>
                <li><b>Allergies:</b> {healthProfile.allergies}</li>
                <li><b>Emergency Contacts:</b> {healthProfile.contacts}</li>
              </ul>
            ) : <p className="mb-4 text-gray-900">No health profile info available.</p>}
            {location && <p className="mb-2 text-gray-900"><b>Location:</b> {location.latitude}, {location.longitude}</p>}
            <label className="block mb-4 text-gray-900">
              <input type="checkbox" checked={showOnLock} onChange={e => setShowOnLock(e.target.checked)} className="mr-2" />
              Show on Lock Screen
            </label>
            <div className="flex gap-2">
              <button onClick={handleSendAlert} disabled={sending || sent} className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-60">
                {sending ? 'Sending...' : sent ? 'Alert Sent!' : 'Send Alert'}
              </button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-gray-300">Close</button>
            </div>
            {error && <div className="text-red-600 mt-3">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyButton; 