import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.MONGODBCONNECTION)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.error(err));

const app = express();

app.use(express.json());

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
