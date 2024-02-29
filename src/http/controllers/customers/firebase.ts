import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDKppQY3GZuSj3eBkFSMQcQi5nl2FBNdGU',
  authDomain: 'imagens-63ad7.firebaseapp.com',
  projectId: 'imagens-63ad7',
  storageBucket: 'imagens-63ad7.appspot.com',
  messagingSenderId: '346371836172',
  appId: '1:346371836172:web:0469f8c69df6b846196129',
  measurementId: 'G-JBY3090JP9'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
// export const analytics = getAnalytics(app);
