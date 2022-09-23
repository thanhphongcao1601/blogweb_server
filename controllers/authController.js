const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    const token = jwt.sign({ userId: user._id }, process.env.APP_SECRET);
    res.status(200).json({
      status: "success",
      data: { token, userName: user.name },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      { ...req.body },
      { new: true, runValidator: true }
    );

    res.status(200).json({
      status: "success",
      data: {
        userName: user.name,
        userId: user._id,
        avatarLink: user.avatarLink,
        email: user.email,
      },
    });
  } catch (error) {
    res.json(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      //email not correct
      const err = new Error("Email is not correct");
      err.statusCode = 400;
      return next(err);
    }

    if (bcrypt.compareSync(req.body.password, user.password)) {
      const token = jwt.sign({ userId: user._id }, process.env.APP_SECRET);
      res.status(200).json({
        status: "success",
        data: {
          token,
          userName: user.name,
          userId: user._id,
          avatarLink: user.avatarLink ?? "",
          email: user.email,
        },
      });
    } else {
      //error: Password is not correct
      const err = new Error("Password is not correct");
      err.statusCode = 400;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      //email not correct
      const err = new Error("Email is not correct");
      err.statusCode = 400;
      return next(err);
    }

    if (bcrypt.compareSync(req.body.password, user.password)) {
      const newPasswordHash = await bcrypt.hash(req.body.newPassword, 10);
      const userUpdate = await User.findByIdAndUpdate(
        user.id,
        { password: newPasswordHash },
        { new: true, runValidator: true }
      );
      res.status(200).json({
        status: "success",
        data: {
          userName: userUpdate.name,
          userId: userUpdate._id,
          avatarLink: userUpdate.avatarLink ?? "",
          email: userUpdate.email,
        },
      });
    } else {
      //error: Password is not correct
      const err = new Error("Password is not correct");
      err.statusCode = 400;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};

exports.getUserInfo = async (req, res, next) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    //email not correct
    const err = new Error("Email is not correct");
    err.statusCode = 400;
    return next(err);
  }

  res.status(200).json({
    status: "success",
    data: {
      userName: user.name,
      userId: user._id,
      avatarLink: user.avatarLink ?? "",
      email: user.email,
    },
  });
};
