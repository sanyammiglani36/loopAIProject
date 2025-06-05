import express from 'express';
import ingestController from '../controllers/ingest-controller'
import statusController from '../controllers/status-controller';

const router = express.Router();

router.post('/ingest', ingestController.createIngestion);
router.get('/status/:ingestionId', statusController.getStatus); 

export default router; 