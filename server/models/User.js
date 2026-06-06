import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const educationSchema = new mongoose.Schema({
  degree: String,
  college: String,
  year: Number,
  cgpa: Number,
});

const experienceSchema = new mongoose.Schema({
  company: String,
  role: String,
  duration: String,
  description: String,
});

const achievementSchema = new mongoose.Schema({
  title: String,
  issuer: String,
  date: Date,
  link: String,
});

const certificationSchema = new mongoose.Schema({
  title: String,
  issuer: String,
  date: Date,
  credentialLink: String,
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['candidate', 'recruiter', 'admin'],
      default: 'candidate',
    },
    username: { type: String, unique: true, sparse: true },
    profilePhoto: String,
    phone: String,
    location: String,
    education: [educationSchema],
    skills: [String],
    experience: [experienceSchema],
    achievements: [achievementSchema],
    certifications: [certificationSchema],
    resumeUrl: String,
    resumePublicId: String,
    profileComplete: { type: Number, default: 0 },
    // Recruiter company profile
    company: {
      name: String,
      logo: String,
      logoPublicId: String,
      website: String,
      description: String,
      industry: String,
    },
    onboardingComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
