const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: [true, 'Certificate ID is required'],
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  domain: {
    type: String,
    required: [true, 'Domain is required'],
    trim: true
  },
  startDate: {
    type: String,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: String,
    required: [true, 'End date is required']
  },
  organizationName: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true
  },
  certificateFile: {
    type: String
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'revoked'],
    default: 'active'
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  lastDownloaded: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
  
}, {
  timestamps: true
});

// Create index for faster searches
certificateSchema.index({ certificateId: 1 });
certificateSchema.index({ studentName: 'text' });

// Method to increment download count
certificateSchema.methods.incrementDownload = async function() {
  this.downloadCount += 1;
  this.lastDownloaded = Date.now();
  await this.save();
};

module.exports = mongoose.model('Certificate', certificateSchema);