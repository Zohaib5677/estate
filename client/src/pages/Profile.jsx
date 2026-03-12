import React, { useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {toast} from 'react-toastify';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {

  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  
} from '../redux/user/userSlice';
const Profile = () => {
  const dispatch = useDispatch(); // ✅ add this
  const fileRef = useRef(null);
  const navigate = useNavigate();
  const currentUser= useSelector((state) => state.user.currentUser);
  const [formData, setFormData] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Upload Image to Cloudinary
  const uploadImage = async (file) => {

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "mern_upload"); // your preset name
    

    try {

      setUploading(true);

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dmi0lkwwx/image/upload",
        data
      );
      console.log(res.data);
      const url = res.data.secure_url;

      console.log("Cloudinary Image URL:", url);

      setImageUrl(url);

      setUploading(false);

    } catch (error) {
      console.log("Upload Error:", error);
      setUploading(false);
    }
  };
const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.id]: e.target.value,
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();
setUpdating(true); // ✅ start loading
  try {

    const res = await axios.post(`http://localhost:3000/api/users/update/${currentUser._id}`, {
      ...formData,
      avatar: imageUrl,   // cloudinary image
    });
     toast.success("Profile updated successfully!");
    console.log(res.data);
    setUpdating(false); // stop loading

  } catch (error) {
    console.log(error);
      toast.error("Profile update failed. Please try again.");
    setUpdating(false); // stop loading
  }
};
  // When user selects image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImage(file);
    }
  };
  const deleteAccount = async () => {
    dispatch(deleteUserStart());
    try {
      await axios.delete(`http://localhost:3000/api/users/delete/${currentUser._id}`);  
      toast.success("Account deleted successfully!");
      dispatch(deleteUserSuccess());
      // Optionally, you can also dispatch a logout action here
    } catch (error) {
      console.log(error);
      dispatch(deleteUserFailure(error.response.data.message));
      toast.error("Account deletion failed. Please try again.");
    }
  };
  const signOut = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/signout");
      toast.success("Signed out successfully!");
      navigate('/signin');
      // Optionally, you can also dispatch a logout action here
    } catch (error) {
      console.log(error);
      toast.error("Sign out failed. Please try again.");
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">

      <h1 className="text-3xl font-semibold text-center my-7">
        Profile
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />

        {/* Profile Image */}
        <img
          onClick={() => fileRef.current.click()}
          src={imageUrl || currentUser?.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />

        {uploading && (
          <p className="text-center text-sm text-gray-600">
            Uploading Image...
          </p>
        )}

        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
           onChange={handleChange}
          defaultValue={currentUser?.username}
        />

        <input
          type="text"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
           onChange={handleChange}
          defaultValue={currentUser?.email}
        />

        <input
          type="password"
          placeholder="password"
          id="password"
           onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <button disabled={updating}  className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95">
          {updating ? "Updating..." : "Update Profile"}
        </button>

      </form>

      <div className="flex justify-between mt-5">

        <span onClick={deleteAccount} className="text-red-700 cursor-pointer">
          Delete account
        </span>

        <span onClick={signOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>

      </div>

    </div>
  );
};

export default Profile;