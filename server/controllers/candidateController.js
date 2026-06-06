import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import calculateProfileCompletion from '../utils/profileCompletion.js';
import { getSuggestedJobs as computeSuggestedJobs } from '../utils/matchJobs.js';
import { uploadBuffer, deleteFromCloudinary } from '../utils/uploadToCloudinary.js';
import sanitizeProfilePayload from '../utils/sanitizeProfile.js';
import sendError from '../utils/handleError.js';

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const payload = sanitizeProfilePayload(req.body);

    const allowedFields = [
      'name', 'phone', 'location', 'profilePhoto',
      'education', 'skills', 'experience', 'achievements',
      'certifications', 'resumeUrl', 'resumePublicId', 'onboardingComplete',
    ];

    allowedFields.forEach((field) => {
      if (payload[field] !== undefined) {
        user[field] = payload[field];
      }
    });

    user.profileComplete = calculateProfileCompletion(user);
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.json(userObj);
  } catch (error) {
    sendError(res, error);
  }
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No resume file provided' });
    }

    const user = await User.findById(req.user._id);

    if (user.resumePublicId) {
      await deleteFromCloudinary(user.resumePublicId, 'raw');
    }

    const result = await uploadBuffer(req.file.buffer, 'job-portal/resumes', 'raw', req.file.originalname);

    user.resumeUrl = result.secure_url;
    user.resumePublicId = result.public_id;
    user.profileComplete = calculateProfileCompletion(user);
    await user.save();

    res.json({
      resumeUrl: user.resumeUrl,
      profileComplete: user.profileComplete,
    });
  } catch (error) {
    sendError(res, error);
  }
};

export const getSuggestedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const jobs = await Job.find({ isActive: true }).populate('recruiter', 'name company');
    const suggested = computeSuggestedJobs(user, jobs, 10);
    res.json(suggested);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate('job', 'title company location jobType salaryMin salaryMax')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password -email');
    if (!user) return res.status(404).json({ message: 'Profile not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const applications = await Application.find({ candidate: req.user._id })
      .populate('job', 'title company location')
      .sort({ appliedAt: -1 })
      .limit(5);

    const allJobs = await Job.find({ isActive: true });
    const suggested = computeSuggestedJobs(user, allJobs, 6);

    const recentJobs = await Job.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('recruiter', 'name company');

    res.json({
      profileComplete: user.profileComplete,
      applications,
      suggestedJobs: suggested,
      recentJobs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
