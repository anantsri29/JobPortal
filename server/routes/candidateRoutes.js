import express from 'express';
import {
  updateProfile,
  uploadResume,
  getSuggestedJobs,
  getApplications,
  getPublicProfile,
  getDashboard,
} from '../controllers/candidateController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { handleUpload } from '../middleware/handleMulter.js';

const router = express.Router();

router.get('/profile/:username', getPublicProfile);
router.put('/profile', protect, authorize('candidate'), updateProfile);
router.post('/upload-resume', protect, authorize('candidate'), handleUpload(upload.single('resume')), uploadResume);
router.get('/suggested-jobs', protect, authorize('candidate'), getSuggestedJobs);
router.get('/applications', protect, authorize('candidate'), getApplications);
router.get('/dashboard', protect, authorize('candidate'), getDashboard);

export default router;
