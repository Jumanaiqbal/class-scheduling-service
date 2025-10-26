import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      unique: true,
      sparse: true,
    },
    studentId: {
      type: String,
      required: [true, 'Student ID is required'],
      index: true,
    },
    instructorId: {
      type: String,
      required: [true, 'Instructor ID is required'],
      index: true,
    },
    classType: {
      type: String,
      required: [true, 'Class type is required'],
      index: true,
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
      index: true,
    },
    endTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['scheduled', 'cancelled'],
      default: 'scheduled',
    },
    action: {
      type: String,
      enum: ['new', 'update', 'delete'],
    },
    processed: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

registrationSchema.index({ studentId: 1, startTime: 1 });
registrationSchema.index({ instructorId: 1, startTime: 1 });
registrationSchema.index({ classType: 1, startTime: 1 });

registrationSchema.pre('save', function (next) {
  if (this.startTime && !this.endTime) {
    const duration = parseInt(process.env.CLASS_DURATION) || 45;
    this.endTime = new Date(this.startTime.getTime() + duration * 60000);
  }
  next();
});

const Registration =
  mongoose.models.Registration ||
  mongoose.model('Registration', registrationSchema);
export default Registration;
