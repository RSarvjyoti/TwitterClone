import { generateTokenAndSetCookie } from "../lib/ustils/generateToken.js";
import { userModel } from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { username, fullName, password, email } = req.body;
    // Regex : for checking email farmat is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // check username is exit or not
    const exitingUser = await userModel.findOne({ username });

    if (exitingUser) {
      return res.status(400).json({ error: "User is already taken" });
    }

    // check email is exit or not
    const exitingEmail = await userModel.findOne({ email });

    if (exitingEmail) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    // hash the password
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      username,
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // genrate token
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
        bio: newUser.bio,
        link: newUser.link,
      });
    } else {
      res.status(400).json({ error: "Invalid user data." });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
      bio: user.bio,
      link: user.link,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {maxAge:0});
    res.status(200).json({message : "Logged out successfully."})
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};


export const getMe = async (req, res) => {
  try{
    const user = await userModel.findById(req.user._id).select("-password");
    res.status(200).json(user);
  }catch(error) {
    console.log("Error in get me controller", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
}
