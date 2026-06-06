import express from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getRecruiterJobs,
  closeJob,
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/recruiter/my-jobs', protect, authorize('recruiter'), getRecruiterJobs);
router.get('/:id', getJobById);
router.post('/', protect, authorize('recruiter'), createJob);
router.put('/:id', protect, authorize('recruiter'), updateJob);
router.delete('/:id', protect, authorize('recruiter'), deleteJob);
router.patch('/:id/close', protect, authorize('recruiter'), closeJob);

export default router;
