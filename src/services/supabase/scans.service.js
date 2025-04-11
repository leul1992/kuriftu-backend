import { supabase } from '../../config/supabase.js';

export const ScanService = {
  async logScan(userId, qrCodeId, challengeId) {
    // 1. Verify QR code exists
    const { data: qrCode, error: qrError } = await supabase
      .from('qr_codes')
      .select('location_name, challenge_id')
      .eq('id', qrCodeId)
      .single();

    if (qrError || !qrCode) throw new Error('Invalid QR code');

    // 2. Log the scan (schema-accurate)
    const { data: scan, error: scanError } = await supabase
      .from('scan_logs')
      .insert({
        user_id: userId,
        qr_code_id: qrCodeId,
        challenge_id: challengeId || qrCode.challenge_id,
        scanned_at: new Date().toISOString()
      })
      .select()
      .single();

    if (scanError) throw scanError;

    // 3. Complete challenge if applicable
    const relevantChallengeId = challengeId || qrCode.challenge_id;
    if (relevantChallengeId) {
      await UserChallengeService.completeChallenge(
        userId, 
        relevantChallengeId
      );
    }

    return scan;
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
