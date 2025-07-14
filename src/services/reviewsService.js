import { db } from '../firebase-config';
import { collection, query, where, getDocs, addDoc, orderBy } from 'firebase/firestore';

export const reviewsService = {
  async getReviews(serviceProviderId) {
    if (!serviceProviderId) {
      console.error('getReviews: serviceProviderId is null or undefined.');
      throw new Error('Service Provider ID is required to fetch reviews.');
    }
    try {
      const q = query(collection(db, 'reviews'), where('serviceProviderId', '==', serviceProviderId), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const reviews = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(`Fetched ${reviews.length} review records for ${serviceProviderId}.`);
      return reviews;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  async addReview(reviewData) {
    try {
      const docRef = await addDoc(collection(db, 'reviews'), reviewData);
      console.log('Review record added with ID:', docRef.id);
      return { id: docRef.id, ...reviewData };
    } catch (error) {
      console.error('Error adding review record:', error);
      throw error;
    }
  }
}; 