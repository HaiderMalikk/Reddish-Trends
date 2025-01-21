/* 
gets user email front frontend using clerk then adds it to firebase making a new user if it doesn't exist with its identifier as the email
*/

import admin from '../../utils/firebaseAdmin';

export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        const { email } = req.body;
  
        if (!email) {
          return res.status(400).json({ message: 'Missing email field' });
        }
  
        const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email); // Basic email validation made by chatgpt
        if (!isValidEmail) {
          return res.status(400).json({ message: 'Invalid email format' });
        }
  
        let userExists = false;
  
        // Check if the user already exists in Firestore
        const userSnapshot = await admin
          .firestore()
          .collection('users')
          .where('email', '==', email)
          .limit(1)
          .get();
  
        if (userSnapshot.empty) {
          // If user doesn't exist, create them in Firebase Auth and Firestore
          let userRecord;
  
          try {
            userRecord = await admin.auth().getUserByEmail(email);
          } catch (error) {
            if (error.code === 'auth/user-not-found') {
              userRecord = await admin.auth().createUser({
                email,
                emailVerified: false, // Adjust if needed
                password: 'temporarypassword', // Create a temporary password
              });
            } else {
              throw error;
            }
          }
  
          await admin.firestore().collection('users').doc(userRecord.uid).set({
            email,
            createdAt: new Date().toISOString(),
          });
        } else {
          userExists = true;
        }
  
        res.status(200).json({
          message: userExists ? 'User found' : 'User created successfully',
          userExists,
          email,
        });
      } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ message: 'Error processing request.', error: error.message });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }
  