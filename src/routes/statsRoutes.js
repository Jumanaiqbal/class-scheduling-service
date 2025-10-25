import express from 'express';
import { getDailyClassStats, getClassTypeStats } from '../controllers/statsController.js';

const router = express.Router();

router.get('/daily-classes', getDailyClassStats);
router.get('/class-types', getClassTypeStats);

export default router;