const express = require("express");
const passport = require("passport");
const mongoose = require('mongoose');
const Trip = require("../models/trip-model");
const Step = require("../models/step-model");
const Experience = require("../models/experience-model");
const User = require("../models/user-model");

const postNewTrip = async (req, res, next) => {
  const title = req.body.title;
  const author = req.user._id;
  const isPublic = req.body.isPublic;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  // Calculate duration : difference between end and start dates
  const start = new Date(req.body.startDate)
  const end = new Date(req.body.endDate)
  const differenceInTime = end - start
  const duration = differenceInTime / (1000 * 3600 * 24) + 1

  if (!title) {
    res.status(400).json({ message: "Please provide a title" });
    return;
  }
  if (!startDate || !endDate) {
    res.status(400).json({ message: "Please provide both start date and end date" });
    return;
  }

  const newTripObject = {
    title: title,
    author: author,
    isPublic: isPublic,
    startDate: startDate,
    endDate: endDate,
    duration: duration
  }
  if (req.file) {
    newTripObject.imageUrl = req.file.path;
  }

  // One author cannot create two trips with the same name, but two different authors can
  Trip.findOne({ title, author }, async (err, foundTitle) => {
    if (err) {
      res.status(500).json({ message: "Title check went bad." });
      return;
    }

    if (foundTitle) {
      res.status(400).json({ message: "You already created a trip with the same name. Please choose another one." });
      return;
    }

    try {
      const newTrip = await Trip.create(newTripObject);
      console.log("Trip created !", newTrip);
      res.status(200).json(response);
    } catch (error) {
      res.json(error);
    }
  });
};

const getTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find().populate('author');
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
  const start = new Date(req.body.startDate)
  const end = new Date(req.body.endDate)
  const differenceInTime = end - start
  const duration = differenceInTime / (1000 * 3600 * 24)
  const editedTrip = {
    ...req.body,
    duration: duration+1
  }
  if (req.file) {
    editedTrip.imageUrl = req.file.path
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
  if (!req.body.title) {
    res.status(400).json({ message: "Please provide a title" });
    return;
  }
  if (!req.body.startDate || !req.body.endDate) {
    res.status(400).json({ message: "Please provide both start date and end date" });
    return;
  }

  Trip.findOne({ "title": req.body.title, "author": req.user._id, "_id": { $ne: req.params.id }}, async (err, foundTitle) => {
    if (err) {
      res.status(500).json({ message: "Title check went bad." });
      return;
    }

    if (foundTitle) {
      res.status(400).json({ message: "You already created a trip with the same name. Please choose another one." });
      return;
    }

    try {
      await Trip.findByIdAndUpdate(req.params.id, editedTrip)
      res.json({ message: `Trip with ${req.params.id} is updated successfully.` })
    } catch(error) {
      res.json(error)
    }
  });
}

const deleteTrip = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
  try {
    await Trip.findByIdAndRemove(req.params.id)
    try {
      await Step.deleteMany({trip: req.params.id})
      try {
        await Experience.deleteMany({trip: req.params.id})
        res.json({ message: `Trip with ${req.params.id} is removed successfully.
        Experience(s) from Trip ${req.params.id} were removed successfully.
        Step(s) from Trip ${req.params.id} were removed successfully.` })
      } catch(error) {
        res.json(error)
      }
    } catch(error) {
      res.json(error)
    }
  } catch(error) {
    res.json(error)
  }
}

const toggleLikes = async (req, res, next) => {
  const trip = req.params.id
  const userId = req.user._id

  if (!mongoose.Types.ObjectId.isValid(trip)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
  
  const thisTrip = await Trip.findById(trip)
  if (thisTrip.likes.indexOf(userId) === -1) {
    try {
      await Trip.findByIdAndUpdate(
        trip,
        {$push: {'likes': userId}},
        {safe: true, upsert: true, new : true}
      )
      res.json({ message: `Trip with ${trip} is updated successfully: new "Like"!` })
    } catch(error) {
      res.json(error)
    }
  } else {
    try {
      await Trip.findByIdAndUpdate(
        trip,
        {$pull: {'likes': userId}},
        {safe: true, upsert: true, new : true}
      )
      res.json({ message: `Trip with ${trip} is updated successfully: one "Like" less!` })
    } catch(error) {
      res.json(error)
    }
  }
}

module.exports = {
  postNewTrip,
  getTrips,
  getTripDetails,
  putEditTrip,
  deleteTrip,
  toggleLikes
};
