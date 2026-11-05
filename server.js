import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import applicationRoutes from './routes/applicationRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory first, fallback to root .env
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend dev server & production
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

app.use(express.json());

// API Routes
app.use('/api', applicationRoutes);
app.use('/api', contactRoutes);
app.use(applicationRoutes);
app.use(contactRoutes);

// Root & Health Check Endpoints
app.all('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Nomine API Backend Server is running' });
});

app.all('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Nomine API Backend Server' });
});

app.all('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Nomine API Backend Server' });
});

// Multer & Global JSON Error Handler
app.use((err, req, res, next) => {
  if (err) {
    console.error('⚠️ [SERVER ERROR HANDLER]:', err.message);
    const statusCode = err.status || (err.name === 'MulterError' ? 400 : 500);
    return res.status(statusCode).json({
      success: false,
      message: err.message || 'An error occurred while processing your request.'
    });
  }
  next();
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Nomine API Backend Server running on port ${PORT}`);
  });
}

export default app;
