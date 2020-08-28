const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const Trip = require("../models/trip-model");
const Step = require("../models/step-model");
const Experience = require("../models/experience-model");

const postNewExperience = async (req, res, next) => {
  const title = req.body.title;
  const step = req.body.step;

  if (!title) {
    res.status(400).json({ message: "Provide a title" });
    return;
  }

  // FOR LATER : Check if same author and same title already exists
  // Trip.findOne({ title }, async (err, foundTitle) => {
  //   if (err) {
  //     res.status(500).json({ message: "Title check went bad." });
  //     return;
  //   }

  //   if (foundTitle) {
  //     res.status(400).json({ message: "Title taken. Choose another one." });
  //     return;
  //   }

  //   try {
  //   const newStep = await Step.create({
  //     title: title,
  //     trip: trip
  //   });
  //   console.log("Step created !", newStep);
  //   res.status(200).json(response);
  //   } catch (error) {
  //    res.json(error);
  //   }
  // });
  try {
    const newExperience = await Experience.create({
      title: title,
      step: step,
    });
    console.log("Experience created !", newExperience);
    res.status(200).json(response);
  } catch (error) {
    res.json(error);
  }
};

const getExperiences = async (req, res, next) => {
  const step = req.params.stepId
  try {
    const experiences = await Experience.find({step: req.params.stepId});
    res.status(200).json(experiences);
  } catch (error) {
    res.json(error);
  }
};

const getExperienceDetails = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  try {
    const experience = await Experience.findById(req.params.id).populate("step");
    res.status(200).json(experience);
  } catch (error) {
    res.json(error);
  }
};

const putEditExperience = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  try {
    await Experience.findByIdAndUpdate(req.params.id, req.body);
    res.json({
      message: `Experience with ${req.params.id} is updated successfully.`,
    });
  } catch (error) {
    res.json(error);
  }
};

const deleteExperience = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  try {
    await Experience.findByIdAndRemove(req.params.id);
    res.json({
      message: `Experience with ${req.params.id} is removed successfully.`,
    });
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  postNewExperience,
  getExperiences,
  getExperienceDetails,
  putEditExperience,
  deleteExperience,
};
