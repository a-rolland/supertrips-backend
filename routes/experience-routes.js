const express = require("express");
const router = express.Router();

const {
  postNewExperience,
  getExperiences,
  getExperienceDetails,
  putEditExperience,
  deleteExperience
} = require("../controllers/experience-controller");

router
  .post("/newexperience", postNewExperience)
  .get("/experiences/:stepId", getExperiences)
  .get("/experienceDetails/:id", getExperienceDetails)
  .put("/experiences/:id", putEditExperience)
  .delete("/experiences/:id", deleteExperience)

module.exports = router;
