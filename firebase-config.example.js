/**
 * Copy this file to firebase-config.js and fill in values from
 * Firebase Console → Project settings → Your apps → SDK setup and configuration.
 *
 * Firestore rules (start strict later): allow read, create on collection platform_comments
 * with fields componentKey, author, text, createdAt.
 */
window.__FIREBASE_CONFIG__ = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123:web:abc',
};
