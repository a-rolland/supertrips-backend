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
    }
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;