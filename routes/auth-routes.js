const express = require("express");
const router = express.Router();
const fileUploader = require("../configs/cloudinary");

const {
  postSignup,
  postLogin,
  postLogout,
  getLoggedIn,
  putEditProfilePicture
} = require("../controllers/auth-controller");

router
  .post("/signup", postSignup)
  .post("/login", postLogin)
  .post("/logout", postLogout)
  .get("/loggedIn", getLoggedIn)
  .put("/profile/profilePicture", fileUploader.single("profilePicture"), putEditProfilePicture)

module.exports = router;
