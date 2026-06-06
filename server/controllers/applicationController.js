import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { matchScore } from '../utils/matchJobs.js';
import sendEmail from '../utils/sendEmail.js';

export const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: 'Job not found or inactive' });
    }

    const existing = await Application.findOne({
      job: jobId,
      candidate: req.user._id,
    });
    if (existing) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }

    const candidate = await User.findById(req.user._id);
    if (!candidate.resumeUrl) {
      return res.status(400).json({ message: 'Please upload a resume before applying' });
    }

    const score = matchScore(candidate, job);

    const application = await Application.create({
      job: jobId,
      candidate: req.user._id,
      coverLetter,
      resumeUrl: candidate.resumeUrl,
      matchScore: score,
    });

    const populated = await Application.findById(application._id)
      .populate('job', 'title company')
      .populate('candidate', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate('job')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id)
      .populate('job', 'title company')
      .populate('candidate', 'name email');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const job = await Job.findById(application.job._id);
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    // Create notification
    await Notification.create({
      user: application.candidate._id,
      message: `Your application for "${application.job.title}" at ${application.job.company} has been updated to: ${status}`,
      type: 'application_status',
      relatedId: application._id,
    });

    // Send email notification
    try {
      await sendEmail({
        to: application.candidate.email,
        subject: `Application Status Update - ${application.job.title}`,
        text: `Your application for "${application.job.title}" at ${application.job.company} has been updated to: ${status}`,
        html: `<p>Your application for <strong>${application.job.title}</strong> at <strong>${application.job.company}</strong> has been updated to: <strong>${status}</strong></p>`,
      });
    } catch (emailErr) {
      console.error('Email send failed:', emailErr.message);
    }

    // Emit socket notification if io is available
    const io = req.app.get('io');
    if (io) {
      io.to(application.candidate._id.toString()).emit('notification', {
        message: `Application status updated to ${status}`,
        type: 'application_status',
      });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applicants = await Application.find({ job: req.params.jobId })
      .populate('candidate', '-password')
      .sort({ matchScore: -1, appliedAt: -1 });

    res.json(applicants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
