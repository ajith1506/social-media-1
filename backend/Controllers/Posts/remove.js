const Post = require("../../Schema/Post");
const errorHandler = require("../../middleware/error");

const remove = async (req, res) => {
  let post = req.post;
  try {
    let deletedPost = await Post.remove();
    res.json(deletedPost);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

module.exports = remove;
