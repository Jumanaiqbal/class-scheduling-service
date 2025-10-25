import mongoose from 'mongoose';

const instructorSchema = new mongoose.Schema({
  instructorId: {
    type: String,
    required: [true, 'Instructor ID is required'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Instructor name is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  specialization: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

instructorSchema.index({ instructorId: 1 });

const Instructor = mongoose.model('Instructor', instructorSchema);
export default Instructor;