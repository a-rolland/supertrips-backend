const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const experienceSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."]
    },
    step: {
      type: Schema.Types.ObjectId, ref: 'Step'
    },
    description: {
      type: String
    },
    place: {
      address: {
        type: String
      },
      lat: {
        type: Number
      },
      lng: {
        type: Number
      }
    },
    date: {
      type: String,
      required: [true, "Date is required."]
    },
    time: {
      type: String,
      required: [true, "Time is required"]
    },
    showDate: {
      type: Boolean,
      default: false
    },
    showTime: {
      type: Boolean,
      default: false
    }
    // Pictures Optional
  },
  {
    timestamps: true,
  }
);

const Experience = mongoose.model("Experience", experienceSchema);
module.exports = Experience;
