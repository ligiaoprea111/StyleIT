import express from 'express';
import { getFashionNews } from '../controllers/fashion-news-controller.js';

const router = express.Router();

router.get('/', getFashionNews);

export default router; 