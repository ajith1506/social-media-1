const Post = require("../../Schema/Post");

const remove = async (req, res) => {
  let post = req.post;
  try {
    let deletedPost = await Post.deleteOne(post);
    res.json(deletedPost);
  } catch (err) {
    return res.status(400).json({
      message: "hi not deleting this",
    });
  }
};

module.exports = remove;
