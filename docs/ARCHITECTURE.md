# System Architecture - AI Job Application Tracker

## Architecture Overview

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer (React)                      │
├─────────────────────────────────────────────────────────────────┤
│  Dashboard │ Applications │ Profile │ Interview Prep │ AI Tools │
│          Redux Store (Global State Management)                  │
│          Redux Toolkit Slices (Auth, Applications, AI)          │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                   ┌─────────▼────────────┐
                   │  Axios HTTP Client   │
                   │  (API Communication) │
                   └─────────┬────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────────┐  ┌─────────────────┐  ┌──────────────┐
│  Express Server  │  │  Google Gemini  │  │   MongoDB    │
│  (API Routes)    │  │  (AI Services)  │  │  (Database)  │
└──────────────────┘  └─────────────────┘  └──────────────┘
```

## Detailed Component Architecture

### 1. Frontend Architecture (React)

#### Component Hierarchy

```
App.js (Root)
├── AuthSlice (Redux)
│   ├── ProfessionalLogin
│   ├── Register
│   └── ProtectedRoute
├── ProfessionalLayout (Master)
│   ├── Sidebar Navigation
│   ├── Header
│   └── Routes
│       ├── Dashboard
│       │   └── Analytics Components
│       ├── ProfessionalApplications
│       │   └── Application Table & Dialogs
│       ├── ApplicationDetail
│       │   ├── Timeline
│       │   ├── Communication History
│       │   └── Notes
│       ├── InterviewPrep
│       │   ├── Question Generator
│       │   └── Feedback Component
│       ├── CoverLetters
│       │   └── Letter Generator & Manager
│       ├── Resumes
│       │   └── Resume Optimizer
│       └── Profile
│           └── User Settings

State Management (Redux Store)
├── authSlice
│   ├── user
│   ├── token
│   └── isAuthenticated
├── applicationsSlice
│   ├── applications[]
│   ├── selectedApplication
│   └── filter
├── aiSlice
│   ├── interviewQuestions[]
│   ├── coverLetter
│   ├── optimizedResume
│   └── isLoading
└── userSlice
    ├── profile
    ├── resumes[]
    └── preferences
```

#### Redux Store Structure

```javascript
{
  auth: {
    user: { id, name, email, token },
    isAuthenticated: boolean,
    isLoading: boolean,
    error: null
  },
  applications: {
    list: Application[],
    selectedId: string,
    filter: { status, search },
    isLoading: boolean
  },
  ai: {
    questions: string[],
    coverLetter: string,
    resumeOptimization: {},
    successAnalysis: {},
    isLoading: boolean
  },
  user: {
    profile: UserProfile,
    resumes: Resume[],
    coverLetters: CoverLetter[]
  }
}
```

#### Service Layer

```
services/
├── api.js (Axios instance & interceptors)
├── authService.js
│   ├── register()
│   ├── login()
│   └── logout()
├── userService.js
│   ├── getProfile()
│   ├── updateProfile()
│   └── manageResumes()
├── applicationService.js
│   ├── getApplications()
│   ├── createApplication()
│   ├── updateApplication()
│   └── getStatistics()
└── aiService.js
    ├── generateCoverLetter()
    ├── optimizeResume()
    ├── predictInterviewQuestions()
    └── analyzeSuccessProbability()
```

### 2. Backend Architecture (Node.js + Express)

#### API Layers

```
Express Server
├── Middleware Layer
│   ├── CORS
│   ├── Body Parser
│   ├── JWT Authentication
│   └── Error Handler
├── Route Layer
│   ├── /api/auth (3 endpoints)
│   ├── /api/user (10 endpoints)
│   ├── /api/applications (9 endpoints)
│   ├── /api/ai (5 endpoints)
│   └── /api/analytics (4 endpoints)
├── Controller Layer
│   ├── authController
│   ├── userController
│   ├── applicationController
│   ├── aiController
│   └── analyticsController
├── Service Layer
│   ├── ai.service.js (Gemini integration)
│   └── notification.service.js
├── Model Layer (Mongoose)
│   ├── User
│   ├── Application
│   ├── Job
│   ├── Reminder
│   └── Analytics
└── Middleware Layer
    └── auth.js (JWT verification)
```

#### Request Flow Diagram

```
HTTP Request
    │
    ▼
Express Middleware
    │
    ├─ CORS Check ──┐
    ├─ Body Parse ──┤
    └─ JWT Auth ────┘
    │
    ▼
