# AI Job Application Tracker

An intelligent job application management system that helps job seekers organize their applications, optimize resumes for specific positions, prepare for interviews, and track their overall job search progress with AI-powered insights and recommendations.

## Live Demo

- **Frontend**: https://job-o-ai.vercel.app
- **Backend**: https://jobo-qa81.onrender.com
- **GitHub Repository**: https://github.com/Evil-Dreams/JobO

## Features

### Core Features
- **User Authentication**: Secure signup/login with JWT
- **Application Management**: Track application status, set reminders, maintain notes
- **Progress Dashboard**: Visual tracking with analytics and insights
- **Responsive Design**: Professional, mobile-friendly interface

### AI-Powered Features
- **Resume Analyzer**: Job-specific optimization suggestions
- **Cover Letter Generator**: Customized cover letter creation
- **Interview Preparation**: Predicted questions and answer suggestions
- **Success Probability Analysis**: AI-driven success predictions
- **Job Recommendations**: Similar job suggestions based on preferences

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** for data storage
- **JWT** for authentication
- **Google Generative AI** for AI features
- **Multer** for file uploads
- **Node-cron** for scheduled tasks
- **Nodemailer** for notifications

### Frontend
- **React.js** with hooks
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **Material-UI** for components
- **Framer Motion** for animations
- **Lucide React** for icons
- **Axios** for API calls

### AI Tools Used in Development
- **Cascade AI** for code generation and debugging
- **GitHub Copilot** for code suggestions
- **ChatGPT** for documentation and problem-solving

## Project Structure

```
JobO/
├── client/                           # React frontend application
│   ├── public/                       # Static public assets
│   │   ├── index.html               # Main HTML template
│   │   ├── iblis_logo.png           # Application logo
│   │   └── manifest.json            # PWA manifest
│   ├── src/                         # Source code directory
│   │   ├── components/              # Reusable UI components
│   │   │   ├── AddJobModal.js       # Modal for adding new job applications
│   │   │   ├── ApplicationCharts.js # Charts and analytics components
│   │   │   ├── ApplicationDetailModal.js # Modal for application details
│   │   │   ├── DonutChart.js        # Donut chart component for statistics
│   │   │   ├── JobCard.js           # Card component for job applications
│   │   │   ├── MainLayout.js        # Main application layout wrapper
│   │   │   ├── PieChart.js          # Pie chart component
│   │   │   ├── ProfessionalLayout.js # Professional layout component
│   │   │   ├── ProtectedRoute.js    # Route protection wrapper
│   │   │   ├── ResumeManager.js     # Resume management component
│   │   │   ├── Sidebar.js           # Navigation sidebar component
│   │   │   └── StatsCard.js         # Statistics display card
│   │   ├── pages/                   # Page-level components
│   │   │   ├── AddApplication.js    # Add new application page
│   │   │   ├── Analytics.js         # Analytics and insights page
│   │   │   ├── ApplicationDetail.js # Detailed application view page
│   │   │   ├── ApplicationsList.js  # List all applications page
│   │   │   ├── CompleteProfile.js   # User profile completion page
│   │   │   ├── CoverLetters.js      # Cover letters management page
│   │   │   ├── Dashboard.js         # Main dashboard page
│   │   │   ├── Documents.js         # Document management page
│   │   │   ├── InterviewPrep.js     # Interview preparation page
│   │   │   ├── LandingPage.js       # Landing/marketing page
│   │   │   ├── Login.js             # User login page
│   │   │   ├── Profile.js           # User profile page
│   │   │   ├── Register.js          # User registration page
│   │   │   ├── ResumeAnalyzer.js    # Resume analysis page
│   │   │   ├── Resumes.js           # Resumes management page
│   │   │   ├── Settings.js          # Application settings page
│   │   │   └── SuccessAnalyzer.js   # Success analysis page
│   │   ├── services/                # API service layer
│   │   │   ├── aiService.js         # AI features service
│   │   │   ├── api.js               # Base API configuration
│   │   │   ├── applicationService.js # Application CRUD operations
│   │   │   ├── authService.js       # Authentication service
│   │   │   ├── documentService.js   # Document management service
│   │   │   ├── siteStatsService.js  # Site statistics service
│   │   │   └── userService.js       # User management service
│   │   ├── store/                   # Redux state management
│   │   │   ├── aiSlice.js           # AI features state slice
│   │   │   ├── applicationsSlice.js # Applications state slice
│   │   │   ├── authSlice.js         # Authentication state slice
│   │   │   ├── store.js             # Redux store configuration
│   │   │   └── userSlice.js         # User state slice
│   │   ├── App.js                   # Main application component
│   │   ├── index.css                # Global CSS styles
│   │   ├── index.js                 # Application entry point
│   │   └── theme.js                 # Material-UI theme configuration
│   ├── package.json                 # Frontend dependencies and scripts
│   ├── package-lock.json            # Locked dependency versions
│   ├── postcss.config.js            # PostCSS configuration
│   └── tailwind.config.js           # Tailwind CSS configuration
├── server/                           # Node.js backend application
│   ├── controllers/                  # Request handler functions
│   │   ├── aiController.js          # AI features controller
│   │   ├── analyticsController.js   # Analytics data controller
│   │   ├── applicationController.js # Application CRUD controller
│   │   ├── authController.js        # Authentication controller
│   │   ├── documentController.js    # Document management controller
│   │   └── userController.js        # User management controller
│   ├── middleware/                  # Custom middleware functions
│   │   └── auth.js                  # JWT authentication middleware
│   ├── models/                      # MongoDB data models
│   │   ├── Analytics.js             # Analytics data model
│   │   ├── Application.js           # Job application model
│   │   ├── CoverLetter.js           # Cover letter model
│   │   ├── Job.js                   # Job posting model
│   │   ├── Reminder.js              # Reminder model
│   │   ├── Resume.js                # Resume model
│   │   ├── SiteStats.js             # Site statistics model
│   │   └── User.js                  # User account model
│   ├── routes/                      # API route definitions
│   │   ├── ai.js                    # AI features routes
│   │   ├── analytics.js             # Analytics routes
│   │   ├── applications.js          # Application CRUD routes
│   │   ├── auth.js                  # Authentication routes
│   │   ├── documents.js             # Document management routes
│   │   ├── siteStats.js             # Site statistics routes
│   │   └── user.js                  # User management routes
│   ├── services/                    # Business logic services
│   │   └── aiService.js             # AI integration service
│   ├── uploads/                     # File upload storage
│   │   ├── cover-letters/           # Uploaded cover letters
│   │   ├── profile/                 # User profile images
│   │   └── resumes/                 # Uploaded resumes
│   ├── package.json                 # Backend dependencies and scripts
│   ├── package-lock.json            # Locked dependency versions
│   └── server.js                    # Main server entry point
├── docs/                            # Documentation directory
│   ├── architecture.md              # System architecture documentation
│   ├── production-deployment.md    # Production deployment guide
│   └── test-report.md              # Comprehensive test report
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
└── README.md                        # Project documentation
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Evil-Dreams/JobO.git
cd JobO
```

