import express from 'express';
import { scheduleOutfit, getScheduledOutfitByDate, getAllScheduledDatesForUser } from '../controllers/scheduledoutfit-controller.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// POST endpoint to schedule an outfit (path relative to /api/scheduled-outfits)
router.post('/', verifyToken, scheduleOutfit);

// GET endpoint to fetch all scheduled dates for a user
router.get('/dates/:userId', getAllScheduledDatesForUser);

// GET endpoint to fetch a scheduled outfit for a specific user and date (path relative to /api/scheduled-outfits)
router.get('/:userId/:date', getScheduledOutfitByDate);



export default router; 