import ClassType from '../models/ClassType.js';

export const getClassTypes = async (req, res) => {
  try {
    const classTypes = await ClassType.find({ isActive: true })
      .select('classId name description duration maxCapacity')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: classTypes
    });

  } catch (error) {
    console.error('Get Class Types Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch class types'
    });
  }
};

export const getClassTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const classType = await ClassType.findOne({ 
      $or: [
        { _id: id },
        { classId: id }
      ],
      isActive: true
    });

    if (!classType) {
      return res.status(404).json({
        success: false,
        error: 'Class type not found'
      });
    }

    res.json({
      success: true,
      data: classType
    });

  } catch (error) {
    console.error('Get Class Type Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch class type'
    });
  }
};