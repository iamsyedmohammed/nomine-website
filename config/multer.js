import multer from 'multer';

// Configure Multer for in-memory file handling
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/svg+xml',
    'application/zip',
    'application/x-zip-compressed',
    'application/octet-stream'
  ];

  const allowedExts = /\.(pdf|doc|docx|png|jpg|jpeg|webp|svg|zip|fig|psd)$/i;

  if (allowedMimes.includes(file.mimetype) || allowedExts.test(file.originalname)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Please upload PDF, DOC, DOCX, PNG, JPG, JPEG, SVG, or ZIP files.'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});
