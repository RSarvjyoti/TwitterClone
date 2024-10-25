import express from "express";
import authRouter from "./routes/auth.routes.js";
import {config} from 'dotenv';
import { connectDb } from "./config/db.js";

config();
const PORT = process.env.PORT || 9090
const MONGO_URL = process.env.MONGO_URL

const app = express();

app.use("/api/auth", authRouter);

app.listen(PORT, async() => {
  await connectDb(MONGO_URL);
  console.log(`Server is running http://localhost:${PORT}`);
});