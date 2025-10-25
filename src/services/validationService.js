import Registration from '../models/Registration.js';

export const validateBusinessRules = async (data) => {
  const { studentId, instructorId, classType, startTime, action } = data;

  if (action === 'delete') return;

  const classDuration = parseInt(process.env.CLASS_DURATION) || 45;
  const endTime = new Date(startTime.getTime() + classDuration * 60000);

  await checkOverlappingSessions(studentId, instructorId, startTime, endTime);
  await checkDailyLimits(studentId, instructorId, classType, startTime);
  await checkClassTypeCapacity(classType, startTime);
};

const checkOverlappingSessions = async (studentId, instructorId, startTime, endTime) => {
  const overlapping = await Registration.findOne({
    status: 'scheduled',
    $or: [
      {
        studentId,
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      },
      {
        instructorId,
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      }
    ]
  });

  if (overlapping) {
    const entity = overlapping.studentId === studentId ? 'student' : 'instructor';
    throw new Error(`${entity} has an overlapping class scheduled`);
  }
};

const checkDailyLimits = async (studentId, instructorId, classType, startTime) => {
  const dayStart = new Date(startTime);
  dayStart.setHours(0, 0, 0, 0);
  
  const dayEnd = new Date(startTime);
  dayEnd.setHours(23, 59, 59, 999);

  const studentDailyCount = await Registration.countDocuments({
    studentId,
    startTime: { $gte: dayStart, $lte: dayEnd },
    status: 'scheduled'
  });

  const maxStudentClasses = parseInt(process.env.MAX_STUDENT_CLASSES_PER_DAY) || 3;
  if (studentDailyCount >= maxStudentClasses) {
    throw new Error(`Student daily limit exceeded (max: ${maxStudentClasses})`);
  }

  const instructorDailyCount = await Registration.countDocuments({
    instructorId,
    startTime: { $gte: dayStart, $lte: dayEnd },
    status: 'scheduled'
  });

  const maxInstructorClasses = parseInt(process.env.MAX_INSTRUCTOR_CLASSES_PER_DAY) || 5;
  if (instructorDailyCount >= maxInstructorClasses) {
    throw new Error(`Instructor daily limit exceeded (max: ${maxInstructorClasses})`);
  }
};

const checkClassTypeCapacity = async (classType, startTime) => {
  const maxClassesPerType = parseInt(process.env.MAX_CLASSES_PER_TYPE) || 10;
  if (!maxClassesPerType) return;

  const dayStart = new Date(startTime);
  dayStart.setHours(0, 0, 0, 0);
  
  const dayEnd = new Date(startTime);
  dayEnd.setHours(23, 59, 59, 999);

  const classTypeDailyCount = await Registration.countDocuments({
    classType,
    startTime: { $gte: dayStart, $lte: dayEnd },
    status: 'scheduled'
  });

  if (classTypeDailyCount >= maxClassesPerType) {
    throw new Error(`Class type daily capacity exceeded (max: ${maxClassesPerType})`);
  }
};