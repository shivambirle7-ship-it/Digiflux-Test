const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  highlighters: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['Hot promise', 'Customer', 'promise', 'null'],
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

projectSchema.index({ dueDate: 1 });
projectSchema.index({ status: 1 });

module.exports = mongoose.model('Project', projectSchema);
