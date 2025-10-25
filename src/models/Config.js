import mongoose from 'mongoose';

const configSchema = new mongoose.Schema({
  key: {
    type: String,
    required: [true, 'Config key is required'],
    unique: true,
    trim: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Config value is required']
  },
  description: {
    type: String,
    trim: true
  },
  dataType: {
    type: String,
    enum: ['number', 'string', 'boolean', 'array', 'object'],
    default: 'string'
  }
}, {
  timestamps: true
});

configSchema.index({ key: 1 });

configSchema.statics.setValue = async function (key, value, description = '', dataType = 'string') {
  const config = await this.findOne({ key });
  
  if (config) {
    config.value = value;
    config.description = description || config.description;
    config.dataType = dataType;
    return await config.save();
  } else {
    return await this.create({ key, value, description, dataType });
  }
};

const Config = mongoose.model('Config', configSchema);
export default Config;