# API Documentation - AI Job Application Tracker

**API Base URL:** `http://localhost:5000/api` (Development) or your production URL

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- 400: User already exists
- 400: Missing required fields

---

### Login User
**POST** `/auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- 400: Invalid credentials
- 404: User not found

---

## User Profile Endpoints

### Get User Profile
**GET** `/user/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-0123",
  "skills": [
    { "_id": "1", "name": "React", "endorsements": 5 },
    { "_id": "2", "name": "Node.js", "endorsements": 3 }
  ],
  "experience": "5 years in software development",
  "preferences": {
    "jobTitles": ["Senior Developer", "Tech Lead"],
    "locations": ["San Francisco", "Remote"],
    "salaryMin": 120000,
    "salaryMax": 180000
  },
  "resumes": [
    {
      "_id": "res1",
      "title": "Senior Developer Resume",
      "content": "...",
      "uploadedAt": "2026-02-01T10:00:00Z",
      "isPrimary": true
    }
  ],
  "coverLetters": [],
  "goals": {
    "targetApplicationsPerWeek": 5,
    "targetInterviewsPerMonth": 2,
    "targetOffers": 1
  }
}
```

**Errors:**
- 401: Unauthorized
- 404: User not found

---

### Update User Profile
**PUT** `/user/profile`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "name": "John Doe",
  "phone": "+1-555-0123",
  "experience": "5 years in software development",
  "preferences": {
    "jobTitles": ["Senior Developer"],
    "locations": ["San Francisco", "Remote"],
    "salaryMin": 120000,
    "salaryMax": 180000
  }
}
```

**Response (200):** Updated user profile

---

### Add Resume
**POST** `/user/resumes`

**Request:**
```json
{
  "title": "Senior Developer Resume",
  "content": "Resume content here...",
  "isPrimary": true
}
```

**Response (200):** Updated user profile with new resume

---

### Delete Resume
**DELETE** `/user/resumes/:resumeId`

**Response (200):** Updated user profile

---

### Add Skill
**POST** `/user/skills`

**Request:**
```json
{
  "name": "React"
}
```

**Response (200):** Updated user profile

---

### Set Goals
**POST** `/user/goals`

**Request:**
```json
{
  "targetApplicationsPerWeek": 5,
  "targetInterviewsPerMonth": 2,
  "targetOffers": 1
}
```

**Response (200):** Updated user profile

---

## Application Endpoints

### Create Application
**POST** `/applications`

**Request:**
```json
{
  "title": "Senior Software Engineer",
  "company": "Tech Corp",
  "location": "San Francisco, CA",
  "jobDescription": "Looking for a senior engineer with React and Node.js experience...",
  "salaryRange": "$120k - $180k",
  "sourceLink": "https://example.com/job/123",
  "status": "Applied",
  "followUpDate": "2026-02-10"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "jobId": "507f1f77bcf86cd799439013",
  "jobTitle": "Senior Software Engineer",
  "company": "Tech Corp",
  "status": "Applied",
  "successProbability": null,
  "timeline": [
    { "date": "2026-02-02T10:00:00Z", "action": "Application submitted" }
  ],
  "appliedAt": "2026-02-02T10:00:00Z"
}
```

---

### Get All Applications
**GET** `/applications`

**Query Parameters:**
- `status`: Filter by status
- `search`: Search by company
- `limit`: Results per page
- `page`: Page number

**Response (200):**
```json
[
  { "application object" },
  { "application object" }
]
```

---

