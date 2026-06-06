import express from 'express';
import {
  applyToJob,
  getMyApplications,
  updateApplicationStatus,
  getJobApplicants,
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply/:jobId', protect, authorize('candidate'), applyToJob);
router.get('/my', protect, authorize('candidate'), getMyApplications);
router.put('/:id/status', protect, authorize('recruiter'), updateApplicationStatus);
router.get('/job/:jobId', protect, authorize('recruiter'), getJobApplicants);

export default router;
