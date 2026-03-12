import axios from "axios";

export const uploadImage = async (file) => {

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "mern_upload");

  try {

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dmi0lkwwx/image/upload",
      data
    );

    return res.data.secure_url;

  } catch (error) {
    console.log("Upload Error:", error);
    throw error;
  }
};