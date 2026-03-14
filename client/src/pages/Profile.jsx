import React, { useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteUserFailure,

  deleteUserStart,
  deleteUserSuccess,
  updateUserAvatar,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';



const Profile = () => {
    const params = useParams();
  const dispatch = useDispatch(); // ✅ add this
  const fileRef = useRef(null);
  const navigate = useNavigate();
  const {currentUser} = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
const [userListings, setUserListings] = useState([]);  // Upload Image to Cloudinary
  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "mern_upload"); // your preset name

    try {
      setUploading(true);

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dmi0lkwwx/image/upload",
        data,
      );
      console.log(res.data);
      const url = res.data.secure_url;
    console.log("Current User:", currentUser);
console.log("User ID:", currentUser?._id);
const res1 = await axios.put(
    `http://localhost:3000/api/users/updateimage/${currentUser._id}`,
    { image: url },
    { withCredentials: true }
  );
        if(!res1)
      {
        console.log("Failed to update user image in backend");
      }
      
      console.log("Cloudinary Image URL:", url);

      setImageUrl(url);
      dispatch(updateUserAvatar(url));

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
      const res = await axios.post(
        `http://localhost:3000/api/users/update/${currentUser._id}`,
        {
          ...formData,
          avatar: imageUrl, // cloudinary image
        },
      );
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
      await axios.delete(
        `http://localhost:3000/api/users/delete/${currentUser._id}`,
      );
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
      navigate("/signin");
      // Optionally, you can also dispatch a logout action here
    } catch (error) {
      console.log(error);
      toast.error("Sign out failed. Please try again.");
    }
  };

  const handleshowlistings = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/listings/getlistings/${currentUser._id}`,
        { withCredentials: true },
      );

      if (res) {
        toast.success("Listings fetched successfully!");
        console.log(res.data);
      }
      setUserListings(res.data);
    } catch (error) {
      toast.error("Failed to fetch listings. Please try again.");
      console.log(error);
    }
  };
  const handleListingDelete = async (listingId) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/listings/deleteListing/${listingId}`,
        { withCredentials: true }
      );
      toast.success("Listing deleted successfully!");
      // Remove the deleted listing from the userlistings state
      setUserListings((prevListings) => prevListings.filter((listing) => listing._id !== listingId));
    } catch (error) {
      toast.error("Failed to delete listing. Please try again.");
      console.log(error);
    }
  };


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

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

        <button
          disabled={updating}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95"
        >
          {updating ? "Updating..." : "Update Profile"}
        </button>
      </form>
      <button
        onClick={() => navigate("/create-listing")}
        className="bg-green-700 text-white rounded-lg p-3 uppercase hover:opacity-95"
      >
        Create Listing (coming soon)
      </button>
      <div className="flex justify-between mt-5">
        <span onClick={deleteAccount} className="text-red-700 cursor-pointer">
          Delete account
        </span>

        <span onClick={signOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <button onClick={handleshowlistings} className="text-green-700 w-full">
        Show Listings
      </button>
       {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}   
    </div>
  );
};

export default Profile;
