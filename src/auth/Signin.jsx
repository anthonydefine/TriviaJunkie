import React, { useContext } from 'react'
import { useAuth } from './AuthContext';

const Signin = () => {
  const { signIn } = useAuth();

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Error signing in:', error.message);
    }
  };

  return (
    <>
      <button 
        className='bg-blue-400'
        onClick={handleSignIn}
      >
        Sign in with Google
      </button>
    </>
    
  );
}

export default Signin