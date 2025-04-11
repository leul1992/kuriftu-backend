import { supabase } from '../../config/supabase.js';

export const UserChallengeService = {
  async getUserChallenges(userId) {
    const { data, error } = await supabase
      .from('user_challenges')
      .select(`
        id,
        challenge_id,
        status,
        completed_at,
        verified,
        photo_url,
        challenges (
          title,
          description,
          points,
          image_url,
          category
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user challenges:', error);
      throw new Error('Failed to fetch user challenges');
    }

    return data || [];
  },

  async createUserChallenge(userId, challengeId) {
    const { data, error } = await supabase
      .from('user_challenges')
      .insert({
        user_id: userId,
        challenge_id: challengeId,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateUserChallenge(id, userId, updates) {
    if (updates.status === 'completed') {
      // First get the challenge points value
      const { data: challenge, error: challengeError } = await supabase
        .from('challenges')
        .select('points')
        .eq('id', req.challenge.id)
        .single();
      
      if (challengeError) throw challengeError;
  
      // Add points via LoyaltyService
      await LoyaltyService.updateLoyaltyPoints(
        userId,
        challenge.points
      );
    }
  },

  async verifyChallengeCompletion(id, verified) {
    const { data, error } = await supabase
      .from('user_challenges')
      .update({ verified })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
