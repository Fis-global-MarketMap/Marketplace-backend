const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profiles = new Schema(
  {
    linkedin: String,
    github: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    // skills array of strings
    skills: [{
      label: String,
      name: String,
    }],
    timeline: [
      {
        title: String,
        description: String,
        from: Date,
        to: Date,
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Profile", profiles);
