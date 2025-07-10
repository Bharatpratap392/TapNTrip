import React, { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { saveBooking } from '../../services/firestoreService';
import { useAuth } from '../../contexts/AuthContext';

const TourGuidePage = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [bookingData, setBookingData] = useState({ name: '', contact: '', date: '' });
  const [bookingStatus, setBookingStatus] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    async function fetchTours() {
      try {
        const snap = await getDocs(collection(db, 'guide_tours'));
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTours(data);
      } catch (err) {
        setError('Failed to load tours');
      } finally {
        setLoading(false);
      }
    }
    fetchTours();
  }, []);

  const handleBookClick = (tour) => {
    setSelectedTour(tour);
    setShowBooking(true);
    setBookingData({ name: '', contact: '', date: '' });
    setBookingStatus('');
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData({ ...bookingData, [name]: value });
    if (name === 'contact') {
      // Simple validation: must be 10 digits
      if (!/^\d{10}$/.test(value)) {
        setPhoneError('Please enter a valid 10-digit phone number.');
      } else {
        setPhoneError('');
      }
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setBookingStatus('You must be logged in to book.');
      return;
    }
    if (!/^\d{10}$/.test(bookingData.contact)) {
      setPhoneError('Please enter a valid 10-digit phone number.');
      return;
    }
    setPhoneError('');
    const bookingObj = {
      userId: user.uid,
      type: 'tour',
      tourId: selectedTour.id,
      tourName: selectedTour.name,
      tourProviderId: selectedTour.providerId || '',
      bookingData,
    };
    try {
      console.log('Attempting to save booking:', bookingObj);
      await saveBooking(bookingObj);
      setBookingStatus('Booking submitted successfully!');
      setTimeout(() => setShowBooking(false), 1500);
    } catch (err) {
      console.error('Booking error:', err);
      setBookingStatus('Failed to submit booking: ' + (err && err.message ? err.message : String(err)));
    }
  };

  if (loading) return <div>Loading tours...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Available Tours</h2>
      {tours.length === 0 ? (
        <div>No tours available at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tours.map(tour => (
            <div key={tour.id} className="border rounded-lg p-4 shadow-md bg-white dark:bg-[#1a1e2e]">
              {tour.image && tour.image !== '' && (
                <img src={tour.image} alt={tour.name} className="w-full h-40 object-cover rounded mb-2" />
              )}
              <h3 className="text-lg font-semibold mb-1">{tour.name}</h3>
              <div className="text-sm mb-1">Description: {tour.description}</div>
              <div className="text-sm mb-1">Location: {tour.location}</div>
              <div className="text-sm mb-1">Type: {tour.type}</div>
              <div className="text-sm mb-1">Duration: {tour.duration} {tour.duration ? 'hours' : ''}</div>
              <div className="text-sm mb-1">Price: ₹{tour.price}</div>
              <div className="text-sm mb-1">Status: <span className={tour.status === 'active' ? 'text-green-600' : 'text-red-600'}>{tour.status}</span></div>
              {tour.inclusions && Array.isArray(tour.inclusions) && tour.inclusions.length > 0 && (
                <div className="text-sm mt-2">
                  <span className="font-semibold">Inclusions:</span>
                  <ul className="list-disc pl-5">
                    {tour.inclusions.map((inc, i) => <li key={i}>{inc}</li>)}
                  </ul>
                </div>
              )}
              <button
                className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:scale-105 hover:from-blue-600 hover:to-purple-700 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => handleBookClick(tour)}
                disabled={tour.status !== 'active'}
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {showBooking && selectedTour && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1a1e2e] p-6 rounded-lg shadow-lg w-full max-w-md relative">
            {/* Title Bar with Close Button */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Book: {selectedTour.name}</h3>
              <button
                type="button"
                className="text-2xl text-gray-400 hover:text-gray-700 dark:hover:text-white focus:outline-none"
                onClick={() => setShowBooking(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Your Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={bookingData.name}
                  onChange={handleBookingChange}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Info</label>
                <input
                  type="text"
                  name="contact"
                  placeholder="Contact Info"
                  value={bookingData.contact}
                  onChange={handleBookingChange}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  required
                />
                {phoneError && <div className="text-red-600 text-sm mt-1">{phoneError}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={bookingData.date}
                  onChange={handleBookingChange}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                  onClick={() => setShowBooking(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Confirm Booking
                </button>
              </div>
              {bookingStatus && <div className="text-green-700 bg-green-100 border border-green-300 rounded p-2 mt-2 text-center font-semibold">{bookingStatus}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourGuidePage; 