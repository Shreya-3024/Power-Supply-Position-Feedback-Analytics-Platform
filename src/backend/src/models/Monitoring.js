import mongoose from 'mongoose';

const monitoringSchema = new mongoose.Schema({
  // Power Metrics
  powerDraw: {
    type: Number,
    required: [true, 'Power draw is required'],
    min: [0, 'Power draw cannot be negative']
  },
  voltage: {
    type: Number,
    required: [true, 'Voltage is required'],
    min: [0, 'Voltage cannot be negative']
  },
  current: {
    type: Number,
    required: [true, 'Current is required'],
    min: [0, 'Current cannot be negative']
  },

  // Temperature
  temperature: {
    type: Number,
    required: [true, 'Temperature is required'],
    min: [-50, 'Temperature cannot be less than -50°C'],
    max: [150, 'Temperature cannot exceed 150°C']
  },

  // Efficiency
  efficiency: {
    type: Number,
    required: [true, 'Efficiency is required'],
    min: [0, 'Efficiency cannot be less than 0%'],
    max: [100, 'Efficiency cannot exceed 100%']
  },

  // PSU Reference (optional - for specific PSU monitoring)
  powerSupplyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PowerSupply'
  },

  // System Information
  systemName: {
    type: String,
    trim: true,
    default: 'Default System'
  },
  location: {
    type: String,
    trim: true
  },

  // Status
  status: {
    type: String,
    enum: ['normal', 'warning', 'critical'],
    default: 'normal'
  },
  alerts: [{
    type: {
      type: String,
      enum: ['high_temperature', 'low_voltage', 'high_current', 'low_efficiency', 'power_spike']
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],

  // Metadata
  recordedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Indexes for time-series queries
monitoringSchema.index({ recordedAt: -1 });
monitoringSchema.index({ powerSupplyId: 1, recordedAt: -1 });
monitoringSchema.index({ systemName: 1, recordedAt: -1 });
monitoringSchema.index({ status: 1 });

// Virtual for power calculation verification
monitoringSchema.virtual('calculatedPower').get(function() {
  return (this.voltage * this.current).toFixed(2);
});

// Method to check and set status based on readings
monitoringSchema.methods.checkStatus = function() {
  this.alerts = [];
  this.status = 'normal';

  // Check temperature
  if (this.temperature > 80) {
    this.status = 'critical';
    this.alerts.push({
      type: 'high_temperature',
      message: `Critical temperature: ${this.temperature}°C`,
      timestamp: new Date()
    });
  } else if (this.temperature > 70) {
    this.status = 'warning';
    this.alerts.push({
      type: 'high_temperature',
      message: `High temperature: ${this.temperature}°C`,
      timestamp: new Date()
    });
  }

  // Check voltage
  if (this.voltage < 11.4 || this.voltage > 12.6) {
    this.status = 'warning';
    this.alerts.push({
      type: 'low_voltage',
      message: `Voltage out of range: ${this.voltage}V`,
      timestamp: new Date()
    });
  }

  // Check efficiency
  if (this.efficiency < 80) {
    this.status = 'warning';
    this.alerts.push({
      type: 'low_efficiency',
      message: `Low efficiency: ${this.efficiency}%`,
      timestamp: new Date()
    });
  }

  // Check power spikes
  if (this.powerDraw > 1000) {
    this.alerts.push({
      type: 'power_spike',
      message: `High power draw: ${this.powerDraw}W`,
      timestamp: new Date()
    });
  }
};

// Pre-save middleware to automatically check status
monitoringSchema.pre('save', function(next) {
  this.checkStatus();
  next();
});

// Static method to get latest readings
monitoringSchema.statics.getLatestReadings = function(limit = 10) {
  return this.find().sort({ recordedAt: -1 }).limit(limit);
};

// Static method to get readings for time range
monitoringSchema.statics.getReadingsByTimeRange = function(startDate, endDate) {
  return this.find({
    recordedAt: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ recordedAt: 1 });
};

// Static method to get average metrics for a time period
monitoringSchema.statics.getAverageMetrics = async function(startDate, endDate) {
  const result = await this.aggregate([
    {
      $match: {
        recordedAt: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: null,
        avgPowerDraw: { $avg: '$powerDraw' },
        avgVoltage: { $avg: '$voltage' },
        avgCurrent: { $avg: '$current' },
        avgTemperature: { $avg: '$temperature' },
        avgEfficiency: { $avg: '$efficiency' },
        maxPowerDraw: { $max: '$powerDraw' },
        maxTemperature: { $max: '$temperature' },
        minVoltage: { $min: '$voltage' },
        count: { $sum: 1 }
      }
    }
  ]);

  return result.length > 0 ? result[0] : null;
};

const Monitoring = mongoose.model('Monitoring', monitoringSchema);

export default Monitoring;
