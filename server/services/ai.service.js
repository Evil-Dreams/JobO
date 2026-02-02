const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Validate API key
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set in environment variables');
  process.exit(1);
}

// Helper function to extract JSON from markdown code blocks
const extractJSON = (text) => {
  // Try to extract JSON from markdown code blocks
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }
  return text.trim();
};

const analyzeResume = async (resumeText, targetRole = 'General') => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
    You are an expert resume analyst and career coach. Analyze the following resume and provide a comprehensive evaluation.

    Resume Content:
    ${resumeText}

    Target Role: ${targetRole}

    Please analyze the resume and provide:
    1. Overall score (0-100) based on quality, formatting, content, and effectiveness
    2. Detailed breakdown scores for different sections
    3. Strengths of the resume
    4. Areas that need improvement
    5. Specific actionable suggestions
    6. ATS (Applicant Tracking System) compatibility score
    7. Missing sections or keywords that should be added

    Format your response as JSON with the following structure:
    {
      "overallScore": 75,
      "sectionScores": {
        "contact": 90,
        "summary": 70,
        "experience": 80,
        "education": 85,
        "skills": 75,
        "formatting": 70
      },
      "atsScore": 72,
      "strengths": ["List of strong points"],
      "improvements": ["List of areas to improve"],
      "suggestions": ["Specific actionable suggestions"],
      "missingKeywords": ["Keywords that should be added"],
      "missingSections": ["Any missing important sections"],
      "summary": "Brief overall assessment"
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const jsonText = extractJSON(text);
      return JSON.parse(jsonText);
    } catch (parseError) {
      return {
        overallScore: 70,
        sectionScores: {
          contact: 80,
          summary: 70,
          experience: 75,
          education: 80,
          skills: 70,
          formatting: 65
        },
        atsScore: 68,
        strengths: ['Resume shows relevant experience'],
        improvements: ['Could improve formatting'],
        suggestions: ['Add more quantifiable achievements'],
        missingKeywords: [],
        missingSections: [],
        summary: 'The resume shows potential but could be improved in several areas.'
      };
    }
  } catch (error) {
    console.error('Resume analysis error:', error);
    throw new Error('Failed to analyze resume');
  }
};

const optimizeResume = async (resumeText, jobDescription) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
    You are an expert resume optimizer. Please analyze the following resume and job description, then provide an optimized version of the resume that better aligns with the job requirements.

    Job Description:
    ${jobDescription}

    Current Resume:
    ${resumeText}

    Please provide:
    1. An optimized version of the resume that highlights relevant skills and experiences
    2. Specific changes made and why they improve the resume
    3. Keywords from the job description that were incorporated

    Format your response as JSON with the following structure:
    {
      "optimizedResume": "The full optimized resume text",
      "changes": ["List of specific changes made"],
      "keywords": ["List of keywords incorporated"],
      "improvementScore": "Score from 1-10 showing how much the resume was improved"
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON response
    try {
      const jsonText = extractJSON(text);
      return JSON.parse(jsonText);
    } catch (parseError) {
      // If JSON parsing fails, return the raw text
      return {
        optimizedResume: text,
        changes: ['Resume optimized based on job description'],
        keywords: [],
        improvementScore: '7'
      };
    }
  } catch (error) {
    console.error('Resume optimization error:', error);
    throw new Error('Failed to optimize resume');
  }
};

const generateCoverLetter = async (profileData, jobDescription) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
    You are an expert cover letter writer. Please generate a professional cover letter based on the job information provided.

    Job Information:
    ${jobDescription}

    Candidate Profile:
    ${JSON.stringify(profileData, null, 2)}

    Please generate a compelling cover letter that:
    1. Opens with a strong introduction expressing interest in the position
    2. Highlights relevant skills and experiences
    3. Shows enthusiasm for the role and company
    4. Demonstrates understanding of the job requirements
    5. Includes a professional closing with a call to action

    Return ONLY the cover letter text, formatted properly with paragraphs. Do not include any JSON or markdown formatting.
    Start directly with "Dear Hiring Manager," and end with "Sincerely,\n[Your Name]"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up any markdown formatting
    let cleanText = text.replace(/```[\s\S]*?```/g, '').trim();
    
    // If it still has JSON, try to extract the cover letter
    try {
      const jsonText = extractJSON(text);
      const parsed = JSON.parse(jsonText);
      if (parsed.coverLetter) {
        return parsed.coverLetter;
      }
    } catch (e) {
      // Not JSON, use the clean text
    }

    return cleanText || text;
  } catch (error) {
    console.error('Cover letter generation error:', error);
    throw new Error('Failed to generate cover letter');
  }
};

