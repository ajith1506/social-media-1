const Post = require("../../Schema/Post");

const createPost = async (req, res) => {
  const { Text, pic, user } = req.body;

  const NewPost = await Post.create({
    caption: Text,
    photo: pic,
    author: user.id,
    userDetails: { name: user.name, id: user.id },
  });

  try {
    let result = await NewPost.save();
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      err,
    });
  }
};

module.exports = createPost;
