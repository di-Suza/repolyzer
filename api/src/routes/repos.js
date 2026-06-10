import { Router } from 'express';

import { getUserRepos } from '../controllers/repos.controller.js';

const router = Router();

router.get('/:username/repos', getUserRepos);

export default router;