const predictInterviewQuestions = async (jobDescription, questionType = 'behavioral') => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const typeInstructions = {
      behavioral: 'Focus on behavioral questions that ask about past experiences using the STAR method format.',
      technical: 'Focus on technical questions that test specific skills, knowledge, and problem-solving abilities.',
      situational: 'Focus on situational/hypothetical questions that ask what the candidate would do in specific scenarios.'
    };

    const prompt = `
    You are an expert interview coach. Based on the following job information, generate exactly 5 interview questions.

    Job Information:
    ${jobDescription}

    Question Type Instructions:
    ${typeInstructions[questionType] || typeInstructions.behavioral}

    Generate exactly 5 ${questionType} interview questions that are specific, challenging, and relevant to the role.
    
    Return ONLY a JSON array of 5 question strings, nothing else:
    ["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const jsonText = extractJSON(text);
      const questions = JSON.parse(jsonText);
      if (Array.isArray(questions)) {
        return questions;
      }
      // If it's an object with arrays, flatten them
      return Object.values(questions).flat().slice(0, 5);
    } catch (parseError) {
      // Fallback questions
      return [
        'Tell me about a time when you faced a challenging situation at work.',
        'How do you prioritize tasks when you have multiple deadlines?',
        'Describe a project where you had to collaborate with others.',
        'What is your greatest professional achievement?',
        'How do you handle constructive criticism?'
      ];
    }
  } catch (error) {
    console.error('Interview questions prediction error:', error);
    throw new Error('Failed to predict interview questions');
  }
};

const analyzeSuccessProbability = async (profileData, jobDescription) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
    You are an expert career analyst. Analyze the candidate's profile against the job description and provide a comprehensive success probability analysis.

    Job Description:
    ${jobDescription}

    Candidate Profile:
    ${JSON.stringify(profileData, null, 2)}

    Please provide:
    1. Overall success probability (0-100%)
    2. Strengths that make the candidate a good fit
    3. Weaknesses or gaps that might reduce chances
    4. Recommendations to improve success probability
    5. Key skills/experiences that align well with the role

    Format your response as JSON with the following structure:
    {
      "successProbability": "Percentage from 0-100",
      "strengths": ["List of candidate's strengths"],
      "weaknesses": ["List of potential weaknesses"],
      "recommendations": ["List of improvement recommendations"],
      "alignmentScore": "Score from 1-10 showing how well the profile aligns",
      "keyMatches": ["List of key matching points"]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const jsonText = extractJSON(text);
      return JSON.parse(jsonText);
    } catch (parseError) {
      return {
        successProbability: '75%',
        strengths: ['Profile shows relevant experience'],
        weaknesses: ['Some skills may need development'],
        recommendations: ['Highlight specific achievements'],
        alignmentScore: '7',
        keyMatches: ['Good experience match']
      };
    }
  } catch (error) {
    console.error('Success probability analysis error:', error);
    throw new Error('Failed to analyze success probability');
  }
};

const getInterviewFeedback = async (question, answer, role) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
    You are an expert interview coach. Please evaluate the candidate's answer to an interview question and provide detailed feedback.

    Role: ${role || 'Not specified'}
    
    Interview Question:
    ${question}

    Candidate's Answer:
    ${answer}

    Please provide constructive feedback including:
    1. What was good about the answer
    2. What could be improved
    3. Suggested improvements or additions
    4. Example of a strong answer

    Format your response as a clear, helpful feedback text. Be encouraging but honest.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error('Interview feedback error:', error);
    throw new Error('Failed to get interview feedback');
  }
};

module.exports = {
  analyzeResume,
  optimizeResume,
  generateCoverLetter,
  predictInterviewQuestions,
  analyzeSuccessProbability,
  getInterviewFeedback,
};
