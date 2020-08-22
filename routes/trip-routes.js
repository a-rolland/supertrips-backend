const express = require("express");
const router = express.Router();

const {
  postNewTrip,
  getTrips
} = require("../controllers/trip-controller");

router
  .post("/newtrip", postNewTrip)
  .get("/trips", getTrips)

module.exports = router;
