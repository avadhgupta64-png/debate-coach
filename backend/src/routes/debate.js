import { Router } from 'express';
import * as controller from '../controllers/debateController.js';
import { validateGenerate, validateChallenge, validateEvaluate, validateRefine, validateHint } from '../middleware/validate.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

// Public — no auth required
router.get('/health', controller.healthCheck);

// Protected — require valid Firebase ID token on all AI/debate endpoints
router.post('/debate/generate',  authenticateUser, validateGenerate,  controller.generate);
router.post('/debate/challenge', authenticateUser, validateChallenge, controller.challenge);
router.post('/debate/evaluate',  authenticateUser, validateEvaluate,  controller.evaluate);
router.post('/debate/complete',  authenticateUser,                    controller.complete);
router.post('/debate/refine',    authenticateUser, validateRefine,    controller.refine);
router.post('/debate/hint',      authenticateUser, validateHint,      controller.hint);

export default router;
