import express from 'express';
import { upload } from '../config/multer.js';
import { submitStaffInquiry } from '../controllers/staffController.js';

const router = express.Router();

// POST /api/staff-augmentation or /staff-augmentation
// upload.none() seamlessly handles multipart FormData as well as standard JSON bodies
router.post(['/staff-augmentation', '/api/staff-augmentation'], upload.none(), submitStaffInquiry);

export default router;
