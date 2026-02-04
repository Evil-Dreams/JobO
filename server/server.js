const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load env from server/.env first, then fallback to root/.env
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'GEMINI_API_KEY'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});

const app = express();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'http://127.0.0.1:62879',
  // Add all possible localhost variations
  /^http:\/\/localhost(:[0-9]+)?$/,
  /^http:\/\/127\.0\.0\.1(:[0-9]+)?$/,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai-job-tracker', {
  serverSelectionTimeoutMS: 5000,
})
.then(() => {})
.catch(err => {
  console.error('✗ MongoDB connection failed:', err.message);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    cors: {
      origin: req.headers.origin,
      allowedOrigins: allowedOrigins
    }
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/site-stats', require('./routes/siteStats'));

// Serve static files from React app only when explicitly enabled
if (process.env.SERVE_CLIENT === 'true') {
  const clientBuildPath = path.join(__dirname, '../client/build');
  const indexPath = path.join(clientBuildPath, 'index.html');

  if (fs.existsSync(indexPath)) {
    app.use(express.static(clientBuildPath));

    app.get('*', (req, res) => {
      res.sendFile(indexPath);
    });
  } else {
    console.warn('SERVE_CLIENT=true but client build not found at:', indexPath);
  }
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {});
