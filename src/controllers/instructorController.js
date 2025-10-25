import Instructor from '../models/Instructor.js';

export const getInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find({ isActive: true })
      .select('instructorId name email specialization')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: instructors
    });

  } catch (error) {
    console.error('Get Instructors Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch instructors'
    });
  }
};

export const getInstructorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const instructor = await Instructor.findOne({ 
      $or: [
        { _id: id },
        { instructorId: id }
      ],
      isActive: true
    });

    if (!instructor) {
      return res.status(404).json({
        success: false,
        error: 'Instructor not found'
      });
    }

    res.json({
      success: true,
      data: instructor
    });

  } catch (error) {
    console.error('Get Instructor Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch instructor'
    });
  }
};