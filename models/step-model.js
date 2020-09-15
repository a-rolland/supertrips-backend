const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stepSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
    },
    trip: {
      type: Schema.Types.ObjectId,
      ref: "Trip",
    },
  },
  {
    timestamps: true,
  }
);

const Step = mongoose.model("Step", stepSchema);
module.exports = Step;
