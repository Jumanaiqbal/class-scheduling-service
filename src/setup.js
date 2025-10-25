import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Config from './models/Config.js';
import connectDB from './config/database.js';

dotenv.config();

const defaultConfigs = [
  {
    key: 'UI_THEME',
    value: 'light',
    description: 'Default UI theme',
    dataType: 'string'
  },
  {
    key: 'UI_LANGUAGE',
    value: 'en',
    description: 'Default UI language',
    dataType: 'string'
  },
  {
    key: 'NOTIFICATION_ENABLED',
    value: 'true',
    description: 'Enable system notifications',
    dataType: 'boolean'
  },
  {
    key: 'CLASS_DURATION',
    value: process.env.CLASS_DURATION || '45',
    description: 'Default class duration in minutes',
    dataType: 'number'
  },
  {
    key: 'MAX_STUDENT_CLASSES_PER_DAY',
    value: process.env.MAX_STUDENT_CLASSES_PER_DAY || '3',
    description: 'Maximum classes per student per day',
    dataType: 'number'
  },
  {
    key: 'MAX_INSTRUCTOR_CLASSES_PER_DAY',
    value: process.env.MAX_INSTRUCTOR_CLASSES_PER_DAY || '5',
    description: 'Maximum classes per instructor per day',
    dataType: 'number'
  }
];

const initializeConfigs = async () => {
  try {
    await connectDB();
    
    for (const config of defaultConfigs) {
      const existing = await Config.findOne({ key: config.key });
      if (!existing) {
        await Config.create(config);
        console.log(`✅ Created default config: ${config.key}`);
      } else {
        console.log(`ℹ️ Config already exists: ${config.key}`);
      }
    }
    
    console.log('🎉 Configuration initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing configurations:', error);
    process.exit(1);
  }
};

initializeConfigs();
