const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tripSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."]
    },
    author: {
      type: Schema.Types.ObjectId, ref: 'User'
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    startDate: {
      type: String,
      required: [true, "Start date is required."]
    },
    endDate: {
      type: String,
      required: [true, "End date is required."]
    },
    duration: {
      type: Number
    }
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;
