import express from 'express';
import { 
  getConfigurations, 
  updateConfiguration, 
  resetConfiguration,
  getUIConfig,
  bulkUpdateConfig
} from '../controllers/configController.js';

const router = express.Router();

router.get('/', getConfigurations);
router.get('/ui', getUIConfig);
router.put('/', updateConfiguration);
router.put('/bulk', bulkUpdateConfig);
router.delete('/reset', resetConfiguration);

export default router;