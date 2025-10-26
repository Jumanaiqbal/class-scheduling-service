import Registration from '../models/Registration.js';
import Student from '../models/Student.js';
import Instructor from '../models/Instructor.js';

export const getDashboardStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const daysNum = parseInt(days);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);
    startDate.setHours(0, 0, 0, 0);

    // Optimize the query with an index hint and limit processing
    const [dailyStats, registrations, students, instructors] =
      await Promise.all([
        // Use more efficient aggregation for daily stats
        Registration.aggregate([
          {
            $match: {
              startTime: { $gte: startDate },
              status: 'scheduled',
            },
          },
          {
            $project: {
              date: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: '$startTime',
                },
              },
            },
          },
          {
            $group: {
              _id: '$date',
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              date: '$_id',
              count: 1,
              _id: 0,
            },
          },
          {
            $sort: { date: 1 },
          },
        ]).option({ maxTimeMS: 50000 }), // Set maximum execution time
        // Use lean() for better performance on read-only data
        Registration.countDocuments({ status: 'scheduled' }).lean(),
        Student.countDocuments({ status: 'active' }).lean(),
        Instructor.countDocuments({ status: 'active' }).lean(),
      ]);

    res.json({
      success: true,
      data: {
        dailyStats,
        summary: {
          totalClasses: registrations,
          totalStudents: students,
          totalInstructors: instructors,
          period: {
            days: parseInt(days),
            startDate: new Date(
              new Date().setDate(new Date().getDate() - parseInt(days))
            ),
            endDate: new Date(),
          },
        },
      },
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics',
    });
  }
};
export const getDashboardSummary = async (req, res) => {
  try {
    const [totalClasses, activeStudents, activeInstructors] = await Promise.all(
      [
        Registration.countDocuments({ status: 'scheduled' }),
        Student.countDocuments({ isActive: true }),
        Instructor.countDocuments({ isActive: true }),
      ]
    );

    res.json({
      success: true,
      data: {
        totalClasses,
        activeStudents,
        activeInstructors,
      },
    });
  } catch (error) {
    console.error('Dashboard Summary Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard summary',
    });
  }
};