Route Handler
    │
    ▼
Controller
    │
    ├─ Validation ──┐
    ├─ Business Logic
    └─ Service Call
    │
    ▼
Model/Database
    │
    ├─ MongoDB Operation
    └─ Data Transformation
    │
    ▼
HTTP Response
```

#### Database Schema

```
User Collection
├── _id: ObjectId
├── name: String
├── email: String (unique)
├── password: String (hashed)
├── skills: Array
├── experience: String
├── preferences: Object
├── resumes: Array
├── coverLetters: Array
├── goals: Object
└── timestamps: (createdAt, updatedAt)

Application Collection
├── _id: ObjectId
├── userId: ObjectId (ref: User)
├── jobId: ObjectId (ref: Job)
├── jobTitle: String
├── company: String
├── status: Enum
├── notes: Array
├── communicationHistory: Array
├── timeline: Array
├── followUpDate: Date
├── reminderSet: Boolean
├── successProbability: Number
└── timestamps

Analytics Collection
├── _id: ObjectId
├── userId: ObjectId (ref: User)
├── totalApplications: Number
├── statusBreakdown: Object
├── conversionRates: Object
├── weeklyActivity: Array
└── topCompanies: Array
```

### 3. AI Integration Architecture

#### Google Gemini API Integration

```
AI Request Flow:
    │
    ▼
aiController.js
    │
    ▼
aiService.js
    │
    ├─ promptBuilder() ──────┐
    ├─ apiCall()             │
    ├─ responseParser()      │
    └─ errorHandler() ───────┘
    │
    ▼
Google Gemini API
    │
    ├─ gemini-1.5-flash model
    └─ Streaming responses
    │
    ▼
Response Processing
    │
    ├─ JSON Parsing
    ├─ Fallback Handling
    └─ Caching (Optional)
    │
    ▼
Client Response
```

#### AI Features Breakdown

```
Resume Optimizer:
  Input: Resume Text + Job Description
  Output: { optimizedResume, changes, keywords, improvementScore }
  Processing Time: ~2-3s

Cover Letter Generator:
  Input: User Profile + Job Description
  Output: Professional Cover Letter Text
  Processing Time: ~2-4s

Interview Question Predictor:
  Input: Job Description + Question Type
  Output: 5 Interview Questions
  Processing Time: ~1-2s

Success Probability Analyzer:
  Input: User Profile + Job Description
  Output: { probability, strengths, weaknesses, recommendations }
  Processing Time: ~2-3s
```

### 4. Authentication & Security

#### JWT Authentication Flow

```
Login Request
    │
    ▼
Credentials Validation
    │
    ├─ Email exists? ──────┐
    ├─ Password match? ─────┤ (bcrypt compare)
    └─ Account active? ────┘
    │
    ▼
Generate JWT Token
    │
    ├─ Payload: { id, email, iat }
    ├─ Secret: process.env.JWT_SECRET
    ├─ Expiry: 30 days
    └─ Algorithm: HS256
    │
    ▼
Send Token to Client
    │
    ▼
Client Stores Token
    │
    └─ Redux State + localStorage
```

#### Protected Route Verification

```
Protected API Request
    │
    ▼
Authorization Header Check
    │
    ├─ Format: "Bearer <token>" ──┐
    └─ Token present? ────────────┘
    │
    ▼
JWT Verification (auth.js)
    │
    ├─ Signature valid?
    ├─ Token expired?
    ├─ User exists in DB?
    └─ Permissions correct?
    │
    ▼
Attach user to request
    │
    └─ req.user = { id, email }
```

### 5. Data Flow Patterns

#### Application Creation Flow

```
Client (Add Application Form)
    │
    ▼
Redux Action: createApplication()
    │
    ▼
API Call: POST /api/applications
    │
    ▼
Application Controller
    │
    ├─ Validate Input ──────┐
    ├─ Create Job Record ───┤
    ├─ Create Application ──┤
    └─ Populate Relations ──┘
    │
    ▼
MongoDB Insert
    │
    ▼
Response to Client
    │
    ▼
Redux Update
    │
    ▼
UI Re-render
```

#### Analytics Calculation Flow

```
Application Updates
    │
    ▼
Aggregation Pipeline Triggers
    │
    ├─ Count by Status ────┐
    ├─ Calculate Rates ─────┤
    ├─ Weekly Summary ──────┤
    └─ Trend Analysis ──────┘
    │
    ▼
Cache Results in Analytics Collection
    │
    ▼
Dashboard Query
    │
    ├─ Get cached data
    ├─ Format for charts
    └─ Send to frontend
    │
    ▼
Visualize Analytics
```

### 6. Deployment Architecture

#### Containerized Deployment (Optional)

```
Docker
├── Frontend Container
│   ├── Node.js Base Image
│   ├── React Build
│   └── Nginx Server
├── Backend Container
│   ├── Node.js Base Image
│   ├── Express Server
│   └── Port 5000
└── MongoDB
    ├── Cloud: MongoDB Atlas
    └── Local: Docker Container
```

#### Cloud Deployment (Render/Heroku)

```
GitHub Repository
    │
    ▼
Render/Heroku Webhook
    │
    ▼
Build Stage
    │
    ├─ npm install
    ├─ npm run build
    └─ Environment setup
    │
    ▼
Deploy Stage
    │
    ├─ Start server
    ├─ Health check
    └─ Route traffic
    │
    ▼
Live Application
    │
    └─ https://app.render.com
```

### 7. Error Handling Architecture

#### Error Processing Pipeline

```
Error Occurrence
    │
    ▼
Error Catch Block
    │
    ├─ Log Error (Winston/Morgan)
    ├─ Classify Severity
    └─ Extract Context
    │
    ▼
Error Handler Middleware
    │
    ├─ Validation Errors ──► 400 Bad Request
    ├─ Auth Errors ────────► 401 Unauthorized
    ├─ Permission Errors ──► 403 Forbidden
    ├─ Not Found ───────────► 404 Not Found
    ├─ Business Logic Errors ► 422 Unprocessable
    └─ Server Errors ──────► 500 Internal Error
    │
    ▼
Format Error Response
    │
    ├─ Status Code
    ├─ Error Message
    ├─ Error Code
    └─ Stack Trace (dev only)
    │
    ▼
Send to Client
    │
    ▼
Client Error Handler
    │
    ├─ Log to console
    ├─ Show user notification
    └─ Retry if applicable
```

### 8. Caching Strategy

#### Frontend Caching

```
Redux Store (In-Memory)
├── Applications List
├── User Profile
├── AI Responses (temporary)
└── 5-minute TTL

LocalStorage
├── Auth Token
├── User Preferences
└── Draft Data
```

#### Backend Caching (Future)

```
Redis Cache Layer (Optional)
├── User Sessions
├── AI Response Cache
├── Analytics Results
└── 1-hour TTL
```

### 9. Monitoring & Logging

#### Backend Logging

```
Morgan (HTTP Logging)
├── Request Method & URL
├── Response Status
├── Response Time
└── User IP

Winston (Application Logging)
├── Error Logs
├── Info Logs
├── Warnings
└── Database Queries
```

#### Frontend Monitoring (Optional)

```
Sentry Error Tracking
├── JavaScript Errors
├── Network Errors
├── User Sessions
└── Performance Metrics
```

### 10. Scalability Considerations

#### Horizontal Scaling

```
Load Balancer
    │
    ├─ Server Instance 1
    ├─ Server Instance 2
    ├─ Server Instance 3
    └─ Server Instance N
    │
    └─► MongoDB Atlas Cluster
```

#### Vertical Scaling

```
Node.js Process Management
├── PM2 Cluster Mode
├── Auto-restart on crash
├── Load balancing across cores
└── Memory monitoring
```

---

## Technology Decisions Rationale

| Component | Choice | Reason |
|-----------|--------|--------|
| Frontend | React | Component reusability, large community |
| State | Redux | Predictable state management |
| UI Library | Material-UI | Professional components, theming |
| Backend | Express | Minimal, flexible framework |
| Database | MongoDB | Flexible schema, scalability |
| AI | Google Gemini | Advanced capabilities, competitive pricing |
| Auth | JWT | Stateless, scalable |
| Testing | Jest | Comprehensive testing framework |

---

## Performance Optimization

1. **Lazy Loading:** Route-based code splitting
2. **Caching:** Redis for AI responses
3. **Database Indexing:** On frequently queried fields
4. **API Pagination:** Large datasets in chunks
5. **Image Optimization:** CDN for static assets
6. **Compression:** gzip for responses
7. **Minification:** Production builds optimized

---

**Architecture Last Updated:** February 2, 2026
