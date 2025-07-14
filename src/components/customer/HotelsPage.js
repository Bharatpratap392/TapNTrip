import React, { useEffect, useState } from 'react';
import { getHotels, saveBooking } from '../../services/firestoreService';
import { useAuth } from '../../contexts/AuthContext';
import HotelCard from './HotelCard';

const HotelsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookingData, setBookingData] = useState({ name: '', contact: '', checkin: '', checkout: '' });
  const [bookingStatus, setBookingStatus] = useState('');
  const [lastClickedHotel, setLastClickedHotel] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getHotels();
        setHotels(data);
      } catch (err) {
        setError('Failed to load hotels.');
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const handleBookClick = (hotel) => {
    setLastClickedHotel(hotel);
    setSelectedHotel(hotel);
    setShowBooking(true);
    setBookingData({ name: '', contact: '', checkin: '', checkout: '' });
    setBookingStatus('');
  };

  const handleBookingChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setBookingStatus('You must be logged in to book.');
      return;
    }
    try {
      await saveBooking({
        userId: user.uid,
        hotelId: selectedHotel.id,
        hotelName: selectedHotel.name,
        hotelLocation: selectedHotel.location || selectedHotel.city || '',
        price: selectedHotel.price,
        bookingData,
        status: 'pending',
      });
      setBookingStatus('Booking submitted successfully!');
      setTimeout(() => setShowBooking(false), 1500);
    } catch (err) {
      setBookingStatus('Failed to submit booking: ' + (err && err.message ? err.message : String(err)));
    }
  };

  if (loading) return <div>Loading hotels...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Available Hotels</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {hotels.length === 0 && <div>No hotels found.</div>}
        {hotels.map(hotel => (
          <HotelCard
            key={hotel.id}
            hotelData={hotel}
            onBookNow={() => {
              setSelectedHotel(hotel);
              setShowBooking(true);
              setBookingData({ name: '', contact: '', checkin: '', checkout: '' });
              setBookingStatus('');
            }}
          />
        ))}
      </div>
      {/* Booking Modal */}
      {showBooking && selectedHotel && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '10px', padding: '2rem', minWidth: '320px', maxWidth: '90vw', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem' }}>Book: {selectedHotel.name}</h3>
            <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={bookingData.name}
                onChange={handleBookingChange}
                style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                required
              />
              <input
                type="text"
                name="contact"
                placeholder="Contact Info"
                value={bookingData.contact}
                onChange={handleBookingChange}
                style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                required
              />
              <input
                type="date"
                name="checkin"
                value={bookingData.checkin}
                onChange={handleBookingChange}
                style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                required
              />
              <input
                type="date"
                name="checkout"
                value={bookingData.checkout}
                onChange={handleBookingChange}
                style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                required
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  type="button"
                  style={{ padding: '0.5rem 1rem', background: '#eee', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  onClick={() => setShowBooking(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.5rem 1rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Confirm Booking
                </button>
              </div>
              {bookingStatus && <div style={{ color: 'green', marginTop: '0.5rem' }}>{bookingStatus}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelsPage; 