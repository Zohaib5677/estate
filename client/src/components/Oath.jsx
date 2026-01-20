import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAuth, GoogleAuthProvider,signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { signInFailure,signInStart,signInSuccess } from '../redux/user/userSlice';  

export default function OAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    try {
        const provider=new GoogleAuthProvider();
        const auth=getAuth(app);
        const result=await signInWithPopup(auth,provider);
        console.log(result);
        const user = result.user;

        const response = await axios.post(
        'http://localhost:3000/api/auth/google',
        {
          name: user.displayName,
          email: user.email,
          
          photoURL: user.photoURL,
        },
        { withCredentials: true } // agar backend me cookie / session use ho rahi ho
      );
      dispatch(signInSuccess(response.data));
      toast.success('OAuth sign-in successful!');
      navigate('/');
    } catch (error) {
      toast.error('OAuth sign-in failed. Please try again.');
      console.error('Error during OAuth sign-in:', error);
    }
  };

  return (
    <button
      onClick={handleSubmit}
      type='button'
      className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
    >
      Sign in with Google
    </button>
  );
}
