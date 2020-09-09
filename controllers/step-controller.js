const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const Trip = require("../models/trip-model");
const Step = require("../models/step-model");
const Experience = require("../models/experience-model");

const postNewStep = async (req, res, next) => {
  const title = req.body.title;
  const trip = req.body.trip;

  if (!title) {
    res.status(400).json({ message: "Please provide a title" });
    return;
  }

  Step.findOne({ title, trip }, async (err, foundStepTitle) => {
    if (err) {
      res.status(500).json({ message: "Title check went bad." });
      return;
    }

    if (foundStepTitle) {
      res.status(400).json({ message: "This trip already has a step with this name. Please choose another one." });
      return;
    }

    try {
      const newStep = await Step.create({
        title: title,
        trip: trip,
      });
      console.log("Step created !", newStep);
      res.status(200).json(response);
    } catch (error) {
      res.json(error);
    }
  });
};

const getSteps = async (req, res, next) => {
  const trip = req.params.id
  try {
    const steps = await Step.find({trip: req.params.id}).populate('trip');
    res.status(200).json(steps);
  } catch (error) {
    res.json(error);
  }
};

const getStepDetails = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  try {
    const step = await Step.findById(req.params.id).populate("trip");
    res.status(200).json(step);
  } catch (error) {
    res.json(error);
  }
};

const putEditStep = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  if (!req.body.title) {
    res.status(400).json({ message: "Please provide a title" });
    return;
  }

  Step.findOne({ "title": req.body.title, "trip": req.body.trip, "_id": { $ne: req.params.id }}, async (err, foundStepTitle) => {
    if (err) {
      res.status(500).json({ message: "Title check went bad." });
      return;
    }

    if (foundStepTitle) {
      res.status(400).json({ message: "This trip already has a step with this name. Please choose another one." });
      return;
    }

    try {
      await Step.findByIdAndUpdate(req.params.id, req.body);
      res.json({
        message: `Step with ${req.params.id} is updated successfully.`,
      });
    } catch (error) {
      res.json(error);
    }
  });

  // try {
  //   await Step.findByIdAndUpdate(req.params.id, req.body);
  //   res.json({
  //     message: `Step with ${req.params.id} is updated successfully.`,
  //   });
  // } catch (error) {
  //   res.json(error);
  // }
};

const deleteStep = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  try {
    await Step.findByIdAndRemove(req.params.id);
    try {
      await Experience.deleteMany({step: req.params.id})
      res.json({ message: `Step with ${req.params.id} is removed successfully.
      Experience(s) from Step ${req.params.id} were removed successfully.` })
    } catch(error) {
      res.json(error)
    }
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  postNewStep,
  getSteps,
  getStepDetails,
  putEditStep,
  deleteStep,
};
