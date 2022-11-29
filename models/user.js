const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const users = new Schema(
  {
    name: String,
    lastn: String,
    Datebirth: String,
    email: String,
    password: String,
    phone: String,
    gender: String,
    role: String,
    image: String,
    job : String,
    department: {
      type: String,
      enum: ["R&D","Support", "Cloud", "Infrastructure", "Security", "Marketing", "Sales", "HR", "Finance", "Legal"],
    },
    leaves: [],
    profile: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("User", users);
