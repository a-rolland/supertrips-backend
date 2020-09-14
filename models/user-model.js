const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      // required: [true, "Username is required."]
    },
    password: {
      type: String,
      // required: [true, "Password is required."]
    },
    profilePicture: {
      type: String,
      default: "https://res.cloudinary.com/nutriapp/image/upload/v1599217287/profileDefault_jr9j16.png"
    },
    favorites: {
      type: [Schema.Types.ObjectId],
      ref: 'Trip'
    },
    facebook: {
      id: String,
      email: String,
      name: {
        firstName: String,
        lastName: String
      }
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
