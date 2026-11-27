const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(morgan('dev'));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/enquiries', require('./routes/enquiries'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/users', require('./routes/users'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/categories', require('./routes/categories'));

// Health check endpoint (used by Render)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Welcome / API index
app.get('/', (req, res) => {
  res.json({
    name: 'eBay Campus Second-Hand Market API',
    status: 'online',
    version: '1.0.0',
    endpoints: [
      '/api/listings',
      '/api/enquiries',
      '/api/favorites',
      '/api/users',
      '/api/notifications',
      '/api/upload',
      '/api/categories',
      '/api/auth',
    ],
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[API Error]:', err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Server] eBay Campus Market Backend running on port ${PORT}`);
  console.log(`[Server] API Base URL: http://0.0.0.0:${PORT}`);
});
