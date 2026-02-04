const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  profileImage: {
    type: String,
    default: null // URL to uploaded profile image
  },
  phone: {
    type: String,
    trim: true
  },
  headline: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  // Additional profile fields
  dateOfBirth: {
    type: Date,
    default: null
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say', ''],
    default: ''
  },
  nationality: {
    type: String,
    trim: true,
    default: ''
  },
  languages: {
    type: String,
    trim: true,
    default: ''
  },
  workAuthorization: {
    type: String,
    enum: ['Citizen', 'Permanent Resident', 'Work Visa', 'Student Visa', 'Other', ''],
    default: ''
  },
  salaryExpectation: {
    type: String,
    trim: true,
    default: ''
  },
  availability: {
    type: String,
    enum: ['Immediately', '2 weeks', '1 month', '2 months', '3+ months', ''],
    default: ''
  },
  links: {
    linkedin: String,
    portfolio: String,
    github: String,
    twitter: String
  },
  skills: [{
    name: String,
    endorsements: {
      type: Number,
      default: 0
    }
  }],
  experience: {
    type: String,
    trim: true
  },
  education: {
    type: String,
    trim: true
  },
  preferences: {
    jobTitles: [String],
    locations: [String],
    salaryMin: Number,
    salaryMax: Number,
    jobTypes: [String], // Full-time, Part-time, Contract, etc.
    industries: [String]
  },
  resumes: [{
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    fileName: String,
    fileSize: String,
    filePath: String, // Path to stored file
    targetRole: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    isPrimary: Boolean
  }],
  coverLetters: [{
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    content: String,
    jobPosition: String,
    company: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  goals: {
    targetApplicationsPerWeek: Number,
    targetInterviewsPerMonth: Number,
    targetOffers: Number
  },
  activityStats: {
    applicationsThisWeek: {
      type: Number,
      default: 0
    },
    interviewsScheduled: {
      type: Number,
      default: 0
    },
    offersReceived: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
