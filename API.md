# API Documentation

Complete API reference for the AI Job Application Tracker.

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Table of Contents

1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Application Management](#application-management)
4. [AI Tools](#ai-tools)
5. [Error Responses](#error-responses)
6. [Rate Limiting](#rate-limiting)
7. [Authentication](#authentication-1)

## Authentication

All API endpoints (except authentication endpoints) require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Register User
**POST** `/auth/register`

Register a new user account.

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64a1b2c3d4e5f6789012345",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "skills": [],
      "experience": [],
      "preferences": {},
      "resumes": [],
      "coverLetters": []
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Error Responses
```json
{
  "success": false,
  "error": "User with this email already exists"
}
```

### Login User
**POST** `/auth/login`

Authenticate user and return JWT token.

#### Request Body
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64a1b2c3d4e5f6789012345",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "skills": ["JavaScript", "React", "Node.js"],
      "experience": [],
      "preferences": {
        "jobTypes": ["Full-time", "Remote"],
        "locations": ["San Francisco", "New York"]
      },
      "resumes": [],
      "coverLetters": []
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Error Responses
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

## User Management

### Get User Profile
**GET** `/user/profile`

Retrieve the authenticated user's profile information.

#### Headers
```
Authorization: Bearer <your-jwt-token>
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": "64a1b2c3d4e5f6789012345",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
    "experience": [
      {
        "company": "Tech Company",
        "position": "Senior Developer",
        "startDate": "2020-01-01",
        "endDate": "2023-12-31",
        "description": "Led development of web applications"
      }
    ],
    "preferences": {
      "jobTypes": ["Full-time", "Remote"],
      "locations": ["San Francisco", "New York"],
      "salaryRange": "$100k-$150k"
    },
    "resumes": ["resume1.pdf", "resume2.pdf"],
    "coverLetters": ["cover1.pdf"]
  }
}
```

### Update User Profile
**PUT** `/user/profile`

Update the authenticated user's profile information.

#### Headers
```
Authorization: Bearer <your-jwt-token>
```

#### Request Body
```json
{
  "name": "John Smith",
  "skills": ["JavaScript", "React", "Node.js", "Python", "AWS"],
  "experience": [
    {
      "company": "New Tech Company",
      "position": "Lead Developer",
      "startDate": "2021-01-01",
      "endDate": null,
      "description": "Leading development team"
    }
  ],
  "preferences": {
    "jobTypes": ["Full-time", "Remote", "Hybrid"],
    "locations": ["San Francisco", "New York", "Austin"],
    "salaryRange": "$120k-$180k"
  }
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": "64a1b2c3d4e5f6789012345",
    "name": "John Smith",
    "email": "john.doe@example.com",
    "skills": ["JavaScript", "React", "Node.js", "Python", "AWS"],
    "experience": [
      {
        "company": "New Tech Company",
        "position": "Lead Developer",
        "startDate": "2021-01-01",
        "endDate": null,
        "description": "Leading development team"
      }
    ],
    "preferences": {
      "jobTypes": ["Full-time", "Remote", "Hybrid"],
      "locations": ["San Francisco", "New York", "Austin"],
      "salaryRange": "$120k-$180k"
    },
    "resumes": ["resume1.pdf", "resume2.pdf"],
    "coverLetters": ["cover1.pdf"]
  }
}
```

## Application Management

### Create Application
**POST** `/applications`

Create a new job application.

#### Headers
```
Authorization: Bearer <your-jwt-token>
```

#### Request Body
```json
{
  "job": {
    "title": "Senior Frontend Developer",
    "company": "Tech Startup",
    "location": "San Francisco, CA",
    "jobDescription": "We are looking for a senior frontend developer with React experience...",
    "salaryRange": "$120k-$150k",
    "sourceLink": "https://example.com/job-posting"
  },
  "status": "Applied",
  "notes": "Applied through company website. Heard back from HR for initial screening.",
  "followUpDate": "2024-01-15T10:00:00Z"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": "64a1b2c3d4e5f6789012346",
    "userId": "64a1b2c3d4e5f6789012345",
    "jobId": {
      "id": "64a1b2c3d4e5f6789012347",
      "title": "Senior Frontend Developer",
      "company": "Tech Startup",
      "location": "San Francisco, CA",
      "jobDescription": "We are looking for a senior frontend developer with React experience...",
      "salaryRange": "$120k-$150k",
      "sourceLink": "https://example.com/job-posting"
    },
    "status": "Applied",
    "notes": "Applied through company website. Heard back from HR for initial screening.",
    "followUpDate": "2024-01-15T10:00:00Z",
    "timeline": [
      {
        "date": "2024-01-10T09:00:00Z",
        "event": "Application submitted",
        "type": "application"
      }
    ],
    "createdAt": "2024-01-10T09:00:00Z",
    "updatedAt": "2024-01-10T09:00:00Z"
  }
}
```

### Get All Applications
**GET** `/applications`

Retrieve all applications for the authenticated user.

#### Headers
```
Authorization: Bearer <your-jwt-token>
```

#### Query Parameters
- `status` (optional): Filter by status (Applied, Interview, Offer, Rejected)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `search` (optional): Search term for company or job title

#### Response
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "64a1b2c3d4e5f6789012346",
        "jobId": {
          "title": "Senior Frontend Developer",
          "company": "Tech Startup",
          "location": "San Francisco, CA",
          "salaryRange": "$120k-$150k"
        },
        "status": "Applied",
        "notes": "Applied through company website",
        "followUpDate": "2024-01-15T10:00:00Z",
        "createdAt": "2024-01-10T09:00:00Z",
        "updatedAt": "2024-01-10T09:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10
    }
  }
}
```

### Get Application by ID
**GET** `/applications/:id`

Retrieve a specific application by ID.

#### Headers
```
Authorization: Bearer <your-jwt-token>
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": "64a1b2c3d4e5f6789012346",
    "userId": "64a1b2c3d4e5f6789012345",
    "jobId": {
      "id": "64a1b2c3d4e5f6789012347",
      "title": "Senior Frontend Developer",
      "company": "Tech Startup",
      "location": "San Francisco, CA",
      "jobDescription": "We are looking for a senior frontend developer with React experience...",
      "salaryRange": "$120k-$150k",
      "sourceLink": "https://example.com/job-posting"
    },
    "status": "Interview",
    "notes": "Applied through company website. HR called for initial screening.",
    "followUpDate": "2024-01-15T10:00:00Z",
    "timeline": [
      {
        "date": "2024-01-10T09:00:00Z",
        "event": "Application submitted",
        "type": "application"
      },
      {
        "date": "2024-01-12T14:30:00Z",
        "event": "Phone screening with HR",
        "type": "interview"
      },
      {
        "date": "2024-01-15T10:00:00Z",
        "event": "Technical interview scheduled",
        "type": "interview"
      }
    ],
    "createdAt": "2024-01-10T09:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### Update Application
**PUT** `/applications/:id`

Update an existing application.

#### Headers
```
Authorization: Bearer <your-jwt-token>
```

#### Request Body
```json
{
  "status": "Offer",
  "notes": "Received offer! $130k base + equity. Need to respond by Friday.",
  "followUpDate": "2024-01-20T17:00:00Z",
  "timeline": [
    {
      "date": "2024-01-18T15:00:00Z",
      "event": "Received job offer",
      "type": "offer"
    }
  ]
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": "64a1b2c3d4e5f6789012346",
    "status": "Offer",
    "notes": "Received offer! $130k base + equity. Need to respond by Friday.",
    "followUpDate": "2024-01-20T17:00:00Z",
    "timeline": [
      {
        "date": "2024-01-10T09:00:00Z",
        "event": "Application submitted",
        "type": "application"
      },
      {
        "date": "2024-01-12T14:30:00Z",
        "event": "Phone screening with HR",
        "type": "interview"
      },
      {
        "date": "2024-01-15T10:00:00Z",
        "event": "Technical interview scheduled",
        "type": "interview"
      },
      {
        "date": "2024-01-18T15:00:00Z",
        "event": "Received job offer",
        "type": "offer"
      }
    ],
    "updatedAt": "2024-01-18T15:00:00Z"
  }
}
```

### Delete Application
**DELETE** `/applications/:id`

Delete an application.

#### Headers
```
Authorization: Bearer <your-jwt-token>
```

#### Response
```json
{
  "success": true,
  "message": "Application deleted successfully"
}
```

## AI Tools

### Optimize Resume
**POST** `/ai/resume`

Optimize a resume based on a job description.

#### Headers
```
Authorization: Bearer <your-jwt-token>
```

#### Request Body
```json
{
  "resumeText": "John Doe\nSenior Frontend Developer\n5 years experience\nSkills: React, JavaScript, Node.js...",
  "jobDescription": "We are looking for a senior frontend developer with React experience..."
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "optimizedResume": "John Doe\nSenior Frontend Developer | React Expert\n5 years of experience building scalable web applications...\n\nKey Skills:\n- React.js (Expert)\n- JavaScript (Advanced)\n- Node.js (Proficient)\n- TypeScript (Intermediate)\n\nExperience:\nTech Startup | Senior Frontend Developer | 2021-Present\n- Led development of customer-facing React applications\n- Improved application performance by 40%\n- Mentored junior developers\n\nOld Company | Frontend Developer | 2019-2021\n- Developed responsive web applications\n- Collaborated with UX team to implement designs\n- Participated in code reviews and agile ceremonies\n\nAchievements:\n- Increased user engagement by 25% through UI improvements\n- Reduced page load time by 30% through optimization\n- Led migration from legacy codebase to modern React\n\nEducation:\nBachelor of Science in Computer Science\nUniversity of Technology | 2015-2019\n\nCertifications:\n- AWS Certified Cloud Practitioner\n- React Developer Certification",
    "suggestions": [
      "Add specific metrics and quantifiable achievements",
      "Include more technical keywords related to the job",
      "Highlight leadership and mentoring experience",
      "Add relevant certifications and courses"
    ],
    "score": 85
  }
}
```

### Generate Cover Letter
**POST** `/ai/cover-letter`

Generate a personalized cover letter.

#### Headers
```
Authorization: Bearer <your-jwt-token>
```

#### Request Body
```json
{
  "profileData": {
    "name": "John Doe",
    "experience": "5 years as frontend developer",
    "skills": ["React", "JavaScript", "Node.js"],
    "achievements": ["Led team of 5 developers", "Improved performance by 40%"]
  },
  "jobDescription": "Senior Frontend Developer position at Tech Startup..."
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "coverLetter": "John Doe\nSan Francisco, CA | (555) 123-4567 | john.doe@email.com\n\nHiring Manager\nTech Startup\nSan Francisco, CA\n\nDear Hiring Manager,\n\nI am writing to express my strong interest in the Senior Frontend Developer position at Tech Startup. With five years of experience building scalable web applications and a proven track record of leading development teams, I am confident in my ability to contribute significantly to your innovative projects.\n\nIn my current role as a Senior Frontend Developer, I have successfully led a team of five developers in creating customer-facing React applications that have improved user engagement by 25%. My expertise in React, JavaScript, and Node.js has enabled me to optimize application performance by 40%, resulting in faster load times and better user experiences.\n\nI am particularly drawn to Tech Startup because of your commitment to innovation and user-centric design. Your company's focus on creating cutting-edge web applications aligns perfectly with my passion for building intuitive, high-performance interfaces. I am excited about the opportunity to bring my technical skills and leadership experience to your team.\n\nKey highlights of my qualifications include:\n• 5 years of professional experience in frontend development\n• Expert-level proficiency in React, JavaScript, and modern web technologies\n• Proven leadership experience managing development teams\n• Strong track record of performance optimization and user experience improvements\n• Experience with agile methodologies and cross-functional collaboration\n\nI would welcome the opportunity to discuss how my skills and experience align with your needs. Thank you for considering my application. I look forward to hearing from you soon.\n\nSincerely,\nJohn Doe",
    "wordCount": 285,
    "tone": "Professional and confident"
  }
}
```

### Predict Interview Questions
**POST** `/ai/interview`

Generate likely interview questions for a job.

#### Headers
```
Authorization: Bearer <your-jwt-token>
```

#### Request Body
```json
{
  "jobDescription": "Senior Frontend Developer position requiring React expertise..."
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "category": "Technical",
        "question": "Can you explain the virtual DOM and how React uses it?",
        "difficulty": "Medium",
        "suggestedAnswer": "The virtual DOM is a JavaScript representation of the real DOM. React uses it to optimize rendering by calculating the minimum changes needed and updating only those parts of the actual DOM, which improves performance."
      },
      {
        "category": "Technical",
        "question": "How do you optimize React application performance?",
        "difficulty": "Hard",
        "suggestedAnswer": "I optimize React apps through code splitting, lazy loading, memoization with React.memo and useMemo, virtualization for large lists, and by avoiding unnecessary re-renders through proper state management."
      },
      {
        "category": "Behavioral",
        "question": "Tell me about a time you had to lead a team through a challenging project.",
        "difficulty": "Medium",
        "suggestedAnswer": "In my previous role, I led a team through a complex migration project. I broke down the work into manageable tasks, established clear communication channels, and provided regular feedback and support to team members."
      },
      {
        "category": "Problem-Solving",
        "question": "How would you handle a situation where a critical bug is found in production?",
        "difficulty": "Hard",
        "suggestedAnswer": "I would first assess the impact and severity, then implement a quick fix if possible while working on a permanent solution. I would communicate clearly with stakeholders about the issue and timeline for resolution."
      }
    ],
    "totalQuestions": 15,
    "categories": ["Technical", "Behavioral", "Problem-Solving", "System Design"]
  }
}
```

### Analyze Success Probability
**POST** `/ai/success`

Analyze the probability of getting a job offer.

#### Headers
```
Authorization: Bearer <your-jwt-token>
```

#### Request Body
```json
{
  "profileData": {
    "skills": ["React", "JavaScript", "Node.js", "TypeScript"],
    "experience": "5 years",
    "education": "Bachelor's in Computer Science",
    "achievements": ["Led team of 5", "Improved performance by 40%"]
  },
  "jobDescription": "Senior Frontend Developer requiring 3+ years experience..."
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "probability": 78,
    "factors": {
      "skillsMatch": 85,
      "experienceMatch": 90,
      "educationMatch": 80,
      "overallFit": 78
    },
    "analysis": {
      "strengths": [
        "Strong technical skills alignment with job requirements",
        "Relevant experience level exceeds minimum requirements",
        "Leadership experience is valuable for senior role",
        "Proven track record of performance improvements"
      ],
      "weaknesses": [
        "Consider highlighting more specific technical achievements",
        "Could benefit from additional certifications",
        "Experience with specific tools mentioned in job description could be emphasized"
      ],
      "recommendations": [
        "Emphasize leadership experience and team management skills",
        "Quantify achievements with specific metrics",
        "Highlight experience with technologies mentioned in job description",
        "Prepare examples of problem-solving scenarios"
      ]
    },
    "confidence": "High"
  }
}
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `UNAUTHORIZED` | Invalid or missing authentication token |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `CONFLICT` | Resource conflict (e.g., duplicate email) |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Server internal error |
| `AI_SERVICE_ERROR` | AI service unavailable or error |

### Validation Errors
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "email": "Email is required",
    "password": "Password must be at least 6 characters"
  }
}
```

## Rate Limiting

API requests are limited to prevent abuse:

| Endpoint | Limit | Window |
|---------|-------|--------|
| Authentication | 5 requests | 1 minute |
| AI Tools | 10 requests | 1 hour |
| Other endpoints | 100 requests | 1 hour |

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640995200
```

## Authentication

### JWT Token Structure
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "id": "64a1b2c3d4e5f6789012345",
    "email": "user@example.com",
    "iat": 1640995200,
    "exp": 1641600000
  }
}
```

### Token Expiration
- **Default**: 7 days
- **Refresh**: Users can get new tokens by logging in again

### Token Validation
Tokens are validated on each protected route request:
1. Check if token exists
2. Verify token signature
3. Check token expiration
4. Validate user exists in database

## Examples

### Complete Application Flow

1. **Register User**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

2. **Login User**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

3. **Create Application**
```bash
curl -X POST http://localhost:5000/api/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "job": {
      "title": "Frontend Developer",
      "company": "Tech Company",
      "location": "San Francisco"
    },
    "status": "Applied"
  }'
```

4. **Get Applications**
```bash
curl -X GET http://localhost:5000/api/applications \
  -H "Authorization: Bearer <token>"
```

## Testing

### Postman Collection
Import the provided Postman collection to test all endpoints easily.

### Environment Variables
```json
{
  "base_url": "http://localhost:5000/api",
  "token": "your-jwt-token-here"
}
```

## Support

For API support:
- Check the error messages carefully
- Review the documentation for correct request formats
- Ensure proper authentication headers
- Contact development team for persistent issues

---

**Last Updated**: February 1, 2026
**API Version**: 1.0.0

For the most up-to-date information, please refer to the latest documentation or contact the development team.
