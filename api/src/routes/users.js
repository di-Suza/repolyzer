import { Router } from 'express';

import { getUser } from '../controllers/users.controller.js';

const router = Router();

// Public profile lookup: /api/users/:username
router.get('/:username', getUser);

export default router;
