import express from 'express';
import PowerSupply from '../models/PowerSupply.js';

const router = express.Router();

// GET all power supplies
router.get('/', async (req, res) => {
  try {
    const { 
      efficiency, 
      minWattage, 
      maxWattage, 
      position, 
      modular,
      sort = '-rating',
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    const query = { isActive: true };

    if (efficiency) query.efficiency = efficiency;
    if (position) query.position = position;
    if (modular) query.modular = modular;
    if (minWattage || maxWattage) {
      query.wattage = {};
      if (minWattage) query.wattage.$gte = Number(minWattage);
      if (maxWattage) query.wattage.$lte = Number(maxWattage);
    }

    // Execute query with pagination
    const skip = (Number(page) - 1) * Number(limit);
    const powerSupplies = await PowerSupply.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await PowerSupply.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: powerSupplies.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: powerSupplies
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET single power supply by ID
router.get('/:id', async (req, res) => {
  try {
    const powerSupply = await PowerSupply.findById(req.params.id);

    if (!powerSupply) {
      return res.status(404).json({
        status: 'error',
        message: 'Power supply not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: powerSupply
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST create new power supply
router.post('/', async (req, res) => {
  try {
    const powerSupply = await PowerSupply.create(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Power supply created successfully',
      data: powerSupply
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// PUT update power supply
router.put('/:id', async (req, res) => {
  try {
    const powerSupply = await PowerSupply.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!powerSupply) {
      return res.status(404).json({
        status: 'error',
        message: 'Power supply not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Power supply updated successfully',
      data: powerSupply
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// DELETE power supply (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const powerSupply = await PowerSupply.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!powerSupply) {
      return res.status(404).json({
        status: 'error',
        message: 'Power supply not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Power supply deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET top rated power supplies
router.get('/top/rated', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const powerSupplies = await PowerSupply.find({ isActive: true })
      .sort({ rating: -1, reviews: -1 })
      .limit(limit);

    res.status(200).json({
      status: 'success',
      results: powerSupplies.length,
      data: powerSupplies
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await PowerSupply.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalPSUs: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: '$reviews' },
          avgPrice: { $avg: '$price' },
          avgPerformance: { $avg: '$performance' },
          avgNoise: { $avg: '$noise' },
          avgValue: { $avg: '$value' }
        }
      }
    ]);

    const positionCounts = await PowerSupply.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$position',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const efficiencyCounts = await PowerSupply.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$efficiency',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        overview: stats[0] || {},
        positionDistribution: positionCounts,
        efficiencyDistribution: efficiencyCounts
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;
