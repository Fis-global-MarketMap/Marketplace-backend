const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const profiles = new Schema(
  {
    linkedin:String,
    github:String,
    // enum type for team
    team: {
      type: String,
      enum: ["Frontend", "Backend", "Fullstack"],
    },

  },
  { timestamps: true, versionKey: false } 
);

module.exports = mongoose.model("Profile", profiles);