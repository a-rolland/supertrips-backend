const express = require("express");
const router = express.Router();
const fileUploader = require("../configs/cloudinary");

const {
  postNewTrip,
  getTrips,
  getTripDetails,
  putEditTrip,
  deleteTrip
} = require("../controllers/trip-controller");

router
  .post("/newTrip", fileUploader.single("imageUrl"), postNewTrip)
  .get("/trips", getTrips)
  .get("/trips/:id", getTripDetails)
  .put("/trips/:id", fileUploader.single("imageUrl"), putEditTrip)
  .delete("/trips/:id", deleteTrip)

module.exports = router;
