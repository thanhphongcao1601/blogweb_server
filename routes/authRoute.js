const express = require("express");
const { verifyToken } = require("../middlewares/verifyToken");
const {
  login,
  register,
  updateUser,
  changePassword,
  getUserInfo,
} = require("../controllers/authController");
const Router = express.Router();

Router.route("/register").post(register);
Router.route("/login").post(login);
Router.route("/update/:userId").put(verifyToken, updateUser);
Router.route("/changePassword").put(verifyToken, changePassword);
Router.route("/:userId").get(getUserInfo);

module.exports = Router;
