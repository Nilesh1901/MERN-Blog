import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/flat-illustration-blogging-smartphone-screen_81534-1808.jpg?size=626&ext=jpg&ga=GA1.1.1439456856.1711099778&semt=ais",
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    category: {
      type: String,
      default: "uncategorized",
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
