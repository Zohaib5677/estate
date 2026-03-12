import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving user",
    });
  }
}
  


export const signin = async (req, res) => {
  // Signin logic to be implemented
  const { email, password } = req.body;
  try
   {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    //check hashed password
    const isMatch= await bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'});
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return res.status(200).json({message:"User logged in successfully", success:true});   

  } catch (error) {
    res.status(500).json({ success: false, message: "Error during signin" });
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10); // ✅ FIXED
      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photoURL, // make sure frontend sends photoURL
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
export const signout=async(req,res)=>{
  try {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: "User signed out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error during signout" });
  }
};