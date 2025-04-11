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
    // 1. Get reward cost
    const { data: reward, error: rewardError } = await supabase
      .from('rewards')
      .select('points_cost')
      .eq('id', rewardId)
      .single();

    if (rewardError) throw rewardError;

    // 2. Check user points (using correct table name)
    const { data: userLoyalty, error: loyaltyError } = await supabase
      .from('user_loyalty')
      .select('points')
      .eq('id', userId)
      .single();

    if (loyaltyError) throw loyaltyError;
    if (userLoyalty.points < reward.points_cost) {
      throw new Error('Insufficient points');
    }

    // 3. Create redemption (correct table name)
    const { data: redemption, error: redemptionError } = await supabase
      .from('user_redemptions')
      .insert({
        user_id: userId,
        reward_id: rewardId,
        status: 'pending',
        redeemed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (redemptionError) throw redemptionError;

    // 4. Deduct points (correct table name)
    const { error: deductError } = await supabase
      .from('user_loyalty')
      .update({ 
        points: userLoyalty.points - reward.points_cost 
      })
      .eq('id', userId);

    if (deductError) throw deductError;

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
