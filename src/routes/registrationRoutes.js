import express from 'express';
import multer from 'multer';
import { uploadCSV, getRegistrations } from '../controllers/registrationController.js';

const router = express.Router();
const upload = multer();

router.post('/upload', upload.single('csvFile'), uploadCSV);
router.get('/', getRegistrations);

export default router;