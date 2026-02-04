const mongoose = require('mongoose');

const coverLetterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  filename: {
    type: String
  },
  mimetype: {
    type: String
  },
  size: {
    type: Number
  },
  path: {
    type: String
  },
  generatedFor: {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume'
    },
    jobDescription: {
      type: String,
      default: ''
    },
    jobRole: {
      type: String,
      default: ''
    },
    generatedDate: {
      type: Date,
      default: Date.now
    }
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  isGenerated: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CoverLetter', coverLetterSchema);
