import express from 'express';
import { setupCompany, getRecruiterDashboard } from '../controllers/recruiterController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/company', protect, authorize('recruiter'), setupCompany);
router.get('/dashboard', protect, authorize('recruiter'), getRecruiterDashboard);

export default router;
