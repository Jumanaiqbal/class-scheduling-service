import Config from '../models/Config.js';

export const getConfigurations = async (req, res) => {
  try {
    const configs = await Config.find({});
    
    const mergedConfigs = {
      environment: {
        PORT: process.env.PORT || 5000,
        MONGODB_URI: process.env.MONGODB_URI ? '***' : 'Not set',
        NODE_ENV: process.env.NODE_ENV || 'development'
      },
      businessRules: {
        CLASS_DURATION: process.env.CLASS_DURATION || 45,
        MAX_STUDENT_CLASSES_PER_DAY: process.env.MAX_STUDENT_CLASSES_PER_DAY || 3,
        MAX_INSTRUCTOR_CLASSES_PER_DAY: process.env.MAX_INSTRUCTOR_CLASSES_PER_DAY || 5,
        MAX_CLASSES_PER_TYPE: process.env.MAX_CLASSES_PER_TYPE || 10
      },
      databaseConfigs: configs.reduce((acc, config) => {
        acc[config.key] = {
          value: config.value,
          description: config.description,
          dataType: config.dataType
        };
        return acc;
      }, {})
    };

    res.json({
      success: true,
      data: mergedConfigs
    });

  } catch (error) {
    console.error('Get Config Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch configurations'
    });
  }
};

export const updateConfiguration = async (req, res) => {
  try {
    const { key, value, description, dataType = 'string' } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Key and value are required'
      });
    }

    const allowedKeys = [
      'CLASS_DURATION',
      'MAX_STUDENT_CLASSES_PER_DAY', 
      'MAX_INSTRUCTOR_CLASSES_PER_DAY',
      'MAX_CLASSES_PER_TYPE',
      'UI_THEME',
      'UI_LANGUAGE',
      'NOTIFICATION_ENABLED'
    ];

    if (!allowedKeys.includes(key)) {
      return res.status(400).json({
        success: false,
        error: `Configuration key '${key}' is not allowed to be updated via API`
      });
    }

    const config = await Config.setValue(key, value, description, dataType);

    res.json({
      success: true,
      message: `Configuration '${key}' updated successfully`,
      data: config
    });

  } catch (error) {
    console.error('Update Config Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update configuration'
    });
  }
};

export const resetConfiguration = async (req, res) => {
  try {
    const { key } = req.body;

    if (!key) {
      return res.status(400).json({
        success: false,
        error: 'Key is required'
      });
    }

    await Config.deleteOne({ key });

    res.json({
      success: true,
      message: `Configuration '${key}' reset to default`
    });

  } catch (error) {
    console.error('Reset Config Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset configuration'
    });
  }
};

export const getUIConfig = async (req, res) => {
  try {
    const configs = await Config.find({});

    const configObject = configs.reduce((acc, config) => {
      acc[config.key] = config.value;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        theme: configObject.UI_THEME || 'light',
        language: configObject.UI_LANGUAGE || 'en',
        notifications: configObject.NOTIFICATION_ENABLED !== 'false',
        classDuration: parseInt(process.env.CLASS_DURATION) || 45,
        maxStudentClasses: parseInt(process.env.MAX_STUDENT_CLASSES_PER_DAY) || 3,
        maxInstructorClasses: parseInt(process.env.MAX_INSTRUCTOR_CLASSES_PER_DAY) || 5
      }
    });

  } catch (error) {
    console.error('UI Config Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch UI configuration'
    });
  }
};

export const bulkUpdateConfig = async (req, res) => {
  try {
    const { configs } = req.body;

    if (!configs || !Array.isArray(configs)) {
      return res.status(400).json({
        success: false,
        error: 'configs array is required'
      });
    }

    const results = [];
    
    for (const config of configs) {
      try {
        const { key, value, description, dataType = 'string' } = config;
        
        const allowedKeys = ['UI_THEME', 'UI_LANGUAGE', 'NOTIFICATION_ENABLED'];
        if (!allowedKeys.includes(key)) {
          throw new Error(`Key '${key}' is not allowed for bulk update`);
        }

        const updatedConfig = await Config.setValue(key, value, description, dataType);
        results.push({
          key,
          status: 'success',
          data: updatedConfig
        });
      } catch (error) {
        results.push({
          key: config.key,
          status: 'error',
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.status === 'success').length;

    res.json({
      success: true,
      message: `Successfully updated ${successCount} out of ${configs.length} configurations`,
      results
    });

  } catch (error) {
    console.error('Bulk Update Config Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to bulk update configurations'
    });
  }
};