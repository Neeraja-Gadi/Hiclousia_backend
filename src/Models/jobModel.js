
const mongoose = require ("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const jobSchema = new mongoose.Schema(
  {
    userDetailsID:{
      type: ObjectId,
      ref: "Recruiters"
    },
    jobRole: {
      type: String,
      required: true,
    },
    experience:{
      type: String,
      required: true,
    },
    primarySkills: {
      type: [String],
      required: true,
    },
    secondarySkills: {
      type: [String],
      required: true,
    },
    jobDiscription: {
      type: String,
      required: true
    },
    salary: {
      type: String,
      required: true
    },
    education: [
      {
      authority: {
        type: String,
        required: true,
      },
      educationLevel: {
        type: String,
        required: true,
      },
      discipline: {
        type: String,
        required: true
      }
    }
    ],
    company: {
      type: String,
       required: true,
    },
    location: {
      type: String,
      required: true,
    },
    sector: {
      type: String,
       required: true,
    }
    
  },
  { timestamps: true }
);
module.exports = mongoose.model("Job", jobSchema);