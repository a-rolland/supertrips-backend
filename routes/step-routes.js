const express = require("express");
const router = express.Router();

const {
  postNewStep,
  getSteps,
  getStepDetails,
  putEditStep,
  deleteStep,
} = require("../controllers/step-controller");

router
  .post("/newStep", postNewStep)
  .get("/steps/:id", getSteps)
  .get("/stepDetails/:id", getStepDetails)
  .put("/steps/:id", putEditStep)
  .delete("/steps/:id", deleteStep);

module.exports = router;