### Get Single Application
**GET** `/applications/:id`

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "jobTitle": "Senior Software Engineer",
  "company": "Tech Corp",
  "status": "Applied",
  "notes": [
    { "_id": "1", "content": "Great company", "createdAt": "2026-02-02T10:00:00Z" }
  ],
  "communicationHistory": [
    {
      "_id": "1",
      "date": "2026-02-03T14:00:00Z",
      "type": "Email",
      "description": "Initial application sent",
      "interviewer": "John Smith",
      "outcome": "Pending response"
    }
  ],
  "timeline": [
    { "date": "2026-02-02T10:00:00Z", "action": "Application submitted" },
    { "date": "2026-02-03T14:00:00Z", "action": "Confirmed: Email sent" }
  ],
  "followUpDate": "2026-02-10T00:00:00Z",
  "successProbability": 75
}
```

---

### Update Application
**PUT** `/applications/:id`

**Request:**
```json
{
  "status": "Interview Scheduled",
  "notes": "Follow-up scheduled for next Monday",
  "followUpDate": "2026-02-10"
}
```

**Response (200):** Updated application

---

### Delete Application
**DELETE** `/applications/:id`

**Response (200):**
```json
{
  "message": "Application deleted successfully",
  "id": "507f1f77bcf86cd799439012"
}
```

---

### Add Communication
**POST** `/applications/:id/communication`

**Request:**
```json
{
  "type": "Phone Call",
  "description": "Discussed technical requirements with hiring manager",
  "interviewer": "Sarah Johnson",
  "outcome": "Positive, moving to next round"
}
```

**Response (200):** Updated application with communication added

---

### Add Note
**POST** `/applications/:id/notes`

**Request:**
```json
{
  "content": "Mentioned specific project experience during interview"
}
```

**Response (200):** Updated application with note added

---

### Set Reminder
**POST** `/applications/:id/reminder`

**Request:**
```json
{
  "reminderDate": "2026-02-10",
  "title": "Follow-up Call",
  "description": "Call to check on application status"
}
```

**Response (200):** Updated application with reminder set

---

### Get Applications by Status
**GET** `/applications/status/:status`

**Statuses:**
- Applied
- Rejected
- Interview Scheduled
- Interview Completed
- Offer Received
- Offer Accepted
- Offer Declined

**Response (200):** Array of applications with specified status

---

### Get Application Statistics
**GET** `/applications/stats/all`

**Response (200):**
```json
{
  "total": 25,
  "thisWeek": 3,
  "statuses": {
    "Applied": 12,
    "Interview Scheduled": 5,
    "Rejected": 3,
    "Offer Received": 2,
    "Offer Accepted": 3
  },
  "conversionRates": {
    "applicationToInterview": "28.57",
    "interviewToOffer": "40.00"
  }
}
```

---

### Get Upcoming Reminders
**GET** `/applications/reminders/upcoming`

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "company": "Tech Corp",
    "jobTitle": "Senior Engineer",
    "followUpDate": "2026-02-05T10:00:00Z"
  }
]
```

---

## AI Endpoints

### Optimize Resume
**POST** `/ai/optimize-resume`

**Request:**
```json
{
  "resumeText": "Your resume content...",
  "jobDescription": "Job description content..."
}
```

**Response (200):**
```json
{
  "success": true,
  "optimization": {
    "optimizedResume": "Enhanced resume text...",
    "changes": [
      "Added specific metrics to projects",
      "Highlighted relevant technologies"
    ],
    "keywords": ["React", "Node.js", "MongoDB"],
    "improvementScore": "8"
  }
}
```

---

### Generate Cover Letter
**POST** `/ai/generate-cover-letter`

**Request:**
```json
{
  "jobDescription": "Job description..."
}
```

**Response (200):**
```json
{
  "success": true,
  "coverLetter": "Dear Hiring Manager,\n\nI am excited to apply for the Senior Software Engineer position at Tech Corp...\n\nSincerely,\nJohn Doe"
}
```

---

### Predict Interview Questions
**POST** `/ai/predict-questions`

**Request:**
```json
{
  "jobDescription": "Job description...",
  "type": "behavioral"
}
```

**Types:**
- `behavioral` - Focus on past experiences
- `technical` - Technical skills and problem-solving
- `situational` - Hypothetical scenarios

