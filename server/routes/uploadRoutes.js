import express from 'express';
import { uploadPhoto, uploadResumeFile } from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { handleUpload } from '../middleware/handleMulter.js';

const router = express.Router();

router.post('/resume', protect, handleUpload(upload.single('resume')), uploadResumeFile);
router.post('/photo', protect, handleUpload(upload.single('photo')), uploadPhoto);

export default router;
