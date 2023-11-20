import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import auth, { db } from '../lib/firebase';
import { doc, setDoc, getFirestore, collection, getDoc } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// Create the context
const AuthContext = createContext();
// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);


  const signIn = async () => {
    try {
      // Sign in with Google using Firebase Authentication
      const result = await signInWithPopup(auth, provider);
      // Get the user information
      const userData = {
        uid: result.user.uid,
        displayName: result.user.displayName,
        email: result.user.email,
      };
      // Set the user in the state
      setUser(userData);
      // Check if the user document exists in Firestore
      const userRef = doc(db, 'users', userData.uid);
      const userDoc = await getDoc(userRef);
      // If the user document doesn't exist, create it
      if (!userDoc.exists()) {
        await setDoc(userRef, userData);
      }
      // Navigate to the home page
      navigate('/');
    } catch (error) {
      console.error('Error signing in:', error.message);
    }
  };

  const signOut = async () => {
    try {
      // Sign out using Firebase Authentication
      await auth.signOut();
      // Set the user to null
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };
  return (
    <AuthContext.Provider value={{ user, signIn, signOut, currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
