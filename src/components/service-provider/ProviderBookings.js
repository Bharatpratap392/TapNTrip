import React, { useEffect, useState } from 'react';
import { getProviderHotelIds, getProviderTourIds, getBookingsForHotelIds, getBookingsForTourIds } from '../../services/firestoreService';
import { useAuth } from '../../contexts/AuthContext';

const ProviderBookings = () => {
  const { user } = useAuth();
  const [hotelBookings, setHotelBookings] = useState([]);
  const [tourBookings, setTourBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (user) {
        // Two-step lookup for hotels
        const hotelIds = await getProviderHotelIds(user.uid);
        const hotels = await getBookingsForHotelIds(hotelIds);
        setHotelBookings(hotels);
        // Two-step lookup for tours
        const tourIds = await getProviderTourIds(user.uid);
        const tours = await getBookingsForTourIds(tourIds);
        setTourBookings(tours);
      }
      setLoading(false);
    };
    fetchBookings();
  }, [user]);

  if (loading) return <div>Loading bookings...</div>;
  if (hotelBookings.length === 0 && tourBookings.length === 0) return <div>No bookings found.</div>;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4">Your Bookings</h2>
      {hotelBookings.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Hotel Bookings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hotelBookings.map(b => (
              <div key={b.id} className="border rounded-lg p-4 shadow bg-white dark:bg-[#1a1e2e]">
                <div className="font-bold">{b.hotelName}</div>
                <div>Guest: {b.bookingData?.name}</div>
                <div>Check-in: {b.bookingData?.checkin}</div>
                <div>Check-out: {b.bookingData?.checkout}</div>
                <div>Status: <span className={b.status === 'cancelled' ? 'text-red-600' : 'text-green-600'}>{b.status}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tourBookings.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Tour Bookings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tourBookings.map(b => (
              <div key={b.id} className="border rounded-lg p-4 shadow bg-white dark:bg-[#1a1e2e]">
                <div className="font-bold">{b.tourName}</div>
                <div>Guest: {b.bookingData?.name}</div>
                <div>Date: {b.bookingData?.date}</div>
                <div>Status: <span className={b.status === 'cancelled' ? 'text-red-600' : 'text-green-600'}>{b.status}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderBookings; 