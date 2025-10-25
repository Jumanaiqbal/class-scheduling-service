import express from 'express';
import { getInstructors, getInstructorById } from '../controllers/instructorController.js';

const router = express.Router();

router.get('/', getInstructors);
router.get('/:id', getInstructorById);

export default router;