import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";

dotenv.config();

mongoose
  .connect(process.env.MONGODBCONNECTION)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.error(err));

const app = express();

app.use(express.json());

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

// middleware to handel error
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Internal server error" } = err;
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  }); 
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
