const Post = require("../models/Post");
const Comment = require("../models/Comment");

exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({})
      .populate("author", ["name", "avatarLink"])
      .populate({
        path: "comments",
        populate: { path: "author", select: "name" },
      });
    res.status(200).json({
      status: "success",
      results: posts.length,
      data: posts,
    });
  } catch (error) {
    res.json(error);
  }
};

exports.createOnePost = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const post = await Post.create({ ...req.body, author: userId });
    const postResponse = await Post.findById(post.id)
      .populate("author", ["name", "avatarLink"])
      .populate({
        path: "comments",
        populate: { path: "author", select: "name" },
      });
    res.status(200).json({
      status: "success",
      data: postResponse,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateOnePost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    await Post.findByIdAndUpdate(
      postId,
      { ...req.body },
      { new: true, runValidator: true }
    );

    const postResponse = await Post.findById(postId)
      .populate("author", ["name", "avatarLink"])
      .populate({
        path: "comments",
        populate: { path: "author", select: "name" },
      });
    res.status(200).json({
      status: "success",
      data: postResponse,
    });
  } catch (error) {
    next(error);
  }
};

exports.commentPost = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const comment = await Comment.create({ ...req.body, author: userId });
    const { postId } = req.params;

    await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: comment._id } },
      { new: true, runValidator: true }
    );

    const postResponse = await Post.findById(postId)
      .populate("author", ["name", "avatarLink"])
      .populate({
        path: "comments",
        populate: { path: "author", select: "name" },
      });
    res.status(200).json({
      status: "success",
      data: postResponse,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteOnePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    await Post.findByIdAndDelete(postId);
    res.status(200).json({
      status: "success",
      message: "Post has been deleted",
    });
  } catch (error) {
    next(error);
  }
};

exports.getOnePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId)
      .populate("author", ["name", "avatarLink"])
      .populate({
        path: "comments",
        populate: { path: "author", select: "name" },
      });

    res.status(200).json({
      status: "success",
      data: post,
    });
  } catch (error) {
    res.json(error);
  }
};

exports.searchPostByTitle = async (req, res, next) => {
  const { title } = req.body;
  try {
    const posts = await Post.find({ title: { $regex: title, $options: "i" } })
      .populate("author", ["name", "avatarLink"])
      .populate({
        path: "comments",
        populate: { path: "author", select: "name" },
      });
    res.status(200).json({
      status: "success",
      results: posts.length,
      data: posts,
    });
  } catch (error) {
    res.json(error);
  }
};

exports.filterPost = async (req, res, next) => {
  const { genres } = req.body;
  try {
    const posts = await Post.find({
      //now I use only 1 genre, but future 1 post have many genre ^^
      genres: { $regex: genres.at(0), $options: "i" },
    })
      .populate("author", ["name", "avatarLink"])
      .populate({
        path: "comments",
        populate: { path: "author", select: "name" },
      });
    res.status(200).json({
      status: "success",
      results: posts.length,
      data: posts,
    });
  } catch (error) {
    res.json(error);
  }
};

exports.getPostByAuthorId = async (req, res, next) => {
  const { author } = req.body;
  try {
    const posts = await Post.find({
      author: author._id,
    })
      .populate("author", ["name", "avatarLink"])
      .populate({
        path: "comments",
        populate: { path: "author", select: "name" },
      });
    res.status(200).json({
      status: "success",
      results: posts.length,
      data: posts,
    });
  } catch (error) {
    res.json(error);
  }
};
