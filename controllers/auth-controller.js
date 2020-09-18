const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/user-model");

const getOneUser = async (req, res, next) => {
  try {
    const foundUser = await User.findById(req.params.userId);
    // console.log(foundUser);
    res.status(200).json(foundUser);
  } catch (error) {
    res.status(400).json(error);
  }
};

const postSignup = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status(400).json({ message: "Please provide username and password" });
    return;
  }

  if (password.length < 7) {
    res.status(400).json({
      message:
        "Please make your password at least 8 characters long for security purposes.",
    });
    return;
  }

  User.findOne({ username }, (err, foundUser) => {
    if (err) {
      res.status(500).json({ message: "Username check went bad." });
      return;
    }

    if (foundUser) {
      res
        .status(400)
        .json({ message: "Username taken. Please choose another one." });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const aNewUser = new User({
      username: username,
      password: hashPass,
    });

    aNewUser.save((err) => {
      if (err) {
        res
          .status(400)
          .json({ message: "Saving user to database went wrong." });
        return;
      }

      // Automatically log in user after sign up
      // .login() here is actually predefined passport method
      req.login(aNewUser, (err) => {
        if (err) {
          res.status(500).json({ message: "Login after signup went bad." });
          return;
        }

        // Send the user's information to the frontend
        // We can use also: res.status(200).json(req.user);
        const { password, ...aNewUserFiltered } = aNewUser._doc;
        res.status(200).json(aNewUserFiltered);
      });
    });
  });
};

const postLogin = (req, res, next) => {
  passport.authenticate("local", (err, theUser, failureDetails) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Something went wrong authenticating user" });
      return;
    }

    if (!theUser) {
      // "failureDetails" contains the error messages
      // from our logic in "LocalStrategy" { message: '...' }.
      res.status(401).json(failureDetails);
      return;
    }

    // save user in session
    req.login(theUser, (err) => {
      if (err) {
        res.status(500).json({ message: "Session save went bad." });
        return;
      }

      // We are now logged in (that's why we can also send req.user)
      const { password, ...theUserFiltered } = theUser._doc;
      // console.log(theUserFiltered);
      res.status(200).json(theUserFiltered);
    });
  })(req, res, next);
};

const postFacebookLogin = async (req, res, next) => {
  // console.log("req.user:", req.user);
  const fbUser = req.user;
  req.login(fbUser, (err) => {
    if (err) {
      res.status(500).json({ message: "Session save went bad." });
      return;
    }
  });
  const { ...theFBUserFiltered } = req.user._doc;
  console.log("FILTERED", theFBUserFiltered);
  res.status(200).json(theFBUserFiltered);
};

const postLogout = (req, res, next) => {
  // req.logout() is defined by passport
  req.logout();
  res.status(200).json({ message: "Log out success!" });
};

const getLoggedIn = (req, res, next) => {
  // req.isAuthenticated() is defined by passport
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({ message: "Unauthorized" });
};

const putEditProfilePicture = async (req, res, next) => {
  let profilePicture = req.body.profilePicture;
  if (req.file) {
    profilePicture = req.file.path;
  }
  if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  try {
    await User.findByIdAndUpdate(req.user._id, {
      profilePicture: profilePicture,
    });
    res.json({ message: `User with ${req.user._id} is updated successfully.` });
  } catch (error) {
    res.json(error);
  }
};

const toggleAddToFavorites = async (req, res, next) => {
  const trip = req.params.id;
  // console.log(trip);

  if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  const thisUser = await User.findById(req.user._id);
  if (thisUser.favorites.indexOf(trip) === -1) {
    try {
      await User.findByIdAndUpdate(
        req.user._id,
        { $push: { favorites: trip } },
        { safe: true, upsert: true, new: true }
      );
      res.json({
        message: `User with ${req.user._id} is updated successfully: trip added to favorites!`,
      });
    } catch (error) {
      res.json(error);
    }
  } else {
    try {
      await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { favorites: trip } },
        { safe: true, upsert: true, new: true }
      );
      res.json({
        message: `User with ${req.user._id} is updated successfully: trip removed from favorites!`,
      });
    } catch (error) {
      res.json(error);
    }
  }
};

module.exports = {
  getOneUser,
  postSignup,
  postLogin,
  postLogout,
  getLoggedIn,
  putEditProfilePicture,
  toggleAddToFavorites,
  postFacebookLogin,
};
