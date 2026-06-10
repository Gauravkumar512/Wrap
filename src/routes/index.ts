import { Router } from 'express';
import { handleShorten } from '../controllers/shorten.controller';
import { handleRedirect } from '../controllers/redirect.controller';
import  { handleAnalytics } from '../controllers/analytics.controller';

const router = Router();

router.post('/shorten', handleShorten);
router.get('/analytics/:slug', handleAnalytics);
router.get('/:slug', handleRedirect);


export default router;