**Response (200):**
```json
{
  "success": true,
  "questions": [
    "Tell me about a time when you had to work with a difficult team member.",
    "Describe a project where you had to learn new technology quickly.",
    "How do you approach debugging complex issues?",
    "Give an example of when you took initiative to improve a process.",
    "Tell me about your most significant technical achievement."
  ],
  "type": "behavioral"
}
```

---

### Analyze Success Probability
**POST** `/ai/analyze-probability`

**Request:**
```json
{
  "jobDescription": "Job description..."
}
```

**Response (200):**
```json
{
  "success": true,
  "analysis": {
    "successProbability": "75%",
    "strengths": [
      "Strong React experience",
      "Relevant backend skills"
    ],
    "weaknesses": [
      "Limited DevOps experience"
    ],
    "recommendations": [
      "Highlight specific React projects",
      "Take a DevOps course to strengthen profile"
    ],
    "alignmentScore": "8",
    "keyMatches": ["React", "Node.js", "MongoDB"]
  }
}
```

---

### Get Interview Feedback
**POST** `/ai/interview-feedback`

**Request:**
```json
{
  "question": "Tell me about your greatest achievement?",
  "answer": "I led a team project that increased performance by 40%",
  "role": "Senior Engineer"
}
```

**Response (200):**
```json
{
  "success": true,
  "feedback": "Great answer! You provided specific, quantifiable results which is excellent. To improve further, consider adding more context about the challenges you faced and the specific technologies used. Additionally, explain your personal role in more detail..."
}
```

---

## Analytics Endpoints

### Get Dashboard Overview
**GET** `/analytics/dashboard/overview`

**Response (200):**
```json
{
  "totalApplications": 25,
  "thisWeekApplications": 3,
  "statuses": {
    "Applied": 12,
    "Interview Scheduled": 5,
    "Rejected": 3,
    "Offer Received": 2,
    "Offer Accepted": 3
  },
  "conversionRates": {
    "applicationToInterview": "28.57",
    "interviewToOffer": "40.00",
    "totalOfferRate": "11.43"
  },
  "goals": {
    "targetApplicationsPerWeek": 5,
    "targetInterviewsPerMonth": 2,
    "targetOffers": 1
  },
  "topCompanies": [
    { "company": "Tech Corp", "applicationCount": 3, "avgSuccessProbability": 75 }
  ],
  "weeklyActivity": [
    { "week": "Week 4", "applicationsCount": 2, "timestamp": "2026-01-26" },
    { "week": "Week 3", "applicationsCount": 4, "timestamp": "2026-01-19" }
  ]
}
```

---

### Get Trends Data
**GET** `/analytics/trends/data`

**Response (200):**
```json
{
  "trends": [
    {
      "week": "W1",
      "applications": 5,
      "interviews": 1,
      "timestamp": "2026-01-05"
    },
    {
      "week": "W2",
      "applications": 4,
      "interviews": 2,
      "timestamp": "2026-01-12"
    }
  ]
}
```

---

### Get Success Analysis
**GET** `/analytics/success/analysis`

**Response (200):**
```json
{
  "averageSuccessProbability": "72.5",
  "highProbabilityApps": 8,
  "mediumProbabilityApps": 12,
  "lowProbabilityApps": 5,
  "statusAnalysis": [
    { "_id": "Applied", "count": 12, "avgSuccessProbability": 70 },
    { "_id": "Interview Scheduled", "count": 5, "avgSuccessProbability": 78 }
  ],
  "totalAnalyzed": 25
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error occurred",
  "error": "Error details (development only)"
}
```

---

## Rate Limiting

**AI Endpoints:** 10 requests per minute per user
**General Endpoints:** 100 requests per minute per user

**Headers:**
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1675329600
```

---

## Authentication

All endpoints except `/auth/register` and `/auth/login` require authentication.

**Include Bearer Token:**
```
Authorization: Bearer your_jwt_token_here
```

---

**Last Updated:** February 2, 2026
