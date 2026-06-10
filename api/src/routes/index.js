import { Router } from 'express';

import reposRouter from './repos.js';
import usersRouter from './users.js';

const router = Router();

// Resource routers stay separate so user profile routes and repository collection routes can evolve independently.
router.use('/repos', reposRouter);
router.use('/users', usersRouter);

export default router;
