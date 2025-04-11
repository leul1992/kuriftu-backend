import { supabase } from '../../config/supabase.js';

export const ChallengeService = {
  /**
   * Get all active challenges
   * @param {string} [category] - Optional category filter
   * @returns {Promise<Array>} List of challenges
   */
  async getChallenges(category, page = 1, limit = 20) {
    let query = supabase
      .from('challenges')
      .select('*')
      .eq('is_active', true)
      .range((page - 1) * limit, page * limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  /**
   * Get specific challenge by ID
   * @param {string} challengeId 
   * @returns {Promise<Object>} Challenge details
   */
  async getChallengeById(challengeId) {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', challengeId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create a new challenge (Admin only)
   * @param {Object} challengeData 
   * @returns {Promise<Object>} Created challenge
   */
  async createChallenge(challengeData) {
    const requiredFields = ['title', 'description', 'category', 'points'];
    const missingFields = requiredFields.filter(field => !challengeData[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const { data, error } = await supabase
      .from('challenges')
      .insert({
        ...challengeData,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
