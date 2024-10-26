import { userModel } from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import {config} from 'dotenv';
config();

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "You need to login first." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized : Invalid token." });
    }

    const user = await userModel.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protect middlewere controller", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};
