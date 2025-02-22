// utils/firebaseAdmin.js
// this file is used to initialize the firebase admin app
import admin from "firebase-admin";

let serviceAccount;

try {
  serviceAccount = JSON.parse(process.env.MY_SECRET_FIREBASE_SERVICE_ACCOUNT_KEY);
} catch (error) {
  console.error("Error parsing Firebase service account key:", error);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.MY_SECRET_FIREBASE_DATABASE_URL,
  });
}

export default admin;
