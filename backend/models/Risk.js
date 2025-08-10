const mongoose  = require('mongoose');

const RiskSchema = new mongoose.Schema({
  riskId: {
    type: String,
    required: true,
    unique: true,
  },
  summary: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  mitigationPlan: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['New', 'Accept', 'Closed'],
    default: 'New',
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
  },
  empID: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Risk', RiskSchema);
