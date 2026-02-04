# Production Deployment Guide

This document provides detailed instructions for deploying the AI Job Application Tracker to production environments.

## Deployment Overview

The AI Job Application Tracker is deployed as a full-stack application with separate frontend and backend deployments:

- **Frontend**: Vercel (React application)
- **Backend**: Render (Node.js/Express API)
- **Database**: MongoDB Atlas

## Live URLs

- **Frontend**: https://job-o-ai.vercel.app
- **Backend**: https://jobo-qa81.onrender.com
- **API Base URL**: https://jobo-qa81.onrender.com/api

## Backend Deployment (Render)

### Prerequisites
- Render account
- MongoDB Atlas cluster
- Google Generative AI API key

### Step-by-Step Deployment

1. **Create New Web Service**
   - Log into Render dashboard
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Select the JobO repository
   - Choose the root directory as `server`

2. **Configure Build and Start Commands**
   ```
   Build Command: npm install
   Start Command: npm start
   ```

3. **Set Environment Variables**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-job-tracker
   JWT_SECRET=your_production_jwt_secret_here
   GEMINI_API_KEY=your_production_gemini_api_key
   FRONTEND_URL=https://job-o-ai.vercel.app
   PORT=5000
   NODE_ENV=production
   ```

4. **Configure Instance Type**
   - Instance Type: Free or Starter
   - Region: Choose nearest to your users
   - Branch: main

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Test the API endpoints

### Backend Configuration Details

**Package.json Scripts:**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

**Health Check Endpoint:**
```
GET https://jobo-qa81.onrender.com/api/health
```

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account
- GitHub repository connection

### Step-by-Step Deployment

1. **Import Project**
   - Log into Vercel dashboard
   - Click "Add New..." → "Project"
   - Import the JobO repository
   - Select the `client` directory as root

2. **Configure Build Settings**
   ```
   Framework Preset: Create React App
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

3. **Set Environment Variables**
   ```
   REACT_APP_API_URL=https://jobo-qa81.onrender.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Test the live application

### Frontend Configuration Details

**Vercel Configuration (vercel.json):**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## Database Setup (MongoDB Atlas)

### Configuration

1. **Create Cluster**
   - Log into MongoDB Atlas
   - Create new cluster (M0 Sandbox for free tier)
   - Choose cloud provider and region

2. **Configure Network Access**
   - Add IP address: 0.0.0.0/0 (allows all access)
   - Or add specific Render/Vercel IP ranges

3. **Create Database User**
   - Username: jobo_user
   - Password: [strong password]
   - Database user permissions: read/write

4. **Get Connection String**
   ```
   mongodb+srv://jobo_user:password@cluster.mongodb.net/ai-job-tracker
   ```

## Environment Variables Management

### Production Variables

**Backend (.env):**
```
# Database
MONGO_URI=mongodb+srv://jobo_user:password@cluster.mongodb.net/ai-job-tracker

# Authentication
JWT_SECRET=super_secure_jwt_secret_for_production

# AI Services
GEMINI_API_KEY=your_gemini_production_api_key

# Application
FRONTEND_URL=https://job-o-ai.vercel.app
PORT=5000
NODE_ENV=production
```

**Frontend (.env):**
```
REACT_APP_API_URL=https://jobo-qa81.onrender.com
```

### Security Considerations

1. **JWT Secret**: Use a strong, randomly generated secret
2. **Database Security**: Enable IP whitelisting where possible
3. **API Keys**: Rotate keys regularly and monitor usage
4. **HTTPS**: Ensure all endpoints use HTTPS in production

## Monitoring and Logging

### Backend Monitoring

**Render Dashboard:**
- Metrics: CPU, Memory, Response times
- Logs: Real-time log streaming
- Deployments: Build and deployment history

**Custom Logging:**
```javascript
// Example logging in server.js
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
```

### Frontend Monitoring

**Vercel Analytics:**
- Page views and unique visitors
- Performance metrics
- Error tracking

## Performance Optimization

### Backend Optimizations

1. **Database Indexing**
```javascript
// Example MongoDB indexes
db.applications.createIndex({ "userId": 1, "createdAt": -1 })
db.applications.createIndex({ "status": 1 })
```

2. **Caching Strategy**
- Implement Redis for frequently accessed data
- Cache API responses where appropriate

3. **Compression**
```javascript
const compression = require('compression');
app.use(compression());
```

### Frontend Optimizations

1. **Bundle Size Reduction**
- Code splitting with React.lazy
- Optimize images and assets
- Remove unused dependencies

2. **CDN Usage**
- Vercel automatically provides CDN
- Static assets cached at edge locations

## Scaling Considerations

### Backend Scaling

1. **Horizontal Scaling**
- Use Render's Standard or Pro instances
- Load balancer configuration
- Database connection pooling

2. **Database Scaling**
- Upgrade MongoDB Atlas tier as needed
- Implement read replicas for read-heavy operations

### Frontend Scaling

1. **CDN Optimization**
- Vercel Edge Network automatically scales
- Configure caching headers properly

## Backup and Recovery

### Database Backups

**MongoDB Atlas Automatic Backups:**
- Daily snapshots enabled
- Point-in-time recovery available
- Backup retention: 30 days (free tier)

### Application Backups

**Code Repository:**
- GitHub provides version control
- Tag releases for easy rollback
- Document deployment configurations

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Verify FRONTEND_URL environment variable
   - Check CORS configuration in server.js

2. **Database Connection Issues**
   - Verify MongoDB connection string
   - Check IP whitelist in Atlas
   - Ensure database user permissions

3. **Build Failures**
   - Check package.json dependencies
   - Verify Node.js version compatibility
   - Review build logs for specific errors

### Health Checks

**Backend Health:**
```bash
curl https://jobo-qa81.onrender.com/api/health
```

**Frontend Health:**
- Visit https://job-o-ai.vercel.app
- Check browser console for errors
- Verify API calls in network tab

## Maintenance

### Regular Tasks

1. **Weekly**
   - Monitor application performance
   - Review error logs
   - Check API usage quotas

2. **Monthly**
   - Update dependencies
   - Review security advisories
   - Backup documentation updates

3. **Quarterly**
   - Performance optimization review
   - Cost analysis
   - Scaling assessment

## Security Best Practices

1. **Regular Updates**
   - Keep dependencies updated
   - Monitor security vulnerabilities
   - Apply security patches promptly

2. **Access Control**
   - Use strong authentication
   - Implement rate limiting
   - Monitor for suspicious activity

3. **Data Protection**
   - Encrypt sensitive data
   - Use HTTPS everywhere
   - Follow GDPR compliance

## Cost Analysis

### Current Deployment Costs

**Render (Backend):**
- Free tier: $0/month
- Includes: 750 hours/month, 100GB bandwidth

**Vercel (Frontend):**
- Hobby tier: $0/month
- Includes: 100GB bandwidth, 100 builds

**MongoDB Atlas:**
- M0 Sandbox: $0/month
- Includes: 512MB storage

### Scaling Costs

**Potential Upgrades:**
- Render Starter: $7/month
- Vercel Pro: $20/month
- MongoDB Atlas M2: $25/month

## Conclusion

This deployment setup provides a robust, scalable, and cost-effective solution for the AI Job Application Tracker. The separation of frontend and backend allows for independent scaling and maintenance, while the use of managed services reduces operational overhead.

Regular monitoring and maintenance ensure optimal performance and security for production users.
