import { Router } from 'express';
import * as controller from '../controllers/debateController.js';
import { validateGenerate, validateChallenge, validateEvaluate } from '../middleware/validate.js';

const router = Router();

router.get('/health', controller.healthCheck);
router.post('/debate/generate', validateGenerate, controller.generate);
router.post('/debate/challenge', validateChallenge, controller.challenge);
router.post('/debate/evaluate', validateEvaluate, controller.evaluate);
router.post('/debate/complete', controller.complete);

export default router;
