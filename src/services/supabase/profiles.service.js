import { supabase } from "../../config/supabase.js";
import { LoyaltyService } from "./loyality.service.js";

export const ProfileService = {
  /**
   * Get user profile by user_id
   * @param {string} userId - UUID matching auth.users.id
   * @returns {Promise<object>} User profile data
   */
  async getProfile(userId) {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create or update user profile using authenticated session
   * @param {string} userId - From auth session
   * @param {string} email - From auth session
   * @param {object} profileData - Frontend-provided data
   */
  async createProfile(userId, email, profileData) {
    // Validate required fields
    console.log('creating user profile');
    const required = ["first_name", "last_name", "age"];
    const missing = required.filter((field) => !profileData[field]);
    if (missing.length)
      throw new Error(`Missing fields: ${missing.join(", ")}`);

    // Use a transaction to ensure both operations succeed
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .upsert(
        {
          id: userId,
          email,
          ...profileData,
          created_at: new Date().toISOString(),
          role: "user", // Ensure default role is set
        },
        { onConflict: "id" }
      )
      .select()
      .single();

    if (profileError) throw profileError;
      console.log('profile created, now loyality');
    try {
      // Create loyalty record with proper error handling
      await LoyaltyService.createLoyaltyPoints(userId);
      return profile;
    } catch (loyaltyError) {
      // Rollback profile creation if loyalty fails
      await supabase.from("user_profiles").delete().eq("id", userId);

      throw new Error(
        `Failed to create loyalty record: ${loyaltyError.message}`
      );
    }
  },
};
