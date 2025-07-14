import { db } from '../firebase-config';
import { collection, query, where, getDocs, addDoc, orderBy } from 'firebase/firestore';

export const earningsService = {
  async getEarnings(userId) {
    if (!userId) {
      console.error('getEarnings: userId is null or undefined.');
      throw new Error('User ID is required to fetch earnings.');
    }
    try {
      const q = query(collection(db, 'earnings'), where('userId', '==', userId), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const earnings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(`Fetched ${earnings.length} earnings records for ${userId}.`);
      return earnings;
    } catch (error) {
      console.error('Error fetching earnings:', error);
      throw error;
    }
  },

  async addEarningsRecord(recordData) {
    try {
      const docRef = await addDoc(collection(db, 'earnings'), recordData);
      console.log('Earnings record added with ID:', docRef.id);
      return { id: docRef.id, ...recordData };
    } catch (error) {
      console.error('Error adding earnings record:', error);
      throw error;
    }
  }
}; 