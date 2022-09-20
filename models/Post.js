const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    imgLink: {
      type: String,
    },
    title: {
      type: String,
    },
    content: {
      type: String,
      required: [true, "Post must have content"],
    },
    genres: [
      {
        type: String,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