### 2. Backend Setup
```bash
cd server
npm install
```

### 3. Frontend Setup
```bash
cd client
npm install
```

### 4. Environment Configuration
Copy `.env.example` to `.env` in both root and server directories and configure:

**Root .env:**
```
REACT_APP_API_URL=http://localhost:5000
```

**Server .env:**
```
MONGO_URI=mongodb://localhost:27017/ai-job-tracker
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
FRONTEND_URL=http://localhost:3000
PORT=5000
```

### 5. Start the Application

**Start Backend:**
```bash
cd server
npm start
```

**Start Frontend:**
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Applications
- `GET /api/applications` - Get all applications
- `POST /api/applications` - Create new application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application

### AI Features
- `POST /api/ai/analyze-resume` - Analyze resume
- `POST /api/ai/generate-cover-letter` - Generate cover letter
- `POST /api/ai/interview-questions` - Get interview questions
- `POST /api/ai/success-probability` - Analyze success probability

### Documents
- `POST /api/documents/upload` - Upload resume/cover letter
- `GET /api/documents` - Get user documents
- `DELETE /api/documents/:id` - Delete document

## Deployment

### Backend Deployment (Render)
1. Connect GitHub repository to Render
2. Set environment variables in Render dashboard
3. Configure build command: `npm install`
4. Configure start command: `npm start`
5. Deploy from main branch

### Frontend Deployment (Vercel)
1. Connect GitHub repository to Vercel
2. Set environment variable: `REACT_APP_API_URL`
3. Configure build command: `npm run build`
4. Deploy from main branch

### Environment Variables for Production
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-job-tracker
JWT_SECRET=production_jwt_secret
GEMINI_API_KEY=production_gemini_key
FRONTEND_URL=https://job-o-ai.vercel.app
PORT=5000
NODE_ENV=production
```

## Testing

### Running Tests
```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

### Test Coverage
- Authentication flows
- Application CRUD operations
- AI feature integrations
- API endpoint validation

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Vibishan A - vibishan.a@example.com

Project Link: https://github.com/Evil-Dreams/JobO

## Acknowledgments

- Google Generative AI for powering the AI features
- Material-UI for the beautiful component library
- Tailwind CSS for the utility-first CSS framework
- Redux Toolkit for state management
