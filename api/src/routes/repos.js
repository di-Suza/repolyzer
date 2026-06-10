import { Router } from 'express';

import { getUserRepos } from '../controllers/repos.controller.js';

const router = Router();

// User-scoped repository collection: /api/repos/:username/repos
router.get('/:username/repos', getUserRepos);

export default router;
