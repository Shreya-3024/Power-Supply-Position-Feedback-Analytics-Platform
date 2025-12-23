import express from 'express';
import Monitoring from '../models/Monitoring.js';

const router = express.Router();

// GET all monitoring data
router.get('/', async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      status,
      systemName,
      limit = 100,
      sort = '-recordedAt'
    } = req.query;

    const query = {};
    
    if (status) query.status = status;
    if (systemName) query.systemName = systemName;
    
    if (startDate || endDate) {
      query.recordedAt = {};
      if (startDate) query.recordedAt.$gte = new Date(startDate);
      if (endDate) query.recordedAt.$lte = new Date(endDate);
    }

    const monitoringData = await Monitoring.find(query)
      .sort(sort)
      .limit(Number(limit))
      .populate('powerSupplyId', 'brand model wattage');

    res.status(200).json({
      status: 'success',
      results: monitoringData.length,
      data: monitoringData
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET latest monitoring data
router.get('/latest', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const monitoringData = await Monitoring.getLatestReadings(limit);

    res.status(200).json({
      status: 'success',
      results: monitoringData.length,
      data: monitoringData
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET monitoring statistics
router.get('/stats', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 24 * 60 * 60 * 1000); // Last 24 hours
    const end = endDate ? new Date(endDate) : new Date();

    const stats = await Monitoring.getAverageMetrics(start, end);

    res.status(200).json({
      status: 'success',
      period: {
        start: start.toISOString(),
        end: end.toISOString()
      },
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET real-time monitoring (current status)
router.get('/realtime', async (req, res) => {
  try {
    // Get the most recent reading
    const latestReading = await Monitoring.findOne()
      .sort({ recordedAt: -1 })
      .populate('powerSupplyId', 'brand model wattage efficiency');

    if (!latestReading) {
      return res.status(404).json({
        status: 'error',
        message: 'No monitoring data available'
      });
    }

    // Get last 5 readings for trend
    const recentReadings = await Monitoring.find()
      .sort({ recordedAt: -1 })
      .limit(5)
      .select('powerDraw voltage temperature efficiency recordedAt');

    res.status(200).json({
      status: 'success',
      data: {
        current: latestReading,
        trend: recentReadings.reverse() // Oldest to newest for chart
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET monitoring data by time range
router.get('/range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        status: 'error',
        message: 'startDate and endDate are required'
      });
    }

    const monitoringData = await Monitoring.getReadingsByTimeRange(
      new Date(startDate),
      new Date(endDate)
    );

    res.status(200).json({
      status: 'success',
      results: monitoringData.length,
      data: monitoringData
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST create new monitoring record
router.post('/', async (req, res) => {
  try {
    const monitoringRecord = await Monitoring.create(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Monitoring record created successfully',
      data: monitoringRecord
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST bulk create monitoring records
router.post('/bulk', async (req, res) => {
  try {
    const { records } = req.body;

    if (!Array.isArray(records)) {
      return res.status(400).json({
        status: 'error',
        message: 'Records must be an array'
      });
    }

    const monitoringRecords = await Monitoring.insertMany(records);

    res.status(201).json({
      status: 'success',
      message: `${monitoringRecords.length} monitoring records created successfully`,
      results: monitoringRecords.length,
      data: monitoringRecords
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET alerts
router.get('/alerts', async (req, res) => {
  try {
    const { status = 'warning', limit = 50 } = req.query;

    const alerts = await Monitoring.find({
      status: { $in: [status, 'critical'] },
      'alerts.0': { $exists: true } // Has at least one alert
    })
    .sort({ recordedAt: -1 })
    .limit(Number(limit));

    res.status(200).json({
      status: 'success',
      results: alerts.length,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// DELETE old monitoring records
router.delete('/cleanup', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const result = await Monitoring.deleteMany({
      recordedAt: { $lt: cutoffDate }
    });

    res.status(200).json({
      status: 'success',
      message: `Deleted ${result.deletedCount} old monitoring records`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;
