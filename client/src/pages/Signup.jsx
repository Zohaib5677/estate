import { Link } from 'react-router-dom';
import {useState} from 'react'
import axios from 'axios';
import {toast} from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Oath from '../components/Oath';
export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async(e) => {
    e.preventDefault();
    //submit form data to backend
    axios.defaults.withCredentials=true;
    try {
      const response = await axios.post("http://localhost:3000/api/auth/signup", formData);
      toast.success("Signup successful!");
      navigate('/signin');
      console.log(response.data);
    } catch (error) {
      toast.error("Signup failed. Please try again.");
      console.error("Error during signup:", error);
    }

  }
  console.log(formData);

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>

      <form className='flex flex-col gap-4'>
        <input
          type='text'
          onChange={handleChange}
          name='username'
          placeholder='username'
          className='border p-3 rounded-lg'
        />

        <input
          type='email'
          onChange={handleChange}
          name='email'
          placeholder='email'
          className='border p-3 rounded-lg'
        />

        <input
          type='password'
          onChange={handleChange}
          name='password'
          placeholder='password'
          className='border p-3 rounded-lg'
        />

        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95' onClick={handleSubmit}>
          Sign Up
        </button>
        <Oath />
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to='/signin'>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
    </div>
  );
}
