import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { HotelService } from '../services/supabase/booking.service.js';

const router = Router();

// Get all hotels (public)
router.get('/', async (req, res) => {
  try {
    const hotels = await HotelService.getHotels();
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// "Book" hotel (just updates loyalty points)
router.post('/', authenticate, async (req, res) => {
  try {
    const updatedLoyalty = await HotelService.bookHotel(req.user.id);
    res.json({
      message: "Loyalty points added!",
      points: updatedLoyalty.points
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;