import express from "express";
import authRouter from "./routes/auth.routes.js";
import {config} from 'dotenv';
import { connectDb } from "./config/db.js";
import cookieParser from 'cookie-parser'
import userRouter from "./routes/user.router.js";
import { v2 as cloudinary } from 'cloudinary';
import postRoute from './routes/post.route.js'

config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 9090
const MONGO_URL = process.env.MONGO_URL

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}))
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRoute)

app.listen(PORT, async() => {
  await connectDb(MONGO_URL);
  console.log(`Server is running http://localhost:${PORT}`);
});