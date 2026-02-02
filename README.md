# AI Job Application Tracker

A production-grade MERN web application that helps job seekers track their applications and leverage AI tools for optimization. Built with a professional SaaS-grade interface using Material-UI.

## Features

### Authentication System
- **Professional Login/Signup** with Material-UI components
- **JWT Authentication** with secure token management
- **Protected Routes** with automatic redirect
- **Google OAuth Ready** (implementation structure in place)

### Application Management
- **Professional Dashboard** with real-time analytics
- **Advanced Applications Table** with filtering and search
- **Status Tracking** (Applied, Interview, Offer, Rejected)
- **Timeline Management** with follow-up reminders
- **Detailed Application Views** with comprehensive information

### AI-Powered Tools
- **Resume Analyzer** - AI-powered resume scoring with section-by-section analysis, ATS compatibility score, and actionable improvement suggestions
- **Cover Letter Generator** - Generate personalized, professional cover letters tailored to specific job applications
- **Interview Coach** - AI-generated interview questions (behavioral, technical, situational) with real-time feedback on your answers
- **Success Probability Analyzer** - Comprehensive AI analysis of your profile vs job requirements with match scoring and recommendations
- **Resume Optimizer** - AI-enhanced resume improvement with keyword optimization

### Professional UI/UX
- **Material-UI Design System** with professional theme
- **Responsive Design** for all devices
- **Modern Landing Page** with marketing sections
- **Professional Sidebar Navigation** with user profile
- **Smooth Animations** and micro-interactions

### Analytics & Insights
- **Application Funnel Visualization**
- **Response Rate Tracking**
- **Interview Statistics**
- **Success Metrics Dashboard**

## Tech Stack

### Frontend (React)
- **React.js 18.2.0** with Hooks
- **Material-UI 7.3.7** for professional UI components
- **Redux Toolkit** for state management
- **React Router DOM** for navigation
- **Axios** for API communication
- **Emotion** for styling
- **Date-fns** for date handling

### Backend (Node.js)
- **Node.js** with Express.js
- **MongoDB Atlas** with Mongoose ODM
- **JWT Authentication** with bcryptjs
- **Environment Variables** with dotenv
- **Express Validator** for input validation

### AI Integration
- **Google Gemini 3 Flash API** for AI features
- **Custom AI Service** with error handling
- **JSON Response Parsing** for structured outputs

## Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB Atlas** account (recommended)
- **Google Gemini API** key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd JobO
   ```

2. **Install dependencies**
   ```bash
   # Server dependencies
   cd server
   npm install

   # Client dependencies  
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Root directory environment
   cp .env.example .env
   
   # Client environment
   cp client/.env.example client/.env
   ```

4. **Configure environment variables**

   **Root `.env` file:**
   ```bash
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
   JWT_SECRET=your-super-secret-jwt-key-for-development
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

   **Client `.env` file:**
   ```bash
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. **Start the application**
   ```bash
   # Terminal 1 - Start server (port 5000)
   cd server
   node server.js

   # Terminal 2 - Start client (port 3000)
   cd client
   npm start
   ```

6. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5000/api

## Project Structure

```
JobO/
├── .env                    # Server environment variables
├── .env.example           # Environment template
├── .gitignore             # Git ignore rules
├── README.md              # This file
├── DEPLOYMENT.md          # Deployment guide
├── client/                # React frontend
│   ├── .env               # Client environment
│   ├── .env.example       # Client env template
│   ├── package.json       # Client dependencies
│   ├── public/            # Static assets
│   │   └── index.html     # HTML template
│   └── src/               # React source code
│       ├── App.js          # Main App component
│       ├── index.js        # Entry point
│       ├── theme.js        # Material-UI theme
│       ├── components/     # Reusable components
│       │   ├── ProfessionalLayout.js
│       │   └── ProtectedRoute.js
│       ├── pages/          # Page components
│       │   ├── LandingPage.js
│       │   ├── ProfessionalLogin.js
│       │   ├── ProfessionalDashboard.js
│       │   ├── ProfessionalApplications.js
│       │   ├── AddApplication.js
│       │   ├── ApplicationDetail.js
│       │   ├── Resumes.js
│       │   ├── ResumeAnalyzer.js      # AI Resume Analysis
│       │   ├── CoverLetters.js        # AI Cover Letter Generator
│       │   ├── InterviewPrep.js       # AI Interview Coach
│       │   ├── SuccessAnalyzer.js     # AI Success Probability
│       │   ├── Profile.js
│       │   ├── CompleteProfile.js
│       │   └── Register.js
│       ├── services/       # API services
│       │   ├── api.js
│       │   ├── authService.js
│       │   ├── userService.js
│       │   ├── applicationService.js
│       │   └── aiService.js
│       └── store/          # Redux store
│           ├── store.js
│           ├── authSlice.js
│           ├── userSlice.js
│           ├── applicationsSlice.js
│           └── aiSlice.js
└── server/                # Express backend
    ├── server.js           # Main server file
    ├── package.json        # Server dependencies
    ├── config/             # Configuration
    │   └── db.js           # Database connection
    ├── controllers/        # Route controllers
    │   ├── authController.js
    │   ├── userController.js
    │   ├── applicationController.js
    │   └── aiController.js
    ├── middleware/          # Custom middleware
    │   └── auth.js         # JWT authentication
    ├── models/             # Mongoose models
    │   ├── User.js
    │   ├── Job.js
    │   └── Application.js
    ├── routes/             # API routes
    │   ├── auth.js
    │   ├── user.js
    │   ├── applications.js
    │   └── ai.js
    └── services/           # Business logic
        └── ai.service.js    # AI integration
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Application Management
- `POST /api/applications` - Create new application
- `GET /api/applications` - Get all applications
- `GET /api/applications/:id` - Get specific application
- `PUT /api/applications/:id` - Update application

### AI Tools
- `POST /api/ai/analyze-resume` - AI resume analysis with scoring
- `POST /api/ai/resume` - Optimize resume for specific job
- `POST /api/ai/cover-letter` - Generate cover letter
- `POST /api/ai/interview` - Generate interview questions
- `POST /api/ai/feedback` - Get AI feedback on interview answers
- `POST /api/ai/success` - Analyze success probability

## UI Components

### Professional Layout
- **Modern Sidebar** with navigation and user profile
- **Responsive Header** with search and notifications
- **Professional Cards** with shadows and hover effects
- **Material-UI Theme** with custom color palette

### Pages
- **Landing Page** - Marketing page with hero section showcasing AI features
- **Login/Register** - Professional authentication forms
- **Dashboard** - Analytics, quick actions, and AI tools showcase
- **Applications** - Advanced table with filtering and search
- **Application Detail** - Comprehensive application view
- **Resume Analyzer** - AI-powered resume scoring and suggestions
- **Cover Letters** - AI cover letter generator
- **Interview Prep** - AI interview coach with practice questions
- **Success Analyzer** - AI job match probability analysis
- **Profile** - User settings and preferences

## Development

### Available Scripts
```bash
# Server
npm start              # Start production server
npm run dev           # Start with nodemon

# Client
npm start             # Start development server
npm run build         # Build for production
npm test              # Run tests
```

### Environment Variables
- **MONGO_URI** - MongoDB connection string
- **JWT_SECRET** - JWT signing secret
- **GEMINI_API_KEY** - Google Gemini API key
- **REACT_APP_API_URL** - Frontend API endpoint

## Deployment

### Production Deployment
1. **Build the client**
   ```bash
   cd client
   npm run build
   ```

2. **Set production environment variables**
   ```bash
   NODE_ENV=production
   MONGO_URI=your-production-mongodb-uri
   JWT_SECRET=your-production-jwt-secret
   GEMINI_API_KEY=your-production-gemini-key
   ```

3. **Start the server**
   ```bash
   cd server
   npm start
   ```

### Database Setup
- **MongoDB Atlas** (Recommended for production)
- **Local MongoDB** (For development)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the deployment guide
- Review the API documentation

---

**Built with using React, Node.js, MongoDB, and Material-UI**
