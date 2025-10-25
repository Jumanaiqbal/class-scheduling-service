import express from 'express';
import { getStudents, getStudentById, autoCreateStudents } from '../controllers/studentController.js';

const router = express.Router();

router.get('/', getStudents);
router.get('/:id', getStudentById);
router.post('/auto-create', autoCreateStudents);

export default router;