import { Link,useNavigate } from 'react-router-dom';
import {useState} from 'react'
import axios from 'axios';
import {toast} from 'react-toastify';
import {useDispatch,useSelector} from 'react-redux';
import { signInFailure,signInStart,signInSuccess } from '../redux/user/userSlice';
import Oath from '../components/Oath';

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const handleChange= (e)=>{
    setFormData({...formData, [e.target.name]: e.target.value});  
  }
  const handleSubmit= async(e)=>{
    e.preventDefault(); 
    //submit form data to backend
    axios.defaults.withCredentials=true;
    try {
      dispatch(signInStart());
      const response = await axios.post("http://localhost:3000/api/auth/signin", formData);
      toast.success("Signin successful!");
      dispatch(signInSuccess(response.data));
      navigate('/profile');
      console.log(response.data);
    } catch (error) {
      dispatch(signInFailure(error.response.data.message));
      toast.error("Signin failed. Please try again.");
      console.error("Error during signin:", error);
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>

      <form className='flex flex-col gap-4'>
        <input
          type='email'
          onChange={handleChange}
          name='email'  
          placeholder='email'
          className='border p-3 rounded-lg'
        />
        <input
          onChange={handleChange}
          name='password'
          type='password'
          placeholder='password'
          className='border p-3 rounded-lg'
        />

        <button onClick={handleSubmit} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
          Sign In
        </button>
        <Oath />
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Don't have an account?</p>
        <Link to='/sign-up'>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
    </div>
  );
}
