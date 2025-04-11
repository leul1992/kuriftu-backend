import { Router } from 'express';
import { RewardService } from '../services/supabase/rewards.service.js';
import { authenticate, requireCompleteProfile } from '../middleware/auth.middleware.js';


const router = Router();

// Get available rewards
router.get('/', async (req, res, next) => {
  try {
    const rewards = await RewardService.getAvailableRewards(req.query.category);
    res.json({ status: 'success', data: rewards });
  } catch (error) {
    next(error);
  }
});

// Redeem a reward
router.post('/redeem', authenticate, requireCompleteProfile, async (req, res, next) => {
  try {
    const redemption = await RewardService.redeemReward(
      req.user.id,
      req.body.reward_id
    );
    res.status(201).json({ status: 'success', data: redemption });
  } catch (error) {
    next(error);
  }
});

// Get user's redemptions
router.get('/redemptions', authenticate, async (req, res, next) => {
  try {
    const redemptions = await RewardService.getRedemptions(req.user.id);
    res.json({ status: 'success', data: redemptions });
  } catch (error) {
    next(error);
  }
});

// Admin update redemption status
router.patch('/redemptions/:id', authenticate, requireCompleteProfile, async (req, res, next) => {
  try {
    const redemption = await RewardService.updateRedemptionStatus(
      req.params.id,
      req.body.status
    );
    res.json({ status: 'success', data: redemption });
  } catch (error) {
    next(error);
  }
});

export default router;
