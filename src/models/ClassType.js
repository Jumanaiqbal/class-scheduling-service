import mongoose from 'mongoose';

const classTypeSchema = new mongoose.Schema({
  classId: {
    type: String,
    required: [true, 'Class ID is required'],
    unique: true,
    trim: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  duration: {
    type: Number,
    default: 45
  },
  maxCapacity: {
    type: Number,
    default: 10
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

classTypeSchema.index({ classId: 1 });
classTypeSchema.index({ isActive: 1 });

const ClassType = mongoose.models.ClassType || mongoose.model('ClassType', classTypeSchema);

export default ClassType;