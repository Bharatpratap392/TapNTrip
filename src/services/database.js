import { db } from '../firebase-config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where
} from 'firebase/firestore';

// Hotel Services
export const hotelServicesDB = {
  // Rooms
  getRooms: async () => {
    const roomsRef = collection(db, 'hotel_rooms');
    const snapshot = await getDocs(roomsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  addRoom: async (roomData) => {
    const roomsRef = collection(db, 'hotel_rooms');
    const docRef = await addDoc(roomsRef, roomData);
    const docSnap = await getDoc(docRef);
    return { id: docRef.id, ...docSnap.data() };
  },

  updateRoom: async (id, roomData) => {
    const roomRef = doc(db, 'hotel_rooms', id);
    await updateDoc(roomRef, roomData);
    const docSnap = await getDoc(roomRef);
    return { id, ...docSnap.data() };
  },

  deleteRoom: async (id) => {
    const roomRef = doc(db, 'hotel_rooms', id);
    await deleteDoc(roomRef);
  },

  updateRoomStatus: async (id, status) => {
    const roomRef = doc(db, 'hotel_rooms', id);
    await updateDoc(roomRef, { status });
  },

  // Facilities
  getFacilities: async () => {
    const facilitiesRef = collection(db, 'hotel_facilities');
    const snapshot = await getDocs(facilitiesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  addFacility: async (facilityData) => {
    const facilitiesRef = collection(db, 'hotel_facilities');
    const docRef = await addDoc(facilitiesRef, facilityData);
    const docSnap = await getDoc(docRef);
    return { id: docRef.id, ...docSnap.data() };
  },

  updateFacility: async (id, facilityData) => {
    const facilityRef = doc(db, 'hotel_facilities', id);
    await updateDoc(facilityRef, facilityData);
    const docSnap = await getDoc(facilityRef);
    return { id, ...docSnap.data() };
  },

  deleteFacility: async (id) => {
    const facilityRef = doc(db, 'hotel_facilities', id);
    await deleteDoc(facilityRef);
  },

  updateFacilityStatus: async (id, status) => {
    const facilityRef = doc(db, 'hotel_facilities', id);
    await updateDoc(facilityRef, { status });
  },

  // Packages
  getPackages: async (providerId) => {
    const packagesRef = collection(db, 'hotel_packages');
    const q = providerId ? query(packagesRef, where('providerId', '==', providerId)) : packagesRef;
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  addPackage: async (packageData) => {
    const packagesRef = collection(db, 'hotel_packages');
    const docRef = await addDoc(packagesRef, packageData);
    const docSnap = await getDoc(docRef);
    return { id: docRef.id, ...docSnap.data() };
  },

  updatePackage: async (id, packageData) => {
    const packageRef = doc(db, 'hotel_packages', id);
    await updateDoc(packageRef, packageData);
    const docSnap = await getDoc(packageRef);
    return { id, ...docSnap.data() };
  },

  deletePackage: async (id) => {
    const packageRef = doc(db, 'hotel_packages', id);
    await deleteDoc(packageRef);
  },

  updatePackageStatus: async (id, status) => {
    const packageRef = doc(db, 'hotel_packages', id);
    await updateDoc(packageRef, { status });
  }
};

// Transport Services
export const transportServicesDB = {
  // Vehicles
  getVehicles: async (providerId) => {
    const vehiclesRef = collection(db, 'transport_vehicles');
    const q = providerId ? query(vehiclesRef, where('providerId', '==', providerId)) : vehiclesRef;
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  addVehicle: async (vehicleData) => {
    const vehiclesRef = collection(db, 'transport_vehicles');
    const docRef = await addDoc(vehiclesRef, vehicleData);
    const docSnap = await getDoc(docRef);
    return { id: docRef.id, ...docSnap.data() };
  },

  updateVehicle: async (id, vehicleData) => {
    const vehicleRef = doc(db, 'transport_vehicles', id);
    await updateDoc(vehicleRef, vehicleData);
    const docSnap = await getDoc(vehicleRef);
    return { id, ...docSnap.data() };
  },

  deleteVehicle: async (id) => {
    const vehicleRef = doc(db, 'transport_vehicles', id);
    await deleteDoc(vehicleRef);
  },

  updateVehicleStatus: async (id, status) => {
    const vehicleRef = doc(db, 'transport_vehicles', id);
    await updateDoc(vehicleRef, { status });
  },

  // Routes
  getRoutes: async (providerId) => {
    const routesRef = collection(db, 'transport_routes');
    const q = providerId ? query(routesRef, where('providerId', '==', providerId)) : routesRef;
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  addRoute: async (routeData) => {
    const routesRef = collection(db, 'transport_routes');
    const docRef = await addDoc(routesRef, routeData);
    const docSnap = await getDoc(docRef);
    return { id: docRef.id, ...docSnap.data() };
  },

  updateRoute: async (id, routeData) => {
    const routeRef = doc(db, 'transport_routes', id);
    await updateDoc(routeRef, routeData);
    const docSnap = await getDoc(routeRef);
    return { id, ...docSnap.data() };
  },

  deleteRoute: async (id) => {
    const routeRef = doc(db, 'transport_routes', id);
    await deleteDoc(routeRef);
  },

  updateRouteStatus: async (id, status) => {
    const routeRef = doc(db, 'transport_routes', id);
    await updateDoc(routeRef, { status });
  }
};

// Guide Services
export const guideServicesDB = {
  getTours: async () => {
    const toursRef = collection(db, 'guide_tours');
    const snapshot = await getDocs(toursRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  addTour: async (tourData) => {
    const toursRef = collection(db, 'guide_tours');
    const docRef = await addDoc(toursRef, tourData);
    const docSnap = await getDoc(docRef);
    return { id: docRef.id, ...docSnap.data() };
  },

  updateTour: async (id, tourData) => {
    const tourRef = doc(db, 'guide_tours', id);
    await updateDoc(tourRef, tourData);
    const docSnap = await getDoc(tourRef);
    return { id, ...docSnap.data() };
  },

  deleteTour: async (id) => {
    const tourRef = doc(db, 'guide_tours', id);
    await deleteDoc(tourRef);
  },

  updateTourStatus: async (id, status) => {
    const tourRef = doc(db, 'guide_tours', id);
    await updateDoc(tourRef, { status });
  }
}; 