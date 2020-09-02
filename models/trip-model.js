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
    },
    imageUrl: { 
      type: String,
      default: "https://c.pxhere.com/images/89/1a/4898ca5cd276d6fafc07f7abd76a-1444769.jpg!d"
    }
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;
