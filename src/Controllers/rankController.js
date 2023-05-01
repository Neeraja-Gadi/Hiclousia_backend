// const Seeker = require('../models/usergeneralModels');
// const { Authority, Certificate, EducationLevel, Experience } = require('../Constrains/authority');
// const Joi = require('joi');
// const express = require('express');
// const router = express.Router();
// const Seeker = require('../models/Seeker');

// GET all user data
// router.get('/', async (req, res) => {
//   try {
//     const Seeker = await Seeker.find();
//     res.json(Seeker);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// GET a specific user data by ID
// router.get('/:id', getSeeker, (req, res) => {
//   res.json(res.Seeker);
// });

// POST a new user data
// router.post('/', async (req, res) => {
//   const Seeker = new Seeker({
//     gitLink: req.body.gitLink,
//     profileLink: req.body.profileLink,
//     gender: req.body.gender,
//     doB: req.body.doB,
//     phone: req.body.phone,
//     authority: req.body.authority,
//     certificate: req.body.certificate,
//     experience: req.body.experience,
//     educationLevel: req.body.educationLevel
//   });

//   try {
//     const newSeeker = await Seeker.save();
//     res.status(201).json(newSeeker);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });
// Validation function for POST request
// function validateSeeker(seeker) {
//   const schema = Joi.object({
//     gitLink: Joi.string(),
//     profileLink: Joi.string(),
//     gender: Joi.string(),
//     doB: Joi.date(),
//     phone: Joi.string(),
//     authority: Joi.string().required(),
//     certificate: Joi.string().required(),
//     experience: Joi.string().required(),
//     educationLevel: Joi.string().required()
//   });
//   return schema.validate(seeker);
// }

// Middleware function to get user data by ID
// async function getSeeker(req, res, next) {
//   try {
//     const Seeker = await Seeker.findById(req.params.id);
//     if (Seeker == null) {
//       return res.status(404).json({ message: 'Cannot find user data' });
//     }
//     res.Seeker = Seeker;
//     next();
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// }

// module.exports = router;

// const getTopTwoRankedSeekers = async (req, res) => {
//   try {
//     const seekers = await Seeker.find();

//     let filteredseekers = seekers.filter((seeker) => {
//       if (req.query.Authority && seeker.authority !== req.query.Authority) {
//         return false;
//       }
//       if (req.query.Certificate && seeker.certificate !== req.query.Certificate) {
//         return false;
//       }
//       if (req.query.EducationLevel && seeker.educationLevel !== req.query.EducationLevel) {
//         return false;
//       }
//       if (req.query.Experience && seeker.experience !== req.query.Experience) {
//         return false;
//       }
//       return true;
//     });

//     filteredseekers = filteredseekers.map((seeker) => {
//       const weight = parseInt(Authority[seeker.authority])
//         + parseInt(Certificate[seeker.certificate])
//         + parseInt(EducationLevel[seeker.EducationLevel])
//         + parseInt(Experience[seeker.experience]);
//       return { ...seeker._doc, weight };
//     }).sort((a, b) => b.weight - a.weight);

//     const topTwoRankedSeekers = filteredseekers.slice(0, 2);

//     res.status(200).json({
//       success: true,
//       data: topTwoRankedSeekers,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal Server'
//     })
//   }
// }


// module.exports = { validateSeeker, getTopTwoRankedSeekers };
