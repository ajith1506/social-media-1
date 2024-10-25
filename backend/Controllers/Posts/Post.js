const Post = require("../../Schema/Post");
const User = require("../../Schema/User");

const createPost = async (req, res) => {
  const { text, pic, user } = req.body;

  const NewPost = new Post({
    caption: text,
    photo: pic,
    author: user.id,
    userDetails: { name: user.name, id: user.id },
  });

  try {
    let result = await NewPost.save();
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: "Error creating post",
      details: err,
    });
  }
};

module.exports = createPost;
