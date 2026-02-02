// Backend tests for Application Controller
const request = require('supertest');
const express = require('express');
const applicationController = require('../../controllers/applicationController');
const Application = require('../../models/Application');

const app = express();
app.use(express.json());

// Mock auth middleware
app.use((req, res, next) => {
  req.user = { id: '507f1f77bcf86cd799439011' };
  next();
});

describe('Application Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /applications', () => {
    test('should return all applications for a user', async () => {
      const mockApplications = [
        {
          _id: '1',
          userId: '507f1f77bcf86cd799439011',
          jobTitle: 'Developer',
          company: 'Tech Corp',
          status: 'Applied'
        }
      ];

      jest.spyOn(Application, 'find').mockResolvedValue(mockApplications);

      const response = await request(app).get('/applications');

      expect(response.status).toBe(200);
    });
  });

  describe('POST /applications', () => {
    test('should create a new application', async () => {
      const newApp = {
        title: 'Developer',
        company: 'Tech Corp',
        location: 'San Francisco',
        jobDescription: 'Test job',
        status: 'Applied'
      };

      jest.spyOn(Application, 'create').mockResolvedValue(newApp);

      const response = await request(app)
        .post('/applications')
        .send(newApp);

      expect(response.status).toBe(201);
    });
  });

  describe('GET /applications/stats/all', () => {
    test('should return application statistics', async () => {
      jest.spyOn(Application, 'countDocuments').mockResolvedValue(10);
      jest.spyOn(Application, 'aggregate').mockResolvedValue([
        { _id: 'Applied', count: 5 },
        { _id: 'Interview Scheduled', count: 3 },
        { _id: 'Rejected', count: 2 }
      ]);

      const response = await request(app).get('/applications/stats/all');

      expect(response.status).toBe(200);
    });
  });

  describe('POST /applications/:id/communication', () => {
    test('should add communication to application', async () => {
      const commData = {
        type: 'Email',
        description: 'Initial interview scheduled',
        interviewer: 'John Smith'
      };

      jest.spyOn(Application, 'findOneAndUpdate').mockResolvedValue({
        _id: '1',
        ...commData
      });

      const response = await request(app)
        .post('/applications/1/communication')
        .send(commData);

      expect(response.status).toBe(200);
    });
  });

  describe('POST /applications/:id/reminder', () => {
    test('should set reminder for application', async () => {
      const reminderData = {
        reminderDate: '2026-02-10',
        title: 'Follow-up'
      };

      jest.spyOn(Application, 'findOneAndUpdate').mockResolvedValue({
        _id: '1',
        followUpDate: new Date(reminderData.reminderDate),
        reminderSet: true
      });

      const response = await request(app)
        .post('/applications/1/reminder')
        .send(reminderData);

      expect(response.status).toBe(200);
    });
  });
});
