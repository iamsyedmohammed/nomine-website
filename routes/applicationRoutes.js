import express from 'express';
import { upload } from '../config/multer.js';
import { submitApplication } from '../controllers/applicationController.js';

const router = express.Router();

// POST /api/apply - Handle candidate application submission
router.post('/apply', upload.single('resume'), submitApplication);

export default router;
