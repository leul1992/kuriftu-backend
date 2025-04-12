import { supabase } from '../../config/supabase.js';

export const LoyaltyService = {
  async getLoyaltyData(userId) {
    const { data, error } = await supabase
      .from('user_loyalty')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async createLoyaltyPoints(userId, initialPoints = 1000) {
    console.log('creating loyalty');
    const { data, error } = await supabase
      .from('user_loyalty')
      .insert([{ id: userId, points: initialPoints }]);

    if (error) throw error;
    return data;
  },

  async updateLoyaltyPoints(userId, pointsChange) {
    // 1. Get current data
    const { data: current, error: fetchError } = await supabase
      .from('user_loyalty')
      .select('points')
      .eq('id', userId)
      .single();

    if (fetchError) throw fetchError;

    // 2. Calculate new points
    const newPoints = current.points + pointsChange;

    // 3. Update points
    const { data, error } = await supabase
      .from('user_loyalty')
      .update({
        points: newPoints,
        last_updated: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    if (error) console.log(error)
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
