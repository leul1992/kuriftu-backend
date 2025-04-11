import { supabase } from '../../config/supabase.js';

export const ScanService = {
  async logScan(locationName, codeValue, challengeId) {
    const { data, error } = await supabase
      .from('qr_codes')
      .insert({
        location_name: locationName,
        qr_code_id: qrCodeId,
        challenge_id: challengeId
      })
      .select()
      .single();

    if (error) throw error;

    // Automatically update challenge status if QR code is linked to challenge
    if (challengeId) {
      await supabase
        .from('user_challenges')
        .update({ status: 'completed' })
        .eq('user_id', userId)
        .eq('challenge_id', challengeId);
    }

    return data;
  },

  async getScanHistory(userId) {
    const { data, error } = await supabase
      .from('scan_logs')
      .select(`
        *,
        qr_codes (
          location_name,
          code_value
        ),
        challenges (
          title,
          points
        )
      `)
      .eq('user_id', userId)
      .order('scanned_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};
