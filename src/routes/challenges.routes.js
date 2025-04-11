import { Router } from 'express';
import { 
  authenticate,
  checkAdmin,
} from '../middleware/auth.middleware.js';

import { validateChallengeData , checkDuplicateChallengeTitle} from '../middleware/challenge.middleware.js';
import { ChallengeService } from '../services/supabase/challenges.service.js';

const router = Router();

/**
 * @route GET /api/challenges
 * @desc Get all active challenges
 * @query {category} Optional category filter
 * @access Public
 */
router.get('/', async (req, res, next) => {
  try {
    const challenges = await ChallengeService.getChallenges(req.query.category);
    res.json({
      status: 'success',
      data: challenges
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/challenges/:id
 * @desc Get specific challenge by ID
 * @access Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const challenge = await ChallengeService.getChallengeById(req.params.id);
    res.json({
      status: 'success',
      data: challenge
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/challenges
 * @desc Create new challenge (Admin only)
 * @access Private (Admin)
 */
router.post('/',
  authenticate,
  checkAdmin,
  validateChallengeData,
  checkDuplicateChallengeTitle,
  async (req, res, next) => {
    try {
      const newChallenge = await ChallengeService.createChallenge(req.body);
      res.status(201).json({
        status: 'success',
        data: newChallenge
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
