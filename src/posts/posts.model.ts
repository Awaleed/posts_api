import * as mongoose from "mongoose";
import Post from "./post.interface";

const postSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: String,
  author: {
    ref: "User",
    type: mongoose.Schema.Types.ObjectId,
  },
});

const postModel = mongoose.model<Post & mongoose.Document>("Post", postSchema);

export default postModel;
