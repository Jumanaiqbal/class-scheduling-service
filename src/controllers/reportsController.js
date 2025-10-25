import Registration from '../models/Registration.js';
import Student from '../models/Student.js';
import Instructor from '../models/Instructor.js';
import ClassType from '../models/ClassType.js';

export const getClassesReport = async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      instructorId, 
      studentId,
      classType,
      page = 1, 
      limit = 10 
    } = req.query;

    // Build filter object
    let filter = { status: 'scheduled' };
    
    // Date range filter
    if (startDate || endDate) {
      filter.startTime = {};
      if (startDate) {
        filter.startTime.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // End of the day
        filter.startTime.$lte = end;
      }
    }
    
    // Instructor filter
    if (instructorId) {
      filter.instructorId = instructorId;
    }
    
    // Student filter
    if (studentId) {
      filter.studentId = studentId;
    }
    
    // Class type filter
    if (classType) {
      filter.classType = classType;
    }

    console.log('📊 Reports filter:', filter);

    // Get registrations with pagination
    const registrations = await Registration.find(filter)
      .sort({ startTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean(); // Use lean for better performance

    // Get total count for pagination
    const total = await Registration.countDocuments(filter);

    // Enrich data with names for better UI display
    const enrichedRegistrations = await Promise.all(
      registrations.map(async (reg) => {
        const [student, instructor, classTypeInfo] = await Promise.all([
          Student.findOne({ studentId: reg.studentId }),
          Instructor.findOne({ instructorId: reg.instructorId }),
          ClassType.findOne({ classId: reg.classType })
        ]);

        return {
          ...reg,
          studentName: student?.name || 'Unknown Student',
          instructorName: instructor?.name || 'Unknown Instructor',
          className: classTypeInfo?.name || 'Unknown Class',
          classDescription: classTypeInfo?.description || ''
        };
      })
    );

    res.json({
      success: true,
      data: enrichedRegistrations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      filters: {
        startDate,
        endDate,
        instructorId,
        studentId,
        classType
      }
    });

  } catch (error) {
    console.error('Reports Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate classes report'
    });
  }
};

export const getReportFilters = async (req, res) => {
  try {
    // Get available filters for the UI dropdowns
    const [instructors, students, classTypes] = await Promise.all([
      Instructor.find({ isActive: true }).select('instructorId name'),
      Student.find({ isActive: true }).select('studentId name'),
      ClassType.find({ isActive: true }).select('classId name')
    ]);

    res.json({
      success: true,
      filters: {
        instructors,
        students,
        classTypes
      }
    });

  } catch (error) {
    console.error('Report Filters Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch report filters'
    });
  }
};