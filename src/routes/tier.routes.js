import { Router } from 'express';
import { TierService } from '../services/supabase/tier.service.js';
import { authenticate, checkAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const tiers = await TierService.getTiers();
    res.json({ status: 'success', data: tiers });
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, checkAdmin, async (req, res, next) => {
  try {
    const { tier, ...rest } = req.body;
    if (!['Bronze', 'Silver', 'Gold'].includes(tier)) {
      return res.status(400).json({ status: 'error', message: 'Invalid tier pk. Allowed values are Bronze, Silver, or Gold.' });
    }
    const newTier = await TierService.createTier({ tier, ...rest });
    res.status(201).json({ status: 'success', data: newTier });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const tier = await TierService.getTierById(req.params.id);
    res.json({ status: 'success', data: tier });
  } catch (error) {
    next(error);
  }
});

export default router;
