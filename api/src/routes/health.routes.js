import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  // Include a timestamp so uptime checks can distinguish fresh responses from cached/proxied ones.
  res.status(200).json({
    status: 'ok',
    service: 'repolyzer-api',
    timestamp: new Date().toISOString(),
  });
});

export default router;
