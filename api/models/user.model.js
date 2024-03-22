import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://img.freepik.com/free-psd/3d-icon-social-media-app_23-2150049569.jpg?w=740&t=st=1711099821~exp=1711100421~hmac=a7d358760f874487a8e4f77be038b66457c5482a0ff022737b491ee43a73241f",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
