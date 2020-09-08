const express = require("express");
const router = express.Router();
const fileUploader = require("../configs/cloudinary");

const {
  postNewExperience,
  getExperiences,
  getFullTripExperiences,
  getExperienceDetails,
  putEditExperience,
  deleteExperience,
  putNewPicture
} = require("../controllers/experience-controller");

router
  .post("/newExperience", postNewExperience)
  .get("/experiences/:stepId", getExperiences)
  .get("/experiences/trip/:id", getFullTripExperiences)
  .get("/experienceDetails/:id", getExperienceDetails)
  .put("/experiences/:id", putEditExperience)
  .delete("/experiences/:id", deleteExperience)
  .put("/experiences/addPicture/:id", fileUploader.single("imageUrl"), putNewPicture)

module.exports = router;
