import express from 'express';
import Review from '../models/Review.js';
import PowerSupply from '../models/PowerSupply.js';

const router = express.Router();

// GET all reviews
router.get('/', async (req, res) => {
  try {
    const { 
      powerSupplyId, 
      status = 'approved', 
      sort = '-createdAt',
      page = 1,
      limit = 20
    } = req.query;

    const query = {};
    if (powerSupplyId) query.powerSupplyId = powerSupplyId;
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const reviews = await Review.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('powerSupplyId', 'brand model wattage');

    const total = await Review.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET single review
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('powerSupplyId', 'brand model wattage efficiency');

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST create new review
router.post('/', async (req, res) => {
  try {
    const review = await Review.create(req.body);

    // Update power supply ratings
    if (review.powerSupplyId) {
      const avgRatings = await Review.calculateAverageRatings(review.powerSupplyId);
      
      await PowerSupply.findByIdAndUpdate(review.powerSupplyId, {
        rating: avgRatings.avgRating,
        reviews: avgRatings.count,
        performance: avgRatings.avgPerformance || 0,
        noise: avgRatings.avgNoise || 0,
        value: avgRatings.avgValue || 0
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Review submitted successfully',
      data: review
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// PUT update review
router.put('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// PATCH approve/reject review
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid status. Must be: approved, rejected, or pending'
      });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    // Recalculate power supply ratings
    if (review.powerSupplyId) {
      const avgRatings = await Review.calculateAverageRatings(review.powerSupplyId);
      
      await PowerSupply.findByIdAndUpdate(review.powerSupplyId, {
        rating: avgRatings.avgRating,
        reviews: avgRatings.count,
        performance: avgRatings.avgPerformance || 0,
        noise: avgRatings.avgNoise || 0,
        value: avgRatings.avgValue || 0
      });
    }

    res.status(200).json({
      status: 'success',
      message: `Review ${status} successfully`,
      data: review
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST mark review as helpful
router.post('/:id/helpful', async (req, res) => {
  try {
    const { isHelpful } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    await review.markHelpful(isHelpful);

    res.status(200).json({
      status: 'success',
      message: 'Thank you for your feedback',
      data: {
        helpfulCount: review.helpfulCount,
        notHelpfulCount: review.notHelpfulCount,
        helpfulRatio: review.helpfulRatio
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// DELETE review
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    // Recalculate power supply ratings
    if (review.powerSupplyId) {
      const avgRatings = await Review.calculateAverageRatings(review.powerSupplyId);
      
      await PowerSupply.findByIdAndUpdate(review.powerSupplyId, {
        rating: avgRatings.avgRating,
        reviews: avgRatings.count,
        performance: avgRatings.avgPerformance || 0,
        noise: avgRatings.avgNoise || 0,
        value: avgRatings.avgValue || 0
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;
