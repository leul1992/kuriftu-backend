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
  async getChallengeById(userId, challengeId) {
    // Get all sub-challenges
    const { data: subChallenges, error: subChallengesError } = await supabase
      .from('sub_challenges')
      .select('id, title, description, points')
      .eq('challenge_id', challengeId);

    if (subChallengesError) throw subChallengesError;

    // Get all existing user challenges in one query
    const { data: existingEntries, error: existingEntriesError } = await supabase
      .from('user_challenges')
      .select('sub_challenge_id, verified')
      .eq('user_id', userId)
      .in('sub_challenge_id', subChallenges.map(sc => sc.id));

    if (existingEntriesError) throw existingEntriesError;

    // Create a map for quick lookup
    const existingEntriesMap = new Map(
      existingEntries.map(entry => [entry.sub_challenge_id, entry])
    );

    // Prepare batch insert for missing entries
    const entriesToInsert = subChallenges
      .filter(sc => !existingEntriesMap.has(sc.id))
      .map(sc => ({
        user_id: userId,
        status: 'pending',
        sub_challenge_id: sc.id,
      }));

    if (entriesToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('user_challenges')
        .insert(entriesToInsert);

      if (insertError) throw insertError;
    }

    // Add verified status to each sub-challenge
    return subChallenges.map(sc => ({
      ...sc,
      verified: existingEntriesMap.get(sc.id)?.verified || false
    }));
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
