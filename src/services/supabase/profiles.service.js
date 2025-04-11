import { supabase } from '../../config/supabase.js';

export const ProfileService = {
  /**
   * Get user profile by user_id
   * @param {string} userId - UUID matching auth.users.id
   * @returns {Promise<object>} User profile data
   */
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

    /**
     * Create or update user profile using authenticated session
     * @param {string} userId - From auth session
     * @param {string} email - From auth session 
     * @param {object} profileData - Frontend-provided data
     */
    async createPofile(userId, email, profileData) {
      // Validate required fields
      const required = ['first_name', 'last_name', 'age'];
      const missing = required.filter(field => !profileData[field]);
      if (missing.length) throw new Error(`Missing fields: ${missing.join(', ')}`);
  
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(
          {
            id: userId,       // From auth, not frontend
            email,            // From auth, not frontend
            ...profileData,
            created_at: new Date().toISOString()
          },
          { onConflict: 'id' }
        )
        .select()
        .single();
  
      if (error) throw error;
      return data;
    },
};