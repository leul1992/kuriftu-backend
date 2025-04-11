import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { LoyaltyService } from '../services/supabase/loyality.service.js';

const router = Router();

// Get user's loyalty data
router.get('/', authenticate, async (req, res, next) => {
  try {
    const loyaltyData = await LoyaltyService.getLoyaltyData(req.user.id);
    res.json({ status: 'success', data: loyaltyData });
  } catch (error) {
    next(error);
  }
});

// Add points (typically called from other services)
router.post('/points', authenticate, async (req, res, next) => {
  try {
    const result = await LoyaltyService.updateLoyaltyPoints(
      req.user.id,
      req.body.points
    );
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
});

// Get all tier definitions
router.get('/tiers', async (req, res, next) => {
  try {
    const tiers = await LoyaltyService.getTierDefinitions();
    res.json({ status: 'success', data: tiers });
  } catch (error) {
    next(error);
  }
});

export default router;