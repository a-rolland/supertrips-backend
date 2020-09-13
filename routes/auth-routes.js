const express = require("express");
const router = express.Router();
const fileUploader = require("../configs/cloudinary");
const passport = require("passport")

const {
  getOneUser,
  postSignup,
  postLogin,
  postLogout,
  getLoggedIn,
  putEditProfilePicture,
  toggleAddToFavorites,
  postFacebookLogin
} = require("../controllers/auth-controller");

router
  .get("/getUser/:userId", getOneUser)
  .post("/signup", postSignup)
  .post("/login", postLogin)
  .post("/logout", postLogout)
  .get("/loggedIn", getLoggedIn)
  .put("/profile/profilePicture", fileUploader.single("profilePicture"), putEditProfilePicture)
  .put("/toggleAddToFavorites/:id", toggleAddToFavorites)
  .post("/auth/facebook", passport.authenticate('facebookToken', { session: false }), postFacebookLogin)

module.exports = router;
