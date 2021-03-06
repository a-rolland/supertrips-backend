const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const Trip = require("../models/trip-model");
const Step = require("../models/step-model");
const Experience = require("../models/experience-model");

const postNewExperience = async (req, res, next) => {
  const title = req.body.title;
  const step = req.body.step;
  const trip = req.body.trip;
  const date = req.body.date;
  const time = req.body.time;
  const showDate = req.body.showDate;
  const showTime = req.body.showTime;

  if (!title) {
    res.status(400).json({ message: "Please provide a title" });
    return;
  }
  if (!date || !time) {
    res.status(400).json({
      message:
        "Please provide a date and a time, so we can show your experiences in the correct order",
    });
    return;
  }

  const newExperienceObject = {
    title: title,
    step: step,
    trip: trip,
    date: date,
    time: time,
    showDate: showDate,
    showTime: showTime,
  };
  if (req.body.description) {
    newExperienceObject.description = req.body.description;
  }
  if (req.body.place) {
    newExperienceObject.place = req.body.place;
  }

  Experience.findOne({ title, step }, async (err, foundExperienceTitle) => {
    if (err) {
      res.status(500).json({ message: "Title check went bad." });
      return;
    }

    if (foundExperienceTitle) {
      res
        .status(400)
        .json({
          message:
            "This step already has an experience with this name. Please choose another one.",
        });
      return;
    }

    try {
      const newExperience = await Experience.create(newExperienceObject);
      console.log("Experience created !", newExperience);
      res.status(200).json(response);
    } catch (error) {
      res.json(error);
    }
  });
};

const getExperiences = async (req, res, next) => {
  const step = req.params.stepId;
  try {
    const experiences = await Experience.find({ step: req.params.stepId })
      .populate("step")
      .populate("trip")
      .sort({ date: "asc" })
      .sort({ time: "asc" });
    res.status(200).json(experiences);
  } catch (error) {
    res.json(error);
  }
};

const getFullTripExperiences = async (req, res, next) => {
  const trip = req.params.id;
  try {
    const allExperiences = await Experience.find({ trip: trip })
      .populate("step")
      .populate("trip");
    res.status(200).json(allExperiences);
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
    const experience = await Experience.findById(req.params.id)
      .populate("step")
      .populate("trip");
    res.status(200).json(experience);
  } catch (error) {
    res.json(error);
  }
};

const putEditExperience = async (req, res, next) => {
  const editedExperience = req.body;
  if (req.body.place) {
    editedExperience.place = req.body.place;
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  if (!req.body.title) {
    res.status(400).json({ message: "Please provide a title" });
    return;
  }
  if (!req.body.date || !req.body.time) {
    res.status(400).json({
      message:
        "Please provide a date and a time, so we can show your experiences in the correct order",
    });
    return;
  }

  Experience.findOne(
    { title: req.body.title, step: req.body.step, _id: { $ne: req.params.id } },
    async (err, foundExperienceTitle) => {
      if (err) {
        res.status(500).json({ message: "Title check went bad." });
        return;
      }

      if (foundExperienceTitle) {
        res
          .status(400)
          .json({
            message:
              "This step already has an experience with this name. Please choose another one.",
          });
        return;
      }

      try {
        await Experience.findByIdAndUpdate(req.params.id, editedExperience);
        res.json({
          message: `Experience with ${req.params.id} is updated successfully.`,
        });
      } catch (error) {
        res.json(error);
      }
    }
  );
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

const putNewPicture = async (req, res, next) => {
  if (!req.file) {
    res.status(400).json({ message: "Please provide a file." });
    return;
  }
  const newPicture = req.file.path;
  try {
    await Experience.findByIdAndUpdate(
      req.params.id,
      { $push: { pictures: { url: newPicture } } },
      { safe: true, upsert: true, new: true }
    );
    res.json({
      message: `Experience with ${req.params.id} is updated successfully. A new picture has been added.`,
    });
  } catch (error) {
    res.json(error);
  }
};

const deleteExperiencePicture = async (req, res, next) => {
  const experience = req.params.id;
  const experiencePictureId = req.params.imageId;
  console.log(experience);
  console.log(experiencePictureId);

  if (!mongoose.Types.ObjectId.isValid(experience)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  try {
    await Experience.findByIdAndUpdate(
      experience,
      { $pull: { pictures: { _id: experiencePictureId } } },
      { safe: true, upsert: true, new: true }
    );
    res.json({
      message: `User with ${req.user._id} is updated successfully: trip removed from favorites!`,
    });
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  postNewExperience,
  getExperiences,
  getFullTripExperiences,
  getExperienceDetails,
  putEditExperience,
  deleteExperience,
  putNewPicture,
  deleteExperiencePicture,
};
