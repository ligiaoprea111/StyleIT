import express from 'express';
import GeminiController from '../controllers/geminiController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Generate outfit recommendation
router.post('/outfit-recommendation', GeminiController.generateOutfitRecommendation);

// Generate style advice
router.post('/style-advice', GeminiController.generateStyleAdvice);

export default router; 