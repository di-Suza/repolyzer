import { Router } from 'express';

import { getRepo, getUserRepos } from '../controllers/repos.controller.js';

const router = Router();

router.get('/:username/repos', getUserRepos);
router.get('/:owner/:repo', getRepo);

export default router;
