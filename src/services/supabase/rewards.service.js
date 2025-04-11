import { supabase } from '../../config/supabase.js';

export const RewardService = {
  async getAvailableRewards(category) {
    let query = supabase
      .from('rewards')
      .select('*')
      .eq('is_active', true);

    if (category) query = query.eq('category', category);

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  async redeemReward(userId, rewardId) {
    // First get reward details to check points cost
    const { data: reward, error: rewardError } = await supabase
      .from('rewards')
      .select('points_cost')
      .eq('id', rewardId)
      .single();

    if (rewardError) throw rewardError;

    // Create redemption record
    const { data: redemption, error: redemptionError } = await supabase
      .from('user_redemptions')
      .insert({
        user_id: userId,
        reward_id: rewardId,
        status: 'pending'
      })
      .select()
      .single();

    if (redemptionError) throw redemptionError;

    // Deduct points from user loyalty
    const { error: loyaltyError } = await supabase.rpc('decrement_points', {
      user_id: userId,
      points: reward.points_cost
    });

    if (loyaltyError) throw loyaltyError;

    return redemption;
  },

  async getRedemptions(userId) {
    const { data, error } = await supabase
      .from('user_redemptions')
      .select(`
        *,
        rewards (
          title,
          description,
          points_cost,
          image_url
        )
      `)
      .eq('user_id', userId)
      .order('redeemed_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateRedemptionStatus(id, status) {
    const { data, error } = await supabase
      .from('user_redemptions')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
