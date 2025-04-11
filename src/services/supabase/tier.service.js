import { supabase } from "../../config/supabase.js";

export const TierService = {
  async getTiers() {
    const { data, error } = await supabase
      .from('tier_definitions')
      .select('*');

    if (error) throw error;
    return data;
  },

  async getTierById(tierId) {
    const { data, error } = await supabase
      .from('tier_definitions')
      .select('*')
      .eq('tier', tierId)
      .single();

    if (error) throw error;
    return data;
  }
};
