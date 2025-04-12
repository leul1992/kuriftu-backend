import { BookingService } from '../services/supabase/booking.service.js';
import Joi from 'joi';

// Validate booking creation data
export const validateBookingData = (req, res, next) => {
  const schema = Joi.object({
    hotelId: Joi.string().uuid().required(),
    roomId: Joi.string().uuid().required(),
    checkIn: Joi.date().iso().greater('now').required(),
    checkOut: Joi.date().iso().greater(Joi.ref('checkIn')).required(),
    guestCount: Joi.number().integer().min(1).max(10).required(),
    specialRequests: Joi.string().max(500).optional(),
    paymentMethod: Joi.string().valid('credit_card', 'paypal', 'bank_transfer').required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 'error',
      message: error.details[0].message.replace(/"/g, '')
    });
  }

  next();
};

// Check room availability before booking
export const checkRoomAvailability = async (req, res, next) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;
    
    const isAvailable = await BookingService.checkRoomAvailability(
      roomId, 
      new Date(checkIn), 
      new Date(checkOut)
    );

    if (!isAvailable) {
      return res.status(409).json({
        status: 'error',
        message: 'Room not available for selected dates'
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Validate hotel ID parameter
export const validateHotelId = (req, res, next) => {
  const { hotelId } = req.params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(hotelId)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid hotel ID format'
    });
  }
  next();
};
