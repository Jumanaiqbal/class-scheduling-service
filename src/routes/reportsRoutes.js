import express from 'express';
import { getClassesReport, getReportFilters } from '../controllers/reportsController.js';

const router = express.Router();

// GET /api/reports/classes - Get classes report with filters
router.get('/classes', getClassesReport);

// GET /api/reports/filters - Get available filters for UI
router.get('/filters', getReportFilters);

export default router;