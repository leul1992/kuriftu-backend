import { Router } from 'express';
import { TierService } from '../services/supabase/tier.service.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const tiers = await TierService.getTiers();
    res.json({ status: 'success', data: tiers });
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
