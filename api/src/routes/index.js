import { Router } from 'express';

import reposRouter from './repos.js';
import usersRouter from './users.js';

const router = Router();

router.use('/repos', reposRouter);
router.use('/users', usersRouter);

export default router;
