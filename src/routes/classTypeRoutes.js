import express from 'express';
import { getClassTypes, getClassTypeById } from '../controllers/classTypeController.js';

const router = express.Router();

router.get('/', getClassTypes);
router.get('/:id', getClassTypeById);

export default router;