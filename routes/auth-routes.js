const express = require("express");
const router = express.Router();

const {
  postSignup,
  postLogin,
  postLogout,
  getLoggedIn,
} = require("../controllers/auth-controller");

router
  .post("/signup", postSignup)
  .post("/login", postLogin)
  .post("/logout", postLogout)
  .get("/loggedIn", getLoggedIn);

module.exports = router;
