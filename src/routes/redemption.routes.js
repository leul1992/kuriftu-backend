import { Router } from 'express';
import { authenticate, requireCompleteProfile } from '../middleware/auth.middleware.js';
import { RedemptionService } from '../services/supabase/redemption.service.js';

const router = Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const redemptions = await RedemptionService.getRedemptions(req.user.id);
    res.json({ status: 'success', data: redemptions });
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, requireCompleteProfile, async (req, res, next) => {
  try {
    const redemption = await RedemptionService.createRedemption(
      req.user.id,
      req.body.reward_id
    );
    res.status(201).json({ status: 'success', data: redemption });
  } catch (error) {
    next(error);
  }
});

export default router;
