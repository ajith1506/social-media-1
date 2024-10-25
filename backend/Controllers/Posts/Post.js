const Post = require("../../Schema/Post");

const createPost = async (req, res) => {
  console.log("Request body:", req.body);
  const { Text, pic, user } = req.body;

  const NewPost = new Post({
    caption: Text,
    photo: pic,
    author: user.id,
    userDetails: { name: user.name, id: user.id },
  });

  try {
    let result = await NewPost.save();
    console.log("Post saved:", result);
    res.json(result);
  } catch (err) {
    console.error("Error saving post:", err);
    return res.status(400).json({ err });
  }
};

module.exports = createPost;
