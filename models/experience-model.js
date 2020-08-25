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
    }
    // Description
    // Fecha
    // Lat Long Optional
    // Pictures Optional
  },
  {
    timestamps: true,
  }
);

const Experience = mongoose.model("Experience", experienceSchema);
module.exports = Step;
