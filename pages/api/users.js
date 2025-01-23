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
  
        const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email); // Basic email validation
        if (!isValidEmail) {
          return res.status(400).json({ message: 'Invalid email format' });
        }
  
        let userExists = false;
        let createdAt = null;
  
        // Check if the user already exists in Firestore
        const userSnapshot = await admin
          .firestore()
          .collection('users')
          .where('email', '==', email)
          .limit(1)
          .get();
  
        // if user doesn't exist
        if (userSnapshot.empty) {
          // If user doesn't exist, create them in Firebase Auth and Firestore
          let userRecord;
  
          try {
            userRecord = await admin.auth().getUserByEmail(email);
          } catch (error) {
            if (error.code === 'auth/user-not-found') {
              userRecord = await admin.auth().createUser({
                email, // Use the email as the identifier
                emailVerified: false, // Email verification is not required
                password: 'temporarypassword', // Create a temporary password for the user to sign into the app
              });
            } else {
              throw error;
            }
          }
  
          // data to add to firestore for user profile
          await admin.firestore().collection('users').doc(userRecord.uid).set({
            email, // add email to user profile
            createdAt: new Date().toISOString(), // add creation date to user profile
          });
        }
        // if user exists
        else {
          userExists = true; //  set userExists to true for frontend
          createdAt = userSnapshot.docs[0].data().createdAt; // Fetch the createdAt date
        }
  
        // Return the response to the client with the user status and createdAt date
        res.status(200).json({
          message: userExists ? 'User found' : 'User created successfully',
          userExists,
          email,
          createdAt, // Send the createdAt date
        });
      } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ message: 'Error processing request.', error: error.message });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
}
