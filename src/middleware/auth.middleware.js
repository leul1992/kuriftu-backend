import { supabase } from '../config/supabase.js';

export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      error: 'Authorization token required' 
    });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) throw error;
    
    req.user = {
      id: user.id,
      email: user.email,
      role: user.user_metadata?.role || 'user'
    };
    
    next();
  } catch (error) {
    res.status(403).json({ 
      error: 'Invalid or expired token',
      details: error.message 
    });
  }
};


/**
 * Checks if profile already exists
 */
export const checkProfileExists = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', req.user.id)
      .single();

    if (data) {
      return res.status(409).json({
        error: 'Profile already exists',
        solution: 'Use PATCH /api/profile to update instead'
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Checks if user is admin
 */
export const checkAdmin = async (req, res, next) => {
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (error || profile?.role !== 'Admin') {
      return res.status(403).json({
        error: 'Admin access required'
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to check if profile has required fields completed
 * Based on schema: first_name, last_name, and age are required
 */
export async function requireCompleteProfile(req, res, next) {
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('first_name, last_name, age')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;

    // Check required fields from your schema
    const missingFields = [];
    if (!profile?.first_name) missingFields.push('first_name');
    if (!profile?.last_name) missingFields.push('last_name');
    if (!profile?.age) missingFields.push('age');

    if (missingFields.length > 0) {
      return res.status(403).json({
        status: 'error',
        message: 'Complete your profile first',
        missing_fields: missingFields,
        required_fields: ['first_name', 'last_name', 'age']
      });
    }

    next();
  } catch (error) {
    console.error('Profile completion check failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to verify profile completion'
    });
  }
}
