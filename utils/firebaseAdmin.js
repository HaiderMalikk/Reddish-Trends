// utils/firebaseAdmin.js
// this file is used to initialize the firebase admin app
import admin from 'firebase-admin';

try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    console.log(serviceAccount);
  } catch (error) {
    console.error('Error parsing Firebase service account key:', error);
  }

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

export default admin;