# Deployment Guide

Complete guide for deploying the AI Job Application Tracker to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Configuration](#database-configuration)
4. [API Keys Setup](#api-keys-setup)
5. [Frontend Deployment](#frontend-deployment)
6. [Backend Deployment](#backend-deployment)
7. [Production Environment Variables](#production-environment-variables)
8. [Security Considerations](#security-considerations)
9. [Monitoring & Maintenance](#monitoring--maintenance)
10. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Services
- **Node.js** (v16 or higher)
- **MongoDB Atlas** account (recommended) or MongoDB server
- **Google Gemini API** access
- **Domain name** (for production)
- **SSL Certificate** (recommended)

### Development Tools
- **Git** for version control
- **SSH client** for server access
- **Text editor** or IDE

## Environment Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd JobO
```

### 2. Install Dependencies
```bash
# Server dependencies
cd server
npm install --production

# Client dependencies
cd ../client
npm install --production
```

### 3. Build the Frontend
```bash
cd client
npm run build
```

This creates a `build` directory with optimized production files.

## Database Configuration

### Option 1: MongoDB Atlas (Recommended)

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create Cluster**
   - Click "Build a Cluster"
   - Choose "M0 Sandbox" (free tier)
   - Select a cloud provider and region

3. **Configure Security**
   - Create database user:
     ```
     Username: jobtracker_user
     Password: [generate strong password]
     ```
   - Add IP address:
     - For development: Add your current IP
     - For production: Add `0.0.0.0/0` (allows all IPs)

4. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

### Option 2: Local MongoDB

```bash
# Install MongoDB
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongod

# Enable on boot
sudo systemctl enable mongod
```

## API Keys Setup

### Google Gemini API

1. **Get API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Click "Create API Key"
   - Copy the generated key

2. **Set Up Project**
   - Ensure your Google Cloud project has the Generative Language API enabled
   - Set up billing if required (free tier available)

## Frontend Deployment

### Option 1: Static Hosting (Vercel, Netlify, etc.)

1. **Build for Production**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Deploy to Netlify**
   - Drag and drop the `build` folder to Netlify
   - Or use Netlify CLI

### Option 2: Serve with Express (Recommended)

The server is already configured to serve static files in production:

```javascript
// server.js - already configured
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}
```

## Backend Deployment

### Option 1: Traditional Server (VPS/Dedicated)

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 (Process Manager)
   sudo npm install -g pm2
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone <your-repository-url>
   cd JobO
   
   # Install dependencies
   cd server
   npm install --production
   
   # Build client
   cd ../client
   npm install --production
   npm run build
   ```

3. **Start with PM2**
   ```bash
   cd ../server
   pm2 start server.js --name "jobtracker-api"
   pm2 save
   pm2 startup
   ```

### Option 2: Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   # server/Dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm install --production
   
   COPY . .
   
   COPY ../client/build ./public
   
   EXPOSE 5000
   
   CMD ["node", "server.js"]
   ```

2. **Build and Run**
   ```bash
   docker build -t jobtracker-api .
   docker run -p 5000:5000 --env-file .env jobtracker-api
   ```

### Option 3: Cloud Services (Heroku, AWS, etc.)

#### Heroku Deployment
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGO_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set GEMINI_API_KEY=your-gemini-key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

## Production Environment Variables

### Create `.env` file in server directory:
```bash
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-here

# AI Services
GEMINI_API_KEY=your-gemini-api-key-here

# Environment
NODE_ENV=production
PORT=5000
```

### Client Environment Variables
```bash
# client/.env
REACT_APP_API_URL=https://your-domain.com/api
```

## Security Considerations

### 1. Environment Variables
- Never commit `.env` files to version control
- Use strong, randomly generated secrets
- Rotate keys regularly

### 2. Database Security
- Use MongoDB Atlas with IP whitelisting
- Enable database authentication
- Use SSL connections

### 3. API Security
- Implement rate limiting
- Use HTTPS in production
- Validate all inputs
- Sanitize user data

### 4. JWT Security
```javascript
// Use strong secrets (minimum 32 characters)
JWT_SECRET=your-super-secure-jwt-secret-key-here-minimum-32-characters

// Set reasonable expiration
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
```

## Monitoring & Maintenance

### 1. Application Monitoring
```bash
# PM2 Monitoring
pm2 monit

# View logs
pm2 logs jobtracker-api

# Restart application
pm2 restart jobtracker-api
```

### 2. Database Monitoring
- Monitor MongoDB Atlas metrics
- Set up alerts for unusual activity
- Regular backups

### 3. Error Tracking
- Implement error logging
- Set up notifications for critical errors
- Monitor application performance

### 4. SSL Certificate
```bash
# Using Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors
```bash
# Check MongoDB connection string
# Verify IP whitelist in MongoDB Atlas
# Ensure database user has correct permissions
```

#### 2. Port Already in Use
```bash
# Find process using port
sudo lsof -i :5000

# Kill process
sudo kill -9 <PID>

# Or use different port
PORT=5001 node server.js
```

#### 3. Environment Variables Not Loading
```bash
# Verify .env file exists
ls -la .env

# Check file permissions
chmod 600 .env

# Test environment variables
node -e "require('dotenv').config(); console.log(process.env.MONGO_URI)"
```

#### 4. Frontend Build Errors
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for missing dependencies
npm ls
```

### Health Check Endpoint
Add to `server.js`:
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

## CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        cd server && npm install
        cd ../client && npm install
        
    - name: Build client
      run: cd client && npm run build
      
    - name: Deploy to server
      run: |
        # Your deployment script here
        echo "Deploying to production server"
```

## Performance Optimization

### 1. Frontend Optimization
- Enable gzip compression
- Implement caching strategies
- Optimize images and assets
- Use CDN for static assets

### 2. Backend Optimization
- Implement database indexing
- Use connection pooling
- Enable API response caching
- Monitor memory usage

### 3. Database Optimization
```javascript
// Example MongoDB indexes
db.applications.createIndex({ "userId": 1, "createdAt": -1 });
db.applications.createIndex({ "status": 1 });
db.users.createIndex({ "email": 1 }, { unique: true });
```

## Production Checklist

### Before Going Live:
- [ ] All environment variables set
- [ ] Database configured and tested
- [ ] SSL certificate installed
- [ ] Domain name pointing to server
- [ ] Error monitoring set up
- [ ] Backup strategy implemented
- [ ] Security measures in place
- [ ] Performance testing completed
- [ ] Documentation updated

### After Deployment:
- [ ] Monitor application health
- [ ] Check all API endpoints
- [ ] Test user registration/login
- [ ] Verify AI functionality
- [ ] Monitor error logs
- [ ] Set up alerts

---

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review server logs
3. Verify environment variables
4. Test database connectivity
5. Check API key validity

**Happy Deploying! **
