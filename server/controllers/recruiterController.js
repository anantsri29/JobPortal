import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

export const setupCompany = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, website, description, industry } = req.body;

    user.company = {
      ...user.company,
      name: name || user.company?.name,
      website,
      description,
      industry,
    };
    user.onboardingComplete = true;
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;
    res.json(userObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecruiterDashboard = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id });
    const jobIds = jobs.map((j) => j._id);

    const totalApplicants = await Application.countDocuments({ job: { $in: jobIds } });
    const pendingApplicants = await Application.countDocuments({
      job: { $in: jobIds },
      status: 'pending',
    });
    const shortlisted = await Application.countDocuments({
      job: { $in: jobIds },
      status: 'shortlisted',
    });

    const recentApplications = await Application.find({ job: { $in: jobIds } })
      .populate('candidate', 'name email profilePhoto skills')
      .populate('job', 'title')
      .sort({ appliedAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalJobs: jobs.length,
        activeJobs: jobs.filter((j) => j.isActive).length,
        totalApplicants,
        pendingApplicants,
        shortlisted,
      },
      recentApplications,
      jobs: jobs.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
