import { supabase } from '../config/supabase.js';

/**
 * Validates challenge creation/update data
 */
export const validateChallengeData = (req, res, next) => {
  const validCategories = ['Dining', 'Spa', 'Adventure', 'Booking'];
  const { category } = req.body;

  if (category && !validCategories.includes(category)) {
    return res.status(400).json({
      error: 'Invalid category',
      valid_categories: validCategories
    });
  }

  if (req.body.points && (typeof req.body.points !== 'number' || req.body.points <= 0)) {
    return res.status(400).json({
      error: 'Points must be a positive number'
    });
  }

  next();
};

/**
 * Checks if a challenge exists in the database
 */
export const checkChallengeExists = async (req, res, next) => {
  const { challenge_id } = req.body || req.params;
  console.log('Checking challenge ID:', challenge_id);

  if (!challenge_id) {
    return res.status(400).json({
      error: 'Challenge ID is required'
    });
  }

  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', challenge_id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        error: 'Challenge not found'
      });
    }

    req.challenge = data;
    next();
  } catch (err) {
    return res.status(500).json({
      error: 'An error occurred while checking the challenge',
      details: err.message
    });
  }
};

/**
 * Checks for duplicate challenge titles in the database
 */
export const checkDuplicateChallengeTitle = async (req, res, next) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({
      error: 'Challenge title is required'
    });
  }

  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('id')
      .eq('title', title)
      .single();

    if (data) {
      return res.status(409).json({
        error: 'A challenge with this title already exists'
      });
    }

    if (error && error.code !== 'PGRST116') { // Ignore "No rows found" error
      return res.status(500).json({
        error: 'An error occurred while checking for duplicate title',
        details: error.message
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      error: 'An error occurred while checking for duplicate title',
      details: err.message
    });
  }
};


