const { string } = require("joi");
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const userprofileSchema = new mongoose.Schema(
  {
    userDetailsID: {
        type: ObjectId,
        ref: "user"
      },
    resume: {
        type: String,
        required: true
      },
    gitLink: {
      type: String,
      required: true
    },
    profileLink: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum:["M","F","Not Prefer to Say"]
    },
    doB: {
      type: Date,
      required: true,
    },
    phone: {
      type:String,
      required: true,
    },
    location: {
      type:String,
      required: true
    },
    document:{
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("userProfile", userprofileSchema);

