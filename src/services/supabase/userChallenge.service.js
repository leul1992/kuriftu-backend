import { supabase } from '../../config/supabase.js';
import { LoyaltyService } from './loyality.service.js';

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

  async completeChallenge(userId, challengeId) {
    // 1. Get challenge details
    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .select('points')
      .eq('id', challengeId)
      .single();

    if (challengeError) throw challengeError;

    // 2. Update challenge status (schema-accurate)
    const { data: updatedChallenge, error: updateError } = await supabase
      .from('user_challenges')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('challenge_id', challengeId)
      .select()
      .single();

    if (updateError) throw updateError;

    // 3. Add loyalty points
    await LoyaltyService.updateLoyaltyPoints(userId, challenge.points);

    return updatedChallenge;
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

  async verifyChallengeCompletion(user_id, sub_challenge_id) {
    // Check if the challenge is already verified
    const { data: existingChallenge, error: fetchError } = await supabase
      .from('user_challenges')
      .select('verified')
      .eq('user_id', user_id)
      .eq('sub_challenge_id', sub_challenge_id)
      .single();

    if (fetchError) throw fetchError;

    if (existingChallenge?.verified) {
      return { message: 'Already done this challenge' };
    }

    // Get the points from the sub_challenges table
    const { data: subChallenge, error: subChallengeError } = await supabase
      .from('sub_challenges')
      .select('points')
      .eq('id', sub_challenge_id)
      .single();

    if (subChallengeError) throw subChallengeError;

    // Update the user_challenges table to mark as verified
    const { data: updatedChallenge, error: updateError } = await supabase
      .from('user_challenges')
      .update({ verified: true, status: 'completed', completed_at: new Date().toISOString() })
      .eq('user_id', user_id)
      .eq('sub_challenge_id', sub_challenge_id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Update the user_loyalty table with the points
    await LoyaltyService.updateLoyaltyPoints(user_id, subChallenge.points);

    return updatedChallenge;
  }
};
