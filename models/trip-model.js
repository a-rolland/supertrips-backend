const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tripSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: String,
      required: [true, "Start date is required."],
    },
    endDate: {
      type: String,
      required: [true, "End date is required."],
    },
    duration: {
      type: Number,
    },
    imageUrl: {
      type: String,
      default:
        "https://res.cloudinary.com/nutriapp/image/upload/v1599217458/tripDefault_gkayed.jpg",
    },
    likes: {
      type: [Schema.Types.ObjectId],
    },
    comments: [
      {
        commentAuthor: {
          _id: Schema.Types.ObjectId,
          username: String,
          profilePicture: String,
        },
        comment: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;
