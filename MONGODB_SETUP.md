# MongoDB Atlas Setup Instructions

## Current Issue
The application is getting a **MongoDB connection error** because your current IP address is not whitelisted in MongoDB Atlas.

## Solution: Add Your IP to MongoDB Atlas Whitelist

### Steps:

1. **Visit MongoDB Atlas**: Go to https://cloud.mongodb.com/
2. **Login** to your account
3. **Select your cluster**: Navigate to the cluster: `job-tracker-db`
4. **Network Access**:
   - Click on "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Choose one of these options:
     - **Add Current IP Address** (recommended for secure access)
     - **Allow Access from Anywhere** (0.0.0.0/0) - For development only, NOT recommended for production

5. **Wait**: IP whitelist changes take 1-2 minutes to propagate
6. **Restart**: Your backend server should automatically reconnect

## Alternative: Use Local MongoDB

If you prefer not to use MongoDB Atlas:

### Install MongoDB Community Edition:

**Windows**:
```powershell
# Using Chocolatey
choco install mongodb

# Or download from https://www.mongodb.com/try/download/community
```

**Start MongoDB**:
```powershell
# Start MongoDB service
net start MongoDB

# Or run mongod directly
mongod --dbpath C:\data\db
```

### Update .env:
```
MONGO_URI=mongodb://localhost:27017/ai-job-tracker
```

## Verify Connection

Once MongoDB is accessible, you should see in your server terminal:
```
MongoDB connected successfully
Server running on port 5000
```

## Current Connection String

Your MongoDB Atlas connection details are in `/server/.env`:
```
MONGO_URI=mongodb+srv://ai_job_tracker_db_user:...@job-tracker-db.camtlwf.mongodb.net/...
```
