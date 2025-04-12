import { supabase } from "../../config/supabase.js";
import { LoyaltyService } from "./loyality.service.js";
export const HotelService = {
  async getHotels() {
    const { data, error } = await supabase
      .from('hotels')
      .select('*');
    
    if (error) throw error;
    return data;
  },

  async bookHotel(userId) {
    try {
      const response = await LoyaltyService.updateLoyaltyPoints(userId, 1000); // Add 100 points for booking a hotel
      console.log(response)
      return response
      
    } catch (error) {
      console.error('Failed to update loyalty points:', error);
      throw new Error('Could not update loyalty points. Please try again later.');
    }
    
}
}
