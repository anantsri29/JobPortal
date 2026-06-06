/**
 * Seed script — populates demo users and jobs for local testing.
 * Run: node seed.js
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Job from './models/Job.js';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  console.log('Connected to MongoDB');

  await Job.deleteMany({});
  await User.deleteMany({ email: { $in: ['candidate@demo.com', 'recruiter@demo.com', 'admin@demo.com'] } });

  const recruiter = await User.create({
    name: 'TechCorp HR',
    email: 'recruiter@demo.com',
    password: 'demo123',
    role: 'recruiter',
    username: 'techcorphr1234',
    onboardingComplete: true,
    company: {
      name: 'TechCorp Solutions',
      website: 'https://techcorp.example.com',
      description: 'Leading technology company building innovative products.',
      industry: 'Technology',
    },
  });

  await User.create({
    name: 'John Candidate',
    email: 'candidate@demo.com',
    password: 'demo123',
    role: 'candidate',
    username: 'johncandidate5678',
    onboardingComplete: true,
    profileComplete: 85,
    phone: '+91 9876543210',
    location: 'Mumbai, India',
    skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'Express', 'Tailwind CSS'],
    education: [{ degree: 'B.Tech Computer Science', college: 'IIT Mumbai', year: 2022, cgpa: 8.5 }],
    experience: [
      { company: 'StartupXYZ', role: 'Frontend Developer', duration: 'Jan 2023 - Present', description: 'Built React dashboards and REST APIs.' },
    ],
    certifications: [{ title: 'AWS Cloud Practitioner', issuer: 'Amazon', date: new Date('2023-06-01') }],
  });

  await User.create({
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'demo123',
    role: 'admin',
    username: 'adminuser9999',
    onboardingComplete: true,
  });

  const jobs = [
    {
      title: 'Senior React Developer',
      description: 'We are looking for a Senior React Developer to build scalable web applications. You will work with our product team to deliver high-quality UI components and integrate with Node.js backends.',
      company: 'TechCorp Solutions',
      recruiter: recruiter._id,
      skillsRequired: ['React', 'JavaScript', 'TypeScript', 'Redux'],
      location: 'Mumbai, India',
      salaryMin: 1200000,
      salaryMax: 2000000,
      jobType: 'full-time',
      experienceLevel: '3-5',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Full Stack MERN Developer',
      description: 'Join our engineering team to build end-to-end features using MongoDB, Express, React, and Node.js. Experience with REST APIs and JWT auth required.',
      company: 'TechCorp Solutions',
      recruiter: recruiter._id,
      skillsRequired: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'],
      location: 'Remote',
      salaryMin: 800000,
      salaryMax: 1500000,
      jobType: 'remote',
      experienceLevel: '1-2',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Frontend Intern',
      description: 'Great opportunity for freshers to learn React, Tailwind CSS, and modern frontend development practices in a supportive team environment.',
      company: 'TechCorp Solutions',
      recruiter: recruiter._id,
      skillsRequired: ['React', 'HTML', 'CSS', 'JavaScript'],
      location: 'Bangalore, India',
      salaryMin: 200000,
      salaryMax: 400000,
      jobType: 'internship',
      experienceLevel: 'fresher',
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Node.js Backend Engineer',
      description: 'Design and implement RESTful APIs, work with MongoDB schemas, and integrate third-party services. Strong knowledge of Express.js and authentication patterns required.',
      company: 'TechCorp Solutions',
      recruiter: recruiter._id,
      skillsRequired: ['Node.js', 'Express', 'MongoDB', 'JWT', 'REST API'],
      location: 'Pune, India',
      salaryMin: 1000000,
      salaryMax: 1800000,
      jobType: 'full-time',
      experienceLevel: '3-5',
      deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'UI/UX Developer',
      description: 'Create beautiful, responsive interfaces using Tailwind CSS and React. Collaborate with designers to implement pixel-perfect UIs.',
      company: 'TechCorp Solutions',
      recruiter: recruiter._id,
      skillsRequired: ['React', 'Tailwind CSS', 'Figma', 'CSS'],
      location: 'Hyderabad, India',
      salaryMin: 600000,
      salaryMax: 1200000,
      jobType: 'part-time',
      experienceLevel: '1-2',
      deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    },
  ];

  await Job.insertMany(jobs);

  console.log('\n✅ Seed complete!\n');
  console.log('Demo accounts (password: demo123):');
  console.log('  Candidate : candidate@demo.com');
  console.log('  Recruiter : recruiter@demo.com');
  console.log('  Admin     : admin@demo.com');
  console.log(`\n${jobs.length} sample jobs created.\n`);

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
