const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// ==================== ROUTES IMPORT ====================
const userRoutes = require('./routes/userRoutes'); // Jika ada
const prospekRoutes = require('./routes/prospekRoutes'); // Route baru Anda

// ==================== ROUTES MIDDLEWARE ====================
app.use('/api/users', userRoutes); // Untuk user management
app.use('/api/prospek', prospekRoutes); // Untuk prospek unit

// ==================== BASIC ROUTES ====================

// Test route - GET /
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Server Dealer Mobil API is running!',
    database: 'MongoDB Atlas Connected',
    timestamp: new Date().toISOString(),
    endpoints: {
      users: [
        'GET /api/users',
        'POST /api/users', 
        'GET /api/users/:id',
        'PUT /api/users/:id',
        'DELETE /api/users/:id'
      ],
      prospek: [
        'POST /api/prospek/unit',
        'GET /api/prospek/unit',
        'PATCH /api/prospek/unit/:id/ambil'
      ]
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.url} not found`,
    availableRoutes: [
      'GET /',
      'GET /health',
      'GET /api/users',
      'POST /api/users',
      'GET /api/users/:id',
      'PUT /api/users/:id', 
      'DELETE /api/users/:id',
      'POST /api/prospek/unit',
      'GET /api/prospek/unit',
      'PATCH /api/prospek/unit/:id/ambil'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('📚 Available endpoints:');
  console.log('   USERS:');
  console.log('     GET  /api/users              - Get all users');
  console.log('     POST /api/users              - Create user');
  console.log('     GET  /api/users/:id          - Get user by ID');
  console.log('     PUT  /api/users/:id          - Update user');
  console.log('     DELETE /api/users/:id        - Delete user');
  console.log('   PROSPEK:');
  console.log('     POST /api/prospek/unit       - Create prospek unit');
  console.log('     GET  /api/prospek/unit       - Get all prospek');
  console.log('     PATCH /api/prospek/unit/:id/ambil - Sales ambil prospek');
  console.log('\n🤖 Telegram Bot: Active');
  console.log('⚡ Ready for production!');
});