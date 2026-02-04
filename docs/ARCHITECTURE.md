# Architecture Documentation

## System Overview

The AI Job Application Tracker is a full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with AI-powered features integrated through Google's Generative AI API.

## High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React)       │◄──►│   (Express)     │◄──►│  (MongoDB)      │
│                 │    │                 │    │                 │
│ - UI Components │    │ - REST API      │    │ - User Data     │
│ - State Mgmt    │    │ - Auth          │    │ - Applications  │
│ - Routing       │    │ - AI Integration│    │ - Documents     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│ External APIs   │◄─────────────┘
                        │                 │
                        │ - Google AI     │
                        │ - Job Boards    │
                        │ - Email Service │
                        └─────────────────┘
```

## Frontend Architecture

### Component Structure

```
src/
├── components/                    # Reusable UI components
│   ├── AddJobModal.js           # Modal component for adding new job applications
│   │   # Handles form submission for new applications
│   │   # Integrates with application service for API calls
│   │   # Provides validation and error handling
│   ├── ApplicationCharts.js     # Charts and analytics visualization component
│   │   # Renders various chart types (pie, donut, bar)
│   │   # Displays application statistics and trends
│   │   # Integrates with analytics data
│   ├── ApplicationDetailModal.js # Modal for detailed application view
│   │   # Shows comprehensive application information
│   │   # Allows inline editing of application details
│   │   # Displays timeline and notes
│   ├── DonutChart.js            # Donut chart component for circular data
│   │   # Reusable donut chart implementation
│   │   # Used for status distribution visualization
│   │   # Supports custom colors and labels
│   ├── JobCard.js               # Card component for displaying job applications
│   │   # Shows application summary information
│   │   # Provides quick action buttons
│   │   # Handles status updates and deletions
│   ├── MainLayout.js            # Main application layout wrapper
│   │   # Provides consistent layout structure
│   │   # Includes header, sidebar, and content areas
│   │   # Handles responsive design
│   ├── PieChart.js              # Pie chart component for data visualization
│   │   # Reusable pie chart implementation
│   │   # Used for analytics and statistics
│   │   # Supports interactive tooltips
│   ├── ProfessionalLayout.js    # Professional layout variant
│   │   # Alternative layout for professional users
│   │   # Enhanced features and styling
│   │   # Optimized for desktop viewing
│   ├── ProtectedRoute.js        # Route protection wrapper component
│   │   # Implements authentication guards
│   │   # Redirects unauthenticated users
│   │   # Protects sensitive routes
│   ├── ResumeManager.js         # Resume management and upload component
│   │   # Handles resume file uploads
│   │   # Provides resume preview functionality
│   │   # Integrates with AI analysis features
│   ├── Sidebar.js               # Navigation sidebar component
│   │   # Provides main navigation menu
│   │   # Shows active route highlighting
│   │   # Includes user profile section
│   └── StatsCard.js             # Statistics display card component
│       # Shows key metrics and KPIs
│       # Supports trend indicators
│       # Provides animated counters
├── pages/                       # Page-level components
│   ├── AddApplication.js        # Add new job application page
│   │   # Comprehensive form for new applications
│   │   # Includes job details and notes sections
│   │   # Integrates with AI for suggestions
│   ├── Analytics.js             # Analytics and insights dashboard
│   │   # Displays comprehensive application analytics
│   │   # Shows success rates and trends
│   │   # Provides interactive charts and filters
│   ├── ApplicationDetail.js     # Detailed application view page
│   │   # Shows complete application information
│   │   # Includes timeline and communication history
│   │   # Provides editing and management options
│   ├── ApplicationsList.js      # List all applications page
│   │   # Displays paginated list of applications
│   │   # Provides search, filter, and sort functionality
│   │   # Supports bulk operations
│   ├── CompleteProfile.js       # User profile completion page
│   │   # Guides users through profile setup
│   │   # Collects skills, experience, and preferences
│   │   # Validates required information
│   ├── CoverLetters.js          # Cover letters management page
│   │   # Lists all generated cover letters
│   │   # Provides editing and customization options
│   │   # Integrates with AI generation features
│   ├── Dashboard.js             # Main dashboard page
│   │   # Shows overview of job search progress
│   │   # Displays recent applications and statistics
│   │   # Provides quick access to key features
│   ├── Documents.js             # Document management page
│   │   # Manages resumes and cover letters
│   │   # Provides file upload and organization
│   │   # Includes document preview functionality
│   ├── InterviewPrep.js         # Interview preparation page
│   │   # Provides AI-generated interview questions
│   │   # Offers answer suggestions and tips
│   │   # Includes practice resources
│   ├── LandingPage.js           # Landing/marketing page
│   │   # Marketing and informational content
│   │   # Feature highlights and benefits
│   │   # Call-to-action for registration
│   ├── Login.js                 # User login page
│   │   # Authentication form for existing users
│   │   # Includes password recovery options
│   │   # Integrates with JWT authentication
│   ├── Profile.js               # User profile page
│   │   # Displays and edits user profile information
│   │   # Manages skills and experience
│   │   # Includes preference settings
│   ├── Register.js              # User registration page
│   │   # New user account creation form
│   │   # Includes email validation
│   │   # Sets up initial profile data
│   ├── ResumeAnalyzer.js        # Resume analysis page
│   │   # AI-powered resume analysis tools
│   │   # Provides optimization suggestions
│   │   # Compares against job descriptions
│   ├── Resumes.js               # Resumes management page
│   │   # Lists and manages uploaded resumes
│   │   # Provides version control
│   │   # Includes AI analysis integration
│   ├── Settings.js              # Application settings page
│   │   # Manages user preferences and settings
│   │   # Includes notification configurations
│   │   # Provides account management options
│   └── SuccessAnalyzer.js       # Success analysis page
│       # Analyzes application success patterns
│       # Provides improvement recommendations
│       # Shows success probability metrics
├── services/                    # API service layer
│   ├── aiService.js             # AI features service
│   │   # Integrates with Google Generative AI
│   │   # Handles resume analysis and optimization
│   │   # Provides cover letter generation
│   │   # Offers interview question suggestions
│   ├── api.js                   # Base API configuration
│   │   # Sets up Axios instance with defaults
│   │   # Handles request/response interceptors
│   │   # Manages error handling globally
│   ├── applicationService.js    # Application CRUD operations service
│   │   # Handles all application API calls
│   │   # Provides create, read, update, delete operations
│   │   # Includes search and filter functionality
│   ├── authService.js           # Authentication service
│   │   # Handles user login and registration
│   │   # Manages JWT token storage and refresh
│   │   # Provides password reset functionality
│   ├── documentService.js       # Document management service
│   │   # Handles file upload and download
│   │   # Manages resume and cover letter storage
│   │   # Provides document preview functionality
│   ├── siteStatsService.js      # Site statistics service
│   │   # Fetches application and user statistics
│   │   # Provides analytics data for dashboard
│   │   # Handles site-wide metrics
│   └── userService.js           # User management service
│       # Handles user profile operations
│       # Manages user preferences and settings
│       # Provides user data synchronization
├── store/                       # Redux state management
│   ├── aiSlice.js               # AI features state slice
│   │   # Manages AI-related application state
│   │   # Handles loading states for AI operations
│   │   # Stores AI analysis results and suggestions
│   ├── applicationsSlice.js     # Applications state slice
│   │   # Manages applications array state
│   │   # Handles CRUD operation states
│   │   # Provides selectors for filtered applications
│   ├── authSlice.js             # Authentication state slice
│   │   # Manages user authentication state
│   │   # Handles login/logout states
│   │   # Stores user token and profile data
│   ├── store.js                 # Redux store configuration
│   │   # Configures Redux store with slices
│   │   # Sets up middleware and dev tools
│   │   # Provides store instance to app
│   └── userSlice.js             # User state slice
│       # Manages user profile state
│       # Handles user preferences
│       # Stores user settings and configuration
├── App.js                       # Main application component
│   # Sets up routing configuration
│   # Provides theme and context providers
│   # Handles global state and layout
├── index.css                    # Global CSS styles
│   # Defines global styles and resets
│   # Includes custom CSS variables
│   # Provides base styling rules
├── index.js                     # Application entry point
│   # Renders React app to DOM
│   # Sets up service worker
│   # Initializes global configurations
└── theme.js                     # Material-UI theme configuration
    # Defines color palette and typography
    # Provides theme customizations
    # Sets up component styling defaults
```

### State Management

**Redux Store Structure:**
```javascript
{
  auth: {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false
  },
  applications: {
    applications: [],
    currentApplication: null,
    isLoading: false,
    error: null,
    createSuccess: false,
    updateSuccess: false,
    deleteSuccess: false
  }
}
```

### Data Flow

```
User Action → Component → Redux Action → API Call → Redux Reducer → Component Re-render
```

**Example Flow:**
1. User clicks "Add Application"
2. Component dispatches `createApplication` action
3. Redux thunk calls API service
4. Service makes HTTP request to backend
5. Backend processes request and returns response
6. Redux updates state with new application
7. Components re-render with updated data

## Backend Architecture

### Directory Structure

```
server/
├── controllers/                 # Request handler functions
│   ├── aiController.js         # AI features controller
│   │   # Handles resume analysis requests
│   │   # Manages cover letter generation
│   │   # Provides interview question suggestions
│   │   # Calculates success probability
│   ├── analyticsController.js  # Analytics data controller
│   │   # Fetches application statistics
│   │   # Calculates success rates
│   │   # Provides trend analysis
│   │   # Generates reports
│   ├── applicationController.js # Application CRUD controller
│   │   # Handles create, read, update, delete operations
│   │   # Manages application status updates
│   │   # Provides search and filter functionality
│   │   # Handles timeline management
│   ├── authController.js       # Authentication controller
│   │   # Handles user registration and login
│   │   # Manages JWT token generation
│   │   # Provides password reset functionality
│   │   # Validates user credentials
│   ├── documentController.js   # Document management controller
│   │   # Handles file upload operations
│   │   # Manages resume and cover letter storage
│   │   # Provides document preview functionality
│   │   # Handles file deletion and organization
│   └── userController.js       # User management controller
│       # Handles user profile operations
│       # Manages user preferences
│       # Provides user statistics
│       # Handles account settings
├── middleware/                  # Custom middleware functions
│   └── auth.js                 # JWT authentication middleware
│       # Validates JWT tokens
│       # Protects sensitive routes
│       # Handles token refresh
│       # Provides user context
├── models/                      # MongoDB data models
│   ├── Analytics.js            # Analytics data model
│   │   # Stores application analytics
│   │   # Tracks success rates and trends
│   │   # Provides performance metrics
│   │   # Includes user engagement data
│   ├── Application.js          # Job application model
│   │   # Stores job application details
│   │   # Includes company and position information
│   │   # Tracks application status and timeline
│   │   # Stores AI insights and recommendations
│   ├── CoverLetter.js          # Cover letter model
│   │   # Stores generated cover letters
│   │   # Links to specific applications
│   │   # Includes customization options
│   │   # Tracks usage statistics
│   ├── Job.js                   # Job posting model
│   │   # Stores job posting information
│   │   # Includes company details and requirements
│   │   # Tracks job source and posting date
│   │   # Provides job matching data
│   ├── Reminder.js             # Reminder model
│   │   # Stores follow-up reminders
│   │   # Includes interview schedules
│   │   # Tracks notification preferences
│   │   # Provides reminder history
│   ├── Resume.js                # Resume model
│   │   # Stores uploaded resume files
│   │   # Includes resume content and metadata
│   │   # Links to user profiles
│   │   # Tracks AI analysis results
│   ├── SiteStats.js            # Site statistics model
│   │   # Stores site-wide usage statistics
│   │   # Tracks user registration and activity
│   │   # Provides performance metrics
│   │   # Includes system health data
│   └── User.js                  # User account model
│       # Stores user account information
│       # Includes profile details and preferences
│       # Tracks authentication data
│       # Provides user activity history
├── routes/                      # API route definitions
│   ├── ai.js                    # AI features routes
│   │   # POST /api/ai/analyze-resume
│   │   # POST /api/ai/generate-cover-letter
│   │   # POST /api/ai/interview-questions
│   │   # POST /api/ai/success-probability
│   ├── analytics.js             # Analytics routes
│   │   # GET /api/analytics/dashboard
│   │   # GET /api/analytics/trends
│   │   # GET /api/analytics/reports
│   │   # POST /api/analytics/export
│   ├── applications.js          # Application CRUD routes
│   │   # GET /api/applications
│   │   # POST /api/applications
│   │   # GET /api/applications/:id
│   │   # PUT /api/applications/:id
│   │   # DELETE /api/applications/:id
│   ├── auth.js                  # Authentication routes
│   │   # POST /api/auth/register
│   │   # POST /api/auth/login
│   │   # GET /api/auth/me
│   │   # POST /api/auth/forgot-password
│   │   # POST /api/auth/reset-password
│   ├── documents.js             # Document management routes
│   │   # POST /api/documents/upload
│   │   # GET /api/documents
│   │   # GET /api/documents/:id
│   │   # DELETE /api/documents/:id
│   │   # GET /api/documents/:id/preview
│   ├── siteStats.js             # Site statistics routes
│   │   # GET /api/site-stats/overview
│   │   # GET /api/site-stats/users
│   │   # GET /api/site-stats/applications
│   │   # GET /api/site-stats/performance
│   └── user.js                  # User management routes
│       # GET /api/user/profile
│       # PUT /api/user/profile
│       # GET /api/user/preferences
│       # PUT /api/user/preferences
│       # DELETE /api/user/account
├── services/                    # Business logic services
│   └── aiService.js             # AI integration service
│       # Integrates with Google Generative AI
│       # Handles prompt engineering
│       # Manages AI response processing
│       # Provides AI feature orchestration
├── uploads/                     # File upload storage
│   ├── cover-letters/           # Uploaded cover letters
│   │   # Stores generated cover letter files
│   │   # Organized by user ID
│   │   # Includes version control
│   │   # Provides file metadata
│   ├── profile/                 # User profile images
│   │   # Stores user profile pictures
│   │   # Organized by user ID
│   │   # Includes image optimization
│   │   # Provides thumbnail generation
│   └── resumes/                 # Uploaded resumes
│       # Stores resume document files
│       # Supports multiple file formats
│       # Organized by user ID
│       # Includes text extraction
├── package.json                 # Backend dependencies and scripts
│   # Defines Node.js dependencies
│   # Includes build and start scripts
│   # Provides project metadata
│   # Configures development tools
├── package-lock.json            # Locked dependency versions
│   # Ensures reproducible builds
│   # Locks exact dependency versions
│   # Provides security audit data
│   # Includes dependency tree
└── server.js                    # Main server entry point
    # Configures Express application
    # Sets up middleware and routes
    # Handles database connections
    # Provides error handling and logging
```

### API Architecture

**RESTful API Design:**
```
Authentication:
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

Applications:
GET    /api/applications
POST   /api/applications
GET    /api/applications/:id
PUT    /api/applications/:id
DELETE /api/applications/:id

AI Features:
POST   /api/ai/analyze-resume
POST   /api/ai/generate-cover-letter
POST   /api/ai/interview-questions
POST   /api/ai/success-probability

Documents:
POST   /api/documents/upload
GET    /api/documents
DELETE /api/documents/:id
```

### Middleware Stack

```javascript
// Middleware execution order
app.use(cors());                    // CORS handling
app.use(express.json());           // JSON parsing
app.use(express.urlencoded());     // URL encoding
app.use('/api/auth', authRoutes);  // Auth routes
app.use('/api', authMiddleware);   // JWT authentication
app.use('/api/applications', applicationRoutes);
app.use('/api/ai', aiRoutes);
app.use(errorHandler);             // Error handling
```

## Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String, // hashed
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    location: String,
    summary: String,
    experience: [{
      company: String,
      position: String,
      duration: String,
      description: String
    }],
    education: [{
      institution: String,
      degree: String,
      year: String
    }],
    skills: [String]
  },
  preferences: {
    jobTitles: [String],
    locations: [String],
    jobTypes: [String],
    salaryRange: {
      min: Number,
      max: Number
    }
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Application Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  company: String,
  position: String,
  location: String,
  jobUrl: String,
  salary: String,
  status: String, // Applied, Interview, Offer, Rejected
  notes: String,
  timeline: [{
    action: String,
    date: Date,
    notes: String
  }],
  documents: [{
    type: String, // resume, coverLetter
    url: String,
    uploadedAt: Date
  }],
  successProbability: Number,
  aiInsights: {
    matchScore: Number,
    missingSkills: [String],
    recommendations: [String]
  },
  appliedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Document Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  type: String, // resume, coverLetter
  url: String,
  content: String, // extracted text
  uploadedAt: Date,
  isDefault: Boolean
}
```

## AI Integration Architecture

### Google Generative AI Integration

```javascript
// AI Service Architecture
class AIService {
  async analyzeResume(resumeText, jobDescription) {
    const prompt = `
      Analyze this resume against the job description:
      Resume: ${resumeText}
      Job Description: ${jobDescription}
      
      Provide:
      1. Match score (0-100)
      2. Missing skills
      3. Recommendations
    `;
    
    const response = await geminiModel.generateContent(prompt);
    return this.parseAIResponse(response);
  }
}
```

### AI Features Flow

```
User Input → Frontend → Backend → AI Service → Google AI → Response → Backend → Frontend → UI Update
```

**AI Features:**
1. **Resume Analysis**: Compares resume against job descriptions
2. **Cover Letter Generation**: Creates customized cover letters
3. **Interview Questions**: Predicts likely interview questions
4. **Success Probability**: Analyzes application success chances

## Security Architecture

### Authentication Flow

```
1. User Registration
   Frontend → POST /api/auth/register → Hash Password → Save User → Return Token

2. User Login
   Frontend → POST /api/auth/login → Validate Credentials → Generate JWT → Return Token

3. Protected Routes
   Frontend → API Call + JWT → Backend Middleware → Verify Token → Process Request
```

### Security Measures

1. **Password Security**
   - bcrypt hashing with salt rounds
   - Minimum password requirements

2. **JWT Security**
   - Short expiration times
   - Secure token storage

3. **API Security**
   - CORS configuration
   - Rate limiting
   - Input validation

4. **Data Protection**
   - Environment variables for secrets
   - HTTPS in production
   - Input sanitization

## Performance Architecture

### Frontend Optimization

1. **Code Splitting**
   ```javascript
   const Dashboard = lazy(() => import('./pages/Dashboard'));
   const Applications = lazy(() => import('./pages/ApplicationsList'));
   ```

2. **State Optimization**
   - Redux Toolkit for efficient state updates
   - Memoization with React.memo
   - Virtual scrolling for large lists

3. **Asset Optimization**
   - Image optimization
   - Bundle size analysis
   - Tree shaking

### Backend Optimization

1. **Database Optimization**
   ```javascript
   // MongoDB indexes
   db.applications.createIndex({ "userId": 1, "createdAt": -1 });
   db.applications.createIndex({ "status": 1 });
   db.users.createIndex({ "email": 1 });
   ```

2. **Caching Strategy**
   - In-memory caching for frequent queries
   - API response caching where appropriate

3. **API Optimization**
   - Pagination for large datasets
   - Selective field queries
   - Connection pooling

## Scalability Architecture

### Horizontal Scaling

1. **Frontend Scaling**
   - CDN distribution (Vercel Edge Network)
   - Static asset caching
   - Load balancing

2. **Backend Scaling**
   - Stateless API design
   - Load balancer ready
   - Database connection pooling

3. **Database Scaling**
   - Read replicas for read-heavy operations
   - Sharding capability
   - Index optimization

### Microservices Preparation

The architecture is designed to easily split into microservices:

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Auth Service   │  │ Application     │  │   AI Service    │
│                 │  │ Service         │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   API Gateway   │
                    └─────────────────┘
```

## Error Handling Architecture

### Frontend Error Handling

```javascript
// Error Boundary Component
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to service like Sentry
  }
}

// Global Error Handler
const handleGlobalError = (error) => {
  console.error('Global error:', error);
  // Show user-friendly message
};
```

### Backend Error Handling

```javascript
// Centralized Error Handler
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};
```

## Monitoring and Logging

### Frontend Monitoring

1. **Performance Monitoring**
   - Component render times
   - API response times
   - User interaction tracking

2. **Error Tracking**
   - JavaScript errors
   - API failures
   - User session errors

### Backend Monitoring

1. **Application Logging**
   ```javascript
   const winston = require('winston');
   
   const logger = winston.createLogger({
     level: 'info',
     format: winston.format.json(),
     transports: [
       new winston.transports.File({ filename: 'error.log', level: 'error' }),
       new winston.transports.File({ filename: 'combined.log' })
     ]
   });
   ```

2. **API Metrics**
   - Request/response times
   - Error rates
   - Database query performance

## Deployment Architecture

### Development Environment
```
Local Machine:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Database: Local MongoDB
```

### Production Environment
```
Cloud Infrastructure:
- Frontend: Vercel (CDN)
- Backend: Render (PaaS)
- Database: MongoDB Atlas (Cloud DB)
- Monitoring: Vercel Analytics + Render Metrics
```

## Technology Rationale

### Frontend Technology Choices

1. **React.js**
   - Component-based architecture
   - Large ecosystem and community
   - Excellent performance with hooks

2. **Redux Toolkit**
   - Predictable state management
   - Excellent dev tools
   - Simplified Redux patterns

3. **Tailwind CSS**
   - Utility-first CSS
   - Rapid development
   - Consistent design system

### Backend Technology Choices

1. **Node.js + Express**
   - JavaScript full-stack
   - Excellent performance
   - Rich ecosystem

2. **MongoDB**
   - Flexible schema
   - Excellent with Node.js
   - Scalable solution

3. **JWT Authentication**
   - Stateless authentication
   - Excellent for APIs
   - Industry standard

## Future Architecture Considerations

### Planned Enhancements

1. **Real-time Features**
   - WebSocket integration
   - Live notifications
   - Real-time collaboration

2. **Advanced AI Features**
   - Machine learning models
   - Personalized recommendations
   - Advanced analytics

3. **Mobile Application**
   - React Native development
   - Offline capabilities
   - Push notifications

### Architecture Evolution

The current architecture is designed to evolve with the application's needs:

1. **Phase 1**: Current monolithic structure
2. **Phase 2**: Microservices split
3. **Phase 3**: Event-driven architecture
4. **Phase 4**: Full microservices with message queues

This architecture provides a solid foundation for the AI Job Application Tracker while maintaining flexibility for future growth and enhancements.
