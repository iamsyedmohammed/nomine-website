import express from 'express';
import { upload } from '../config/multer.js';
import { submitContactForm } from '../controllers/contactController.js';

const router = express.Router();

// POST /api/contact - Handle contact inquiry submission with optional attachments
router.post('/contact', upload.array('attachments', 5), submitContactForm);

export default router;
