import User from '../models/User.js';
import { uploadBuffer, deleteFromCloudinary } from '../utils/uploadToCloudinary.js';
import calculateProfileCompletion from '../utils/profileCompletion.js';

export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No photo file provided' });
    }

    const user = await User.findById(req.user._id);
    const folder = req.user.role === 'recruiter' ? 'job-portal/logos' : 'job-portal/photos';

    if (req.user.role === 'recruiter' && req.body.type === 'logo') {
      if (user.company?.logoPublicId) {
        await deleteFromCloudinary(user.company.logoPublicId);
      }
      const result = await uploadBuffer(req.file.buffer, folder, 'image', req.file.originalname);
      user.company = user.company || {};
      user.company.logo = result.secure_url;
      user.company.logoPublicId = result.public_id;
    } else {
      const result = await uploadBuffer(req.file.buffer, folder, 'image', req.file.originalname);
      user.profilePhoto = result.secure_url;
    }

    user.profileComplete = calculateProfileCompletion(user);
    await user.save();

    res.json({
      profilePhoto: user.profilePhoto,
      company: user.company,
      profileComplete: user.profileComplete,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadResumeFile = async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
};
