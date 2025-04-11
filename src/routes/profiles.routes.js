import { Router } from 'express';
import { ProfileService } from '../services/supabase/profiles.service.js';
import { handleError } from '../utils/errors.js';
import { authenticate, checkProfileExists } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate)

/**
 * @route GET /api/v1/user_profiles
 * @desc Get user profile by token (exact match)
 * @access Private
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const user_id = req.user.id;
    
    if (!user_id) {
      return res.status(400).json({
        status: 'error',
        message: 'user_id query parameter is required'
      });
    }

    const profile = await ProfileService.getProfile(user_id);
    
    res.json({
      status: 'success',
      data: profile
    });
  } catch (error) {
    handleError(res, error);
  }
});

/**
 * @route POST /api/v1/user_profiles
 * @desc Create new user profile
 * @body Profile data matching user_profiles schema
 * @access Private
 */
router.post('/', authenticate, checkProfileExists, async (req, res) => {
  try {
    // Get user from auth session
    const userId = req.user.id;
    const email = req.user.email;

    // Only accept editable fields from frontend
    const { first_name, last_name, age, profile_url } = req.body;

    const profile = await ProfileService.createPofile(
      userId,
      email,
      { first_name, last_name, age, profile_url }
    );

    res.json({ 
      status: 'success',
      data: profile
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;