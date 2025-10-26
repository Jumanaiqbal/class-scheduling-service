import express from 'express';
import {
  getDashboardStats,
  getDashboardSummary,
} from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/stats', getDashboardStats);

router.get('/summary', getDashboardSummary);

export default router;
