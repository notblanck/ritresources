import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import resourceRoutes from './routes/resourceRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ritresources API',
    supabaseConnected: Boolean(process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('your-project'))
  });
});

// Routes
app.use('/api/resources', resourceRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/contact', contactRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.url}` });
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 ritresources API Server running on port ${PORT}`);
  console.log(`📡 Health endpoint: http://localhost:${PORT}/api/health`);
  console.log(`📚 Resources endpoint: http://localhost:${PORT}/api/resources`);
});

export default app;
