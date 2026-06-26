import { Router } from 'express';
import { requireAuth } from '@clerk/express';
import { handleShorten } from '../controllers/shorten.controller';
import { handleRedirect } from '../controllers/redirect.controller';
import { handleAnalytics } from '../controllers/analytics.controller';

const router = Router();

router.post('/shorten', requireAuth(), handleShorten);
router.get('/analytics/:slug', requireAuth(), handleAnalytics);
router.get('/:slug', handleRedirect);

export default router;
