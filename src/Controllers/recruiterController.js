
const recruiterModel = require("../Models/recruiterModel");
const userprofileModel = require("../Models/userprofileModel");
const userModel = require("../Models/userModel");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const jobModel = require("../Models/jobModel");
const educationModel = require("../Models/InfoModels/educationModel");
const experienceModel = require("../Models/InfoModels/experienceModel");
const { EducationLevelPoints, AuthorityPoints, ExperienceLevelPoints } = require("../Constrains/authority.js");
const Joi = require('joi');
const skillsModel = require("../Models/InfoModels/skillsModel");
const projectsModel = require("../Models/InfoModels/projectsModel");


const recruiterInfo = async function (req, res) {
  try {
    const recruiterSchema = Joi.object({
      fullName: Joi.string().required(),
      email: Joi.string().required(),
      phoneNumber: Joi.string().required(),
      professionalSummary: Joi.string(),
      workExperience: Joi.array().items(
        Joi.object({
          company: Joi.string().required(),
          jobTitle: Joi.string().required()
        })
      ).required(),
      awards: Joi.array().items(Joi.string()),
      socialMediaLinks: Joi.object({
        linkedin: Joi.string(),
        twitter: Joi.string()
      })
    });
    const validationResult = recruiterSchema.validate(req.body, { abortEarly: false });
    if (validationResult.error) {
      return res.status(400).send({ status: false, message: validationResult.error.details[0].message });
    }

    // Create new recruiter data
    const data = await recruiterModel.create(req.body);
    if (data)
      return res.status(200).send({ status: true, data: data, message: 'Recruiter data created' });

  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

const updateRecruiterData = async function (req, res) {
  try {
    const recruiterSchema = Joi.object({
      fullName: Joi.string(),
      email: Joi.string(),
      phoneNumber: Joi.string(),
      professionalSummary: Joi.string(),
      workExperience: Joi.array().items(
        Joi.object({
          company: Joi.string().required(),
          jobTitle: Joi.string().required()
        })
      ),
      awards: Joi.array().items(Joi.string()),
      socialMediaLinks: Joi.object({
        linkedin: Joi.string(),
        twitter: Joi.string()
      })
    });

    const validationResult = recruiterSchema.validate(req.body, { abortEarly: false });
    if (validationResult.error) {
      return res.status(400).send({ status: false, message: validationResult.error.details[0].message });
    }

    const id = req.params.id;
    let recruiterData = await recruiterModel.findById({ _id: id });
    if (!recruiterData) {
      return res.status(404).send({ status: false, message: 'Recruiter data not found' });
    }

    recruiterData.fullName = req.body.fullName || recruiterData.fullName;
    recruiterData.email = req.body.email || recruiterData.email;
    recruiterData.phoneNumber = req.body.phoneNumber || recruiterData.phoneNumber;
    recruiterData.professionalSummary = req.body.professionalSummary || recruiterData.professionalSummary;
    recruiterData.workExperience = req.body.workExperience || recruiterData.workExperience;
    recruiterData.awards = req.body.awards || recruiterData.awards;
    recruiterData.socialMediaLinks = req.body.socialMediaLinks || recruiterData.socialMediaLinks;

    const updatedData = await recruiterModel.findByIdAndUpdate({ _id: id }, recruiterData, { new: true });
    return res.status(200).send({ status: true, data: updatedData, message: 'Recruiter data updated' });


  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const jobSearch = async (req, res) => {
  try {
    const jobId = req.params.id;

    // Find the job that matches the jobId
    const job = await jobModel.findOne({ _id: jobId });
    //console.log(job);

    // Find users that connects all user when recruiter fields should be equal-to-false.
    const users = await userModel.find({ recruiter: false });
    //console.log(users);
    // Loop through each individual user to fetch their all details corresponding to the 'id' fields. 'id' fields later provided same 'id' as the 'userDetailID' fields for the different Models=educationModel,experienceModel,skillsModel,projectModel,userprofileModel...
    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        const education = await educationModel.find({ userDetailsID: user._id })
        const experience = await experienceModel.find({ userDetailsID: user._id })
        const projects = await projectsModel.find({ userDetailsID: user._id })
        const skills = await skillsModel.find({ userDetailsID: user._id })
        const userProfile = await userprofileModel.find({ userDetailsID: user._id })
        // Create the user object with all the fetched data
        return {
          usersWithDetails:user,
          education,
          experience,
          projects,
          skills,
          userProfile
        }
      }))
      console.log(JSON.stringify(usersWithDetails, null, 2));

    const educationLevel = job.education.map((e) => e.educationLevel);
    // console.log(educationLevel);
    const experience = job.experience;
    const primarySkills = job.primarySkills;
    const secondarySkills = job.secondarySkills;
    const location = job.location;
    
    // const matchedUsers = usersWithDetails.map((user) => {
    //   // console.log(user);
    //   const usereducationLevel = user.education.map((e) => e.educationLevel);
    //   if (Object.values(usereducationLevel).includes(educationLevel))
    //   return
    // });
    const matchedUsers = usersWithDetails.filter((user) => {
      const userEducationLevel = user.education.map((e) => e.educationLevel)
      return (
        userEducationLevel.includes(educationLevel) &&
        user.experience >= experience &&
        user.skills.primarySkills.includes(primarySkills) &&
        user.skills.secondarySkills.includes(secondarySkills) &&
        user.userProfile.location === location
      );
    });
    
    console.log(typeof matchedUsers);

    // Filter users that match the job criteria

    // console.log(matchedUsers);
    // const matchedUsers = usersWithDetails.filter((user) => {
    //   const usereducationLevel = user.education.map((e) => e.educationLevel);
    //   return (
    //     usereducationLevel.includes(educationLevel) &&
    //     user.experience.yearsOfExperience >= experience &&
    //     user.skills.primarySkills.includes(primarySkills) &&
    //     user.skills.secondarySkills.includes(secondarySkills) &&
    //     user.userProfile.location === location
    //   );
    // });

    // console.log(matchedUsers);

    // Return job seekers who match search criteria
    res.status(200).json({status:true,
      job, matchedUsers
    });
  } catch (error) {

    res.status(500).json({status:false, message: error.message });
  }
};


// const jobSearch = async (req, res) => {
//   try {
//     const jobId = req.params.id;
//     const job = await jobModel.findOne({ _id: jobId });
//     const users = await userModel.find({ recruiter: false });
//     const usersWithDetails = await Promise.all(
//       users.map(async (user) => {
//         const education = await educationModel.find({ userDetailsID: user._id });
//         const experience = await experienceModel.find({ userDetailsID: user._id });
//         const projects = await projectsModel.find({ userDetailsID: user._id });
//         const skills = await skillsModel.find({ userDetailsID: user._id });
//         const userProfile = await userprofileModel.find({ userDetailsID: user._id });
//         return {
//           user,
//           education,
//           experience,
//           projects,
//           skills,
//           userProfile
//         }
//       })
//     );

//     const educationLevel = job.education.map((e) => e.educationLevel);
//     const experience = job.experience;
//     const primarySkills = job.primarySkills;
//     const secondarySkills = job.secondarySkills;
//     const location = job.location;
    
//     const matchedUsers = usersWithDetails.filter((userDetails) => {
//       const user = userDetails.user;
//       const userEducationLevel = userDetails.education.map((e) => e.educationLevel);
//       const userPrimarySkills = userDetails.skills.primarySkills;
//       const userSecondarySkills = userDetails.skills.secondarySkills;
//       const userExperience = userDetails.experience[0].experience;
//       const userLocation = userDetails.userProfile[0].location;
//       return (
//         userEducationLevel.includes(educationLevel) &&
//         userPrimarySkills.includes(primarySkills) &&
//         userSecondarySkills.includes(secondarySkills) &&
//         userExperience >= experience &&
//         userLocation === location
//       );
//     });
//     res.status(200).json({
//       status: true,
//       job,
//       matchedUsers
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error.message
//     });
//   }
// };


const searchJobseekerGeneral = async (req, res) => {
  try {
    const { experience, educationalLevel, discipline, primarySkills } = req.query;

    const query = {};

    if (experience) {
      const experienceArray = experience.split(",");
      query.experience = { $in: experienceArray.map(experience => new RegExp(experience.trim(), 'i')) };
    }

    if (educationalLevel) {
      query.educationLevel = { $regex: educationalLevel, $options: 'i' };
    }

    if (discipline) {
      query.discipline = { $regex: discipline, $options: 'i' };
    }

    if (primarySkills) {
      query.primarySkills = { $regex: primarySkills, $options: 'i' };
    }

    const skillDetails = await mongoose.model('Skills').find(query).populate('userDetailsID.skills');

    const educationDetails = await mongoose.model('Education').find(query).populate('userDetailsID.education');
    const experienceDetails = await mongoose.model('Experience').find(query).populate('UserDetailsID.experience');

    console.log('skillDetails:', skillDetails);
    console.log('educationDetails:', educationDetails);
    console.log('experienceDetails:', experienceDetails);

    if (skillDetails.length === 0 && educationDetails.length === 0 && experienceDetails.length === 0) {
      return res.status(404).json({ status: false, message: 'Data not found' });
    }

    return res.status(200).json({ status: true, skillDetails, educationDetails, experienceDetails });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

async function recruiterSearch(req, res) {
  try {
    const { primarySkills, secondarySkills, experience, educationLevel, location } = req.query;
    const schema = Joi.object({
      primarySkills: Joi.string().allow(''),
      secondarySkills: Joi.string().allow(''),
      experience: Joi.string().allow(''),
      educationLevel: Joi.string().allow(''),
      location: Joi.string().allow('')
    });
    const validation = schema.validate(req.query, { abortEarly: false });
    if (validation.error) {
      return res.status(400).send({ message: validation.error.details.map(d => d.message) });
    }
    const skillsQuery = {};
    if (primarySkills) {
      skillsQuery.primarySkills = { $in: primarySkills.split(",").map(s => new RegExp(`^${s.trim()}$`, 'i')) };
    }
    if (secondarySkills) {
      skillsQuery.secondarySkills = { $in: secondarySkills.split(",").map(s => new RegExp(`^${s.trim()}$`, 'i')) };
    }

    const educationQuery = {};
    if (educationLevel) {
      educationQuery.educationLevel = { $in: educationLevel.split(",").map(level => new RegExp(`^${level.trim()}$`, 'i')) };
    }
    const experienceArray = experience ? experience.split(",").map(s => s.trim()) : [];
    const userProfileQuery = {};
    if (location) {
      userProfileQuery.location = { $in: location.split(",").map(loc => new RegExp(`^${loc.trim()}$`, 'i')) };
    }
    const users = await userModel.find({ recruiter: false });
    const education = await educationModel.find(educationQuery, 'userDetailsID educationLevel collegeName authority discipline yearOfpassout');
    const experienceResults = await experienceModel.find({}, 'userDetailsID experience');
    const skills = await skillsModel.find(skillsQuery, 'userDetailsID primarySkills secondarySkills');
    const userProfiles = await userprofileModel.find(userProfileQuery, 'userDetailsID location');
    const result = users.map((user) => {
      const userExperience = experienceResults.find(ex => ex.userDetailsID.toString() === user._id.toString()) || {};
      const userEducation = education.find(e => e.userDetailsID.toString() === user._id.toString()) || {};
      const userSkills = skills.find(s => s.userDetailsID.toString() === user._id.toString()) || {};
      const userProfile = userProfiles.find(p => p.userDetailsID.toString() === user._id.toString()) || {};
      let matchCount = 0;
      if (primarySkills && userSkills.primarySkills && userSkills.primarySkills.some(s => primarySkills.split(",").map(p => p.trim()).includes(s))) {
        matchCount++;
      }
      if (secondarySkills && userSkills.secondarySkills && userSkills.secondarySkills.some(s => secondarySkills.split(",").map(p => p.trim()).includes(s))) {
        matchCount++;
      }
      if (experienceArray.length > 0 && userExperience.experience && experienceArray.includes(userExperience.experience)) {
        matchCount++;
      }
      if (educationLevel && userEducation.educationLevel && educationLevel.split(",").map(level => new RegExp(`^${level.trim()}$`, 'i')).some(regex => regex.test(userEducation.educationLevel))) {
        matchCount++;
      }
      if (location && userProfile.location && location.split(",").map(loc => new RegExp(`^${loc.trim()}$`, 'i')).some(regex => regex.test(userProfile.location))) {
        matchCount++;
      }
      if (matchCount === 0) {
        return null;
      } else {
        return {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          educationLevel: userEducation.educationLevel || '',
          collegeName: userEducation.collegeName || '',
          authority: userEducation.authority || '',
          discipline: userEducation.discipline || '',
          yearOfpassout: userEducation.yearOfpassout || '',
          experience: userExperience.experience || {},
          primarySkills: userSkills.primarySkills || '',
          secondarySkills: userSkills.secondarySkills || '',
          location: userProfile.location || ''
        };
      }
    }).filter(result => result !== null);
    res.send(result);
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

const recruiterInformation = async function (req, res) {
  try {
    const id = req.params.id;
    const recruiterData = await recruiterModel.find({ _id: id });
    res.status(200).json({ status: true, data: recruiterData });
  }
  catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
}

const searchjobseekers = async function (req, res) {

  try {

    const allUsers = await userModel.find({ recruiter: false }).select({ firstName: 1, lastName: 1, email: 1 });
    const userDetails = await Promise.all(allUsers.map(async (user) => {

      //this code is a simple and effective way to get education and experience details for a specific user.//

      const educationDetails = await educationModel.find({ userDetailsID: user._id }).select({ userDetailsID: 1, educationLevel: 1, authority: 1 });
      const experienceDetails = await experienceModel.find({ userDetailsID: user._id }).select({ userDetailsID: 1, experience: 1 });
      // const skillsDetails = await skillsModel.find({ userDetailsID: user._id } );
      // const projectDetails = await projectsModel.find({ userDetailsID: user._id } );
      // // console.log(educationDetails)

      let score = 0
      //The EducationLevelPoints and AuthorityPoints are two objects which have predefined values assigned to them for each education level and authority.The code block calculates the score for each education and Experience detail by adding the points for the education level and the authority and experience. If the calculated score is greater than the existing score, the existing score is updated with the new score. This ensures that only the education detail with the highest score is considered for the final educational score.
      for (let i = 0; i < educationDetails.length; i++) {
        if (EducationLevelPoints[educationDetails[i].educationLevel] + AuthorityPoints[educationDetails[i].authority] + ExperienceLevelPoints[experienceDetails[i].experience] > score) {
          score = EducationLevelPoints[educationDetails[i].educationLevel] + AuthorityPoints[educationDetails[i].authority] + ExperienceLevelPoints[experienceDetails[i].experience]
        }

      }

      return {

        userDetails: user,
        educationDetails,
        PoolPoints: score,
        experienceDetails,
        //   skillsDetails,
        //   projectDetails
      }

    }));

    //   Creation of pools
    let premiumPool = [], vipPool = [], normalPool = []
    userDetails.map((userD) => {
      if (userD.PoolPoints >= 1700) premiumPool.push(userD)
      else if (userD.PoolPoints >= 1000) vipPool.push(userD)
      else normalPool.push(userD)
    })

    //   Count the score of the jobpost created by recruiter   and refined the users acc to jobscore



    // Count the score of the job post created by recruiter and refine the users according to job score




    const jobId = req.params.id;
    const jobPost = await jobModel.findById(jobId);

    let matchingUsers = []

    for (let i = 0; i < userDetails.length; i++) {
      let candidateScore = 0
      const candidate = userDetails[i]

      // Check if candidate meets experience requirement
      if (jobPost.experienceRequired) {
        let yearsOfExperience = 0
        for (let j = 0; j < candidate.experienceDetails.length; j++) {
          yearsOfExperience += calculateExperience(candidate.experienceDetails[j].startDate, candidate.experienceDetails[j].endDate)
        }
        if (yearsOfExperience < jobPost.experienceRequired) {
          continue
        }
        candidateScore += ExperienceLevelPoints[yearsOfExperience]
      }

      // Check if candidate meets education requirement
      if (jobPost.educationRequired) {
        let highestEducationScore = 0
        for (let j = 0; j < candidate.educationDetails.length; j++) {
          const educationLevel = candidate.educationDetails[j].educationLevel
          const authority = candidate.educationDetails[j].authority
          const educationScore = EducationLevelPoints[educationLevel] + AuthorityPoints[authority]
          if (educationScore > highestEducationScore) {
            highestEducationScore = educationScore
          }
        }
        if (highestEducationScore < EducationLevelPoints[jobPost.educationRequired]) {
          continue
        }
        candidateScore += highestEducationScore
      }

      // Check if candidate meets skill requirements
      if (jobPost.skillsRequired) {
        let hasRequiredSkills = true
        for (let j = 0; j < jobPost.skillsRequired.length; j++) {
          const requiredSkill = jobPost.skillsRequired[j]
          const hasSkill = candidate.skillsDetails.some(skill => skill.name === requiredSkill.name && skill.level >= requiredSkill.level)
          if (!hasSkill) {
            hasRequiredSkills = false
            break
          }
        }
        if (!hasRequiredSkills) {
          continue
        }
        candidateScore += SkillPoints
      }

      // Check if candidate meets project requirements
      if (jobPost.projectsRequired) {
        let hasRequiredProjects = true
        for (let j = 0; j < jobPost.projectsRequired.length; j++) {
          const requiredProject = jobPost.projectsRequired[j]
          const hasProject = candidate.projectDetails.some(project => project.name === requiredProject.name && project.role === requiredProject.role)
          if (!hasProject) {
            hasRequiredProjects = false
            break
          }
        }
        if (!hasRequiredProjects) {
          continue
        }
        candidateScore += ProjectPoints
      }

      // If candidate passed all requirements, add them to the matching users array
      matchingUsers.push({
        userDetails: candidate.userDetails,
        educationDetails: candidate.educationDetails,
        PoolPoints: candidate.PoolPoints,
        experienceDetails: candidate.experienceDetails,
        score: candidateScore
      })
    }

    // Sort matching users by descending score
    matchingUsers.sort((a, b) => b.score - a.score)

    res.status(200).json({
      success: true,
      message: "Matching job seekers found",
      matchingUsers
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}

module.exports = { recruiterInformation, recruiterInfo, updateRecruiterData, searchjobseekers, recruiterSearch, searchJobseekerGeneral, jobSearch };
