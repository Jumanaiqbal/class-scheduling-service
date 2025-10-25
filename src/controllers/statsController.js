import Registration from '../models/Registration.js';
import mongoose from 'mongoose';

export const getDailyClassStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);
    
    const stats = await Registration.aggregate([
      {
        $match: {
          startTime: { $gte: startDate },
          status: 'scheduled'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$startTime'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          date: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      success: true,
      data: stats,
      period: {
        startDate,
        endDate: new Date(),
        days: parseInt(days)
      }
    });

  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
};

export const getClassTypeStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);

    const stats = await Registration.aggregate([
      {
        $match: {
          startTime: { $gte: startDate },
          status: 'scheduled'
        }
      },
      {
        $group: {
          _id: '$classType',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'classtypes',
          localField: '_id',
          foreignField: 'classId',
          as: 'classTypeInfo'
        }
      },
      {
        $unwind: {
          path: '$classTypeInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          classType: '$_id',
          className: '$classTypeInfo.name',
          description: '$classTypeInfo.description',
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const totalClasses = stats.reduce((sum, stat) => sum + stat.count, 0);
    const statsWithPercentages = stats.map(stat => ({
      ...stat,
      percentage: totalClasses > 0 ? ((stat.count / totalClasses) * 100).toFixed(1) : 0
    }));

    res.json({
      success: true,
      data: statsWithPercentages,
      summary: {
        totalClasses,
        period: {
          startDate,
          endDate: new Date(),
          days: parseInt(days)
        }
      }
    });

  } catch (error) {
    console.error('Class Type Stats Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch class type statistics'
    });
  }
};