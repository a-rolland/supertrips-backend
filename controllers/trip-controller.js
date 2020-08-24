const express = require("express");
const passport = require("passport");
const mongoose = require('mongoose');
const Trip = require("../models/trip-model");

const postNewTrip = async (req, res, next) => {
  const title = req.body.title;
  const author = req.user._id;
  const isPublic = req.body.isPublic;

  if (!title) {
    res.status(400).json({ message: "Provide a title" });
    return;
  }

  Trip.findOne({ title }, async (err, foundTitle) => {
    if (err) {
      res.status(500).json({ message: "Title check went bad." });
      return;
    }

    if (foundTitle) {
      res.status(400).json({ message: "Title taken. Choose another one." });
      return;
    }

    try {
      const newTrip = await Trip.create({
        title: title,
        author: author,
        isPublic: isPublic,
      });
      console.log("Trip created !", newTrip);
      res.status(200).json(response);
    } catch (error) {
      res.json(error);
    }
  });
};

const getTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find();
    res.status(200).json(trips);
  } catch (error) {
    res.json(error);
  }
};

const getTripDetails = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  try {
    const trip = await Trip.findById(req.params.id).populate("author");
    res.status(200).json(trip);
  } catch (error) {
    res.json(error);
  }
};

const putEditTrip = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
  try {
    await Trip.findByIdAndUpdate(req.params.id, req.body)
    res.json({ message: `Trip with ${req.params.id} is updated successfully.` })
  } catch(error) {
    res.json(error)
  }
}

const deleteTrip = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
  try {
    await Trip.findByIdAndRemove(req.params.id)
    res.json({ message: `Trip with ${req.params.id} is removed successfully.` })
  } catch(error) {
    res.json(error)
  }
}

module.exports = {
  postNewTrip,
  getTrips,
  getTripDetails,
  putEditTrip,
  deleteTrip
};
