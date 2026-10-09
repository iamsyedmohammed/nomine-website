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

// Restore original URL from Vercel rewrite query parameter or headers
app.use((req, res, next) => {
  if (req.query && req.query.url) {
    req.url = req.query.url;
  } else {
    const matchedPath = req.headers['x-matched-path'] || req.headers['x-forwarded-path'];
    if (matchedPath && matchedPath !== '/api/index.js') {
      req.url = matchedPath;
    }
  }
  next();
});

// Root & Health Check Endpoints
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Nomine API Backend Server is running' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Nomine API Backend Server' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Nomine API Backend Server' });
});

// API Routes
app.use('/api', applicationRoutes);
app.use('/api', contactRoutes);
app.use(applicationRoutes);
app.use(contactRoutes);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Nomine API Backend Server running on port ${PORT}`);
  });
}

export default app;
