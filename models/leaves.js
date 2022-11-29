const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leaves = new Schema(
  {
    from: Date,
    to: Date,
    reason: String,
    status: {
        type: String,
        default: "pending"
    },
    type : Number,
    file: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },

  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Leave", leaves);
