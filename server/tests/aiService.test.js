// Backend tests for AI Service
const aiService = require('../../services/ai.service');

describe('AI Service', () => {
  describe('Resume Optimization', () => {
    test('should optimize resume based on job description', async () => {
      const resumeText = 'Experienced Software Engineer with 5 years of experience';
      const jobDescription = 'Looking for Sr. Developer with React and Node.js expertise';

      const result = await aiService.optimizeResume(resumeText, jobDescription);

      expect(result).toHaveProperty('optimizedResume');
      expect(result).toHaveProperty('changes');
      expect(result).toHaveProperty('keywords');
      expect(result).toHaveProperty('improvementScore');
    });
  });

  describe('Cover Letter Generation', () => {
    test('should generate cover letter from profile data', async () => {
      const profileData = {
        name: 'John Doe',
        email: 'john@example.com',
        skills: ['React', 'Node.js'],
        experience: '5 years'
      };
      const jobDescription = 'Looking for a full stack developer';

      const result = await aiService.generateCoverLetter(profileData, jobDescription);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.includes('Dear')).toBeTruthy();
    });
  });

  describe('Interview Questions Prediction', () => {
    test('should predict behavioral interview questions', async () => {
      const jobDescription = 'Looking for a project manager';

      const result = await aiService.predictInterviewQuestions(jobDescription, 'behavioral');

      expect(Array.isArray(result)).toBeTruthy();
      expect(result.length).toBe(5);
      expect(result[0]).toBeTruthy();
    });

    test('should predict technical interview questions', async () => {
      const jobDescription = 'Looking for a software engineer';

      const result = await aiService.predictInterviewQuestions(jobDescription, 'technical');

      expect(Array.isArray(result)).toBeTruthy();
      expect(result.length).toBe(5);
    });
  });

  describe('Success Probability Analysis', () => {
    test('should analyze success probability', async () => {
      const profileData = {
        name: 'John Doe',
        skills: ['Python', 'JavaScript'],
        experience: '5 years'
      };
      const jobDescription = 'Looking for a developer with Python and JavaScript skills';

      const result = await aiService.analyzeSuccessProbability(profileData, jobDescription);

      expect(result).toHaveProperty('successProbability');
      expect(result).toHaveProperty('strengths');
      expect(result).toHaveProperty('weaknesses');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('alignmentScore');
    });
  });

  describe('Interview Feedback', () => {
    test('should provide feedback on interview answer', async () => {
      const question = 'Tell me about your greatest achievement?';
      const answer = 'I led a team project that increased sales by 50%';
      const role = 'Sales Manager';

      const result = await aiService.getInterviewFeedback(question, answer, role);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });
});
