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
  phone: {
    type: String,
    trim: true
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
  preferences: {
    jobTitles: [String],
    locations: [String],
    salaryMin: Number,
    salaryMax: Number,
    jobTypes: [String], // Full-time, Part-time, Contract, etc.
    industries: [String]
  },
  resumes: [{
    title: String,
    content: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    isPrimary: Boolean
  }],
  coverLetters: [{
    title: String,
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    relatedJob: String
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
