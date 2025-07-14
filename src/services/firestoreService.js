import { db } from '../firebase-config';
import { getAuth } from 'firebase/auth';
import {
  doc, getDoc, setDoc, collection, addDoc, query, where, getDocs, serverTimestamp, updateDoc, deleteDoc
} from 'firebase/firestore';

// Health Profile
export async function getHealthProfile() {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Not authenticated');
  const ref = doc(db, 'healthProfiles', user.uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : {};
}

export async function saveHealthProfile(profile) {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Not authenticated');
  const ref = doc(db, 'healthProfiles', user.uid);
  await setDoc(ref, profile, { merge: true });
}

// Emergency Alerts
export async function sendEmergencyAlert(alertData) {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Not authenticated');
  await addDoc(collection(db, 'emergencyAlerts'), {
    ...alertData,
    userId: user.uid,
    createdAt: serverTimestamp(),
  });
}

// Journal Entries
export async function addJournalEntry(entry) {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Not authenticated');
  await addDoc(collection(db, 'journals', user.uid, 'entries'), {
    ...entry,
    createdAt: serverTimestamp(),
  });
}

export async function getMyJournals() {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Not authenticated');
  const q = query(collection(db, 'journals', user.uid, 'entries'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function deleteJournalEntry(id) {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Not authenticated');
  const ref = doc(db, 'journals', user.uid, 'entries', id);
  await deleteDoc(ref);
}

// Reminders
export async function addReminder(reminder) {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Not authenticated');
  await addDoc(collection(db, 'reminders'), {
    ...reminder,
    userId: user.uid,
    createdAt: serverTimestamp(),
  });
}

export async function getMyReminders() {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Not authenticated');
  const q = query(collection(db, 'reminders'), where('userId', '==', user.uid));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Family Location Sharing
export async function updateFamilyLocation(location) {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Not authenticated');
  await setDoc(doc(db, 'familyLocations', user.uid), {
    ...location,
    userId: user.uid,
    updatedAt: serverTimestamp(),
  });
}

export async function getFamilyLocation(userId) {
  const ref = doc(db, 'familyLocations', userId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// --- Service Provider Data Management ---

// Add Hotel
export async function addHotel(hotelData) {
  await addDoc(collection(db, 'hotels'), {
    ...hotelData,
    createdAt: serverTimestamp(),
  });
}

// Get All Hotels (from hotel_rooms)
export async function getHotels() {
  const snap = await getDocs(collection(db, 'hotel_rooms'));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Add Car/Transport
export async function addCar(carData) {
  await addDoc(collection(db, 'cars'), {
    ...carData,
    createdAt: serverTimestamp(),
  });
}

// Get All Cars/Transports
export async function getCars() {
  const snap = await getDocs(collection(db, 'cars'));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Add Guide
export async function addGuide(guideData) {
  await addDoc(collection(db, 'guides'), {
    ...guideData,
    createdAt: serverTimestamp(),
  });
}

// Get All Guides
export async function getGuides() {
  const snap = await getDocs(collection(db, 'guides'));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Get All Tour Guides (for customer view)
export async function getTourGuides() {
  const snap = await getDocs(collection(db, 'guides'));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// --- Booking Management ---

// Book a Service (Hotel/Car/Guide)
export async function bookService(bookingData) {
  await addDoc(collection(db, 'bookings'), {
    ...bookingData,
    createdAt: serverTimestamp(),
    status: 'pending',
  });
}

// Get Bookings for a User
export async function getBookingsByUser(userId) {
  const q = query(collection(db, 'bookings'), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Get All Activities
export async function getActivities() {
  const snap = await getDocs(collection(db, 'activities'));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getBuses() {
  const snap = await getDocs(collection(db, 'transport_vehicles'));
  return snap.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(vehicle => vehicle.type === 'Bus');
}

export async function saveBooking(booking) {
  await addDoc(collection(db, 'bookings'), {
    ...booking,
    createdAt: serverTimestamp(),
    status: 'pending',
  });
}

export async function getUserBookings(userId) {
  const q = query(collection(db, 'bookings'), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getProviderHotelBookings(providerId) {
  const q = query(collection(db, 'bookings'), where('hotelProviderId', '==', providerId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getProviderTourBookings(providerId) {
  const q = query(collection(db, 'bookings'), where('tourProviderId', '==', providerId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getProviderHotelIds(providerId) {
  const q = query(collection(db, 'hotel_rooms'), where('providerId', '==', providerId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => doc.id);
}

export async function getProviderTourIds(providerId) {
  const q = query(collection(db, 'guide_tours'), where('providerId', '==', providerId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => doc.id);
}

export async function getBookingsForHotelIds(hotelIds) {
  if (!hotelIds.length) return [];
  const chunks = [];
  for (let i = 0; i < hotelIds.length; i += 10) {
    chunks.push(hotelIds.slice(i, i + 10));
  }
  let bookings = [];
  for (const chunk of chunks) {
    const q = query(collection(db, 'bookings'), where('hotelId', 'in', chunk));
    const snap = await getDocs(q);
    bookings = bookings.concat(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }
  return bookings;
}

export async function getBookingsForTourIds(tourIds) {
  if (!tourIds.length) return [];
  const chunks = [];
  for (let i = 0; i < tourIds.length; i += 10) {
    chunks.push(tourIds.slice(i, i + 10));
  }
  let bookings = [];
  for (const chunk of chunks) {
    const q = query(collection(db, 'bookings'), where('tourId', 'in', chunk));
    const snap = await getDocs(q);
    bookings = bookings.concat(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }
  return bookings;
}

export async function getProviderTransportBookings(providerId) {
  const q = query(collection(db, 'bookings'), where('transportProviderId', '==', providerId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// --- Rewards Management ---

// Get user rewards
export async function getUserRewards(userId) {
  const ref = doc(db, 'rewards', userId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : {
    points: 0,
    tier: 'Bronze',
    nextTier: 'Silver',
    pointsToNextTier: 1000,
    history: [],
    benefits: []
  };
}

// Update user rewards (e.g., after earning/spending points)
export async function updateUserRewards(userId, rewardsData) {
  await setDoc(doc(db, 'rewards', userId), rewardsData, { merge: true });
}

// Add a reward history entry
export async function addRewardHistory(userId, historyEntry) {
  const ref = doc(db, 'rewards', userId);
  const snap = await getDoc(ref);
  let rewards = snap.exists() ? snap.data() : { history: [] };
  const updatedHistory = [historyEntry, ...(rewards.history || [])];
  await setDoc(ref, { history: updatedHistory }, { merge: true });
}

// Utility: Set status to 'active' for all service providers (admin use only)
export async function setAllProvidersActive() {
  const snap = await getDocs(collection(db, 'service_providers'));
  for (const d of snap.docs) {
    const data = d.data();
    if (!data.status) {
      await updateDoc(doc(db, 'service_providers', d.id), { status: 'active' });
    }
  }
} 