import { supabase } from '../../config/supabase.js';

export const RedemptionService = {
  async getRedemptions(userId) {
    const { data, error } = await supabase
      .from('user_redemptions')
      .select('*, rewards(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  },

  async createRedemption(userId, rewardId) {
    const { data, error } = await supabase
      .from('user_redemptions')
      .insert({
        user_id: userId,
        reward_id: rewardId,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
