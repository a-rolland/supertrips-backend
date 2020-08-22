const express = require("express");
const passport = require("passport");
// const bcrypt = require("bcryptjs");
const Trip = require("../models/trip-model");

const postNewTrip = (req, res, next) => {
  const title = req.body.title;

  if (!title) {
    res.status(400).json({ message: "Provide a title" });
    return;
  }

  Trip.findOne({ title }, (err, foundTitle) => {
    if (err) {
      res.status(500).json({ message: "Title check went bad." });
      return;
    }

    if (foundTitle) {
      res.status(400).json({ message: "Title taken. Choose another one." });
      return;
    }

    Trip.create({title: title})
    .then(response => {
      console.log("Trip created !", response)
      res.status(200).json(response)
    })
    .catch(err => console.log("Error: ", err))
  });
};

const getTrips = (req, res, next) => {
  Trip.find()
    .then(response => {
      res.status(200).json(response)
    })
}

module.exports = {
  postNewTrip,
  getTrips
};
