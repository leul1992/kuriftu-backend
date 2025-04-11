import { supabase } from '../../config/supabase.js';

export const LoyaltyService = {
  async getLoyaltyData(userId) {
    const { data, error } = await supabase
      .from('user_loyalty')
      .select(`
        *,
        tier_definitions (
          min_points,
          benefits
        )
      `)
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateLoyaltyPoints(userId, pointsChange) {
    const { data, error } = await supabase.rpc('update_loyalty_points', {
      user_id: userId,
      points_change: pointsChange
    });

    if (error) throw error;
    return data;
  },

  async getTierDefinitions() {
    const { data, error } = await supabase
      .from('tier_definitions')
      .select('*')
      .order('min_points', { ascending: true });

    if (error) throw error;
    return data;
  }
};
