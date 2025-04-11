import { Router } from 'express';
import { authenticate, requireCompleteProfile } from '../middleware/auth.middleware.js';
import { ScanService } from '../services/supabase/scans.service.js';

const router = Router();

// Log a scan event
router.post('/', authenticate, requireCompleteProfile, async (req, res, next) => {
  try {
    const scan = await ScanService.logScan(
      req.user.id,
      req.body.qr_code_id,
      req.body.challenge_id
    );
    res.status(201).json({ status: 'success', data: scan });
  } catch (error) {
    next(error);
  }
});

// Get scan history
router.get('/', authenticate, async (req, res, next) => {
  try {
    const scans = await ScanService.getScanHistory(req.user.id);
    res.json({ status: 'success', data: scans });
  } catch (error) {
    next(error);
  }
});

export default router;
