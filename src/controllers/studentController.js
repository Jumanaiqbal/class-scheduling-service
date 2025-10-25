import Student from '../models/Student.js';

export const getStudents = async (req, res) => {
  try {
    const students = await Student.find({ isActive: true })
      .select('studentId name email')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: students
    });

  } catch (error) {
    console.error('Get Students Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch students'
    });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const student = await Student.findOne({ 
      $or: [
        { _id: id },
        { studentId: id }
      ],
      isActive: true
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    res.json({
      success: true,
      data: student
    });

  } catch (error) {
    console.error('Get Student Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch student'
    });
  }
};

export const autoCreateStudents = async (req, res) => {
  try {
    const { studentIds } = req.body;

    if (!studentIds || !Array.isArray(studentIds)) {
      return res.status(400).json({
        success: false,
        error: 'studentIds array is required'
      });
    }

    const results = [];
    let createdCount = 0;
    let existingCount = 0;
    
    for (const studentId of studentIds) {
      try {
        const existingStudent = await Student.findOne({ studentId });
        
        if (existingStudent) {
          results.push({
            studentId,
            status: 'exists',
            message: 'Student already exists'
          });
          existingCount++;
        } else {
          const newStudent = await Student.create({
            studentId,
            name: `Student ${studentId}`,
            email: `student${studentId}@drivingschool.com`
          });
          
          results.push({
            studentId,
            status: 'created',
            message: 'Student auto-created successfully',
            data: newStudent
          });
          createdCount++;
        }
      } catch (error) {
        results.push({
          studentId,
          status: 'error',
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: `Created ${createdCount} new students, ${existingCount} already existed`,
      summary: {
        total: studentIds.length,
        created: createdCount,
        existing: existingCount,
        errors: results.filter(r => r.status === 'error').length
      },
      results
    });

  } catch (error) {
    console.error('Auto-create Students Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to auto-create students'
    });
  }
};