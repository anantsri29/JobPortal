import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    company: { type: String, required: true },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skillsRequired: [String],
    location: { type: String, required: true },
    salaryMin: Number,
    salaryMax: Number,
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'internship', 'remote'],
      default: 'full-time',
    },
    experienceLevel: {
      type: String,
      enum: ['fresher', '1-2', '3-5', '5+'],
      default: 'fresher',
    },
    deadline: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);
export default Job;
