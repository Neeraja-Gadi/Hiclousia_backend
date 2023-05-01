const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recruiterProfileSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  professionalSummary: {
    type: String
  },
  workExperience: [
    {
      company: {
        type: String,
        // required: true
      },
      jobTitle: {
        type: String,
        // required: true
      },
    }
  ],
  awards: [
      {type :  String}
  ]
  ,
  socialMediaLinks: {
        linkedin : { type: String  ,required: true} ,
        twitter : { type: String},   
    }
  
});

const RecruiterProfile = mongoose.model('Recruiters', recruiterProfileSchema);

module.exports = RecruiterProfile;
