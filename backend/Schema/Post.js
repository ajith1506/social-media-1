// Schema definition
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
    },
    photo: {
      type: String,
    },
    publicID: {
      type: String,
    },
    created: {
      type: Date,
      default: Date.now,
    },
    new: {
      type: Boolean,
      default: false,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User", // Match ref name with the User model
    },
    userDetails: {
      name: {
        type: String,
      },
      image: {
        type: String,
      },
      id: {
        type: mongoose.Types.ObjectId,
      },
    },
    likes: {
      type: [String],
    },
    comments: [
      {
        commentedBy: {
          type: mongoose.Types.ObjectId,
          ref: "User", // Match ref name with the User model
        },
        text: {
          type: String,
          required: true,
        },
        commentedAt: {
          type: Date,
          default: Date.now,
          required: true,
        },
        like: {
          type: [String],
        },
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
