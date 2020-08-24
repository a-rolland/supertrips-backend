const express = require("express");
const router = express.Router();

const {
  postNewTrip,
  getTrips,
  getTripDetails,
  putEditTrip,
  deleteTrip
} = require("../controllers/trip-controller");

router
  .post("/newtrip", postNewTrip)
  .get("/trips", getTrips)
  .get("/trips/:id", getTripDetails)
  .put("/trips/:id", putEditTrip)
  .delete("/trips/:id", deleteTrip)

module.exports = router;
