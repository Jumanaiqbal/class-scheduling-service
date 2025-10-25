import Registration from '../models/Registration.js';
import { processCSVData, processRegistrationRow } from '../services/registrationService.js';

export const uploadCSV = async (req, res) => {
  try {
    console.log('📥 CSV Upload Request Received');
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No CSV file uploaded'
      });
    }

    console.log('📄 File received:', req.file.originalname);

    const csvData = await processCSVData(req.file.buffer);
    console.log('📊 CSV Rows to process:', csvData.length);

    const processingResults = [];
    for (let i = 0; i < csvData.length; i++) {
      const result = await processRegistrationRow(csvData[i], i + 1);
      processingResults.push(result);
    }
    
    res.json({
      success: true,
      message: `Processed ${csvData.length} rows`,
      results: processingResults
    });

  } catch (error) {
    console.error('❌ CSV Upload Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process CSV file',
      message: error.message
    });
  }
};

export const getRegistrations = async (req, res) => {
  try {
    const { date, instructorId, page = 1, limit = 10 } = req.query;
    
    let filter = { status: 'scheduled' };
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      filter.startTime = {
        $gte: startDate,
        $lt: endDate
      };
    }
    
    if (instructorId) {
      filter.instructorId = instructorId;
    }

    const registrations = await Registration.find(filter)
      .sort({ startTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Registration.countDocuments(filter);

    res.json({
      success: true,
      data: registrations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get Registrations Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch registrations'
    });
  }
};