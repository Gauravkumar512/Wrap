import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import rateLimit from 'express-rate-limit';
import { handleShorten } from '../controllers/shorten.controller';
import { handleRedirect } from '../controllers/redirect.controller';
import { handleAnalytics } from '../controllers/analytics.controller';
import { handleGetLinks, handleDeleteLink } from '../controllers/links.controller';

const shortenLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests. You can create at most 10 links per minute.' },
});

const redirectLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many redirect requests. Please slow down.' },
});

const router = Router();
router.get('/links', authenticate(), handleGetLinks);
router.post('/shorten', authenticate(), shortenLimiter, handleShorten);
router.get('/analytics/:slug', authenticate(), handleAnalytics);
router.delete('/urls/:slug', authenticate(), handleDeleteLink);
router.get('/:slug', redirectLimiter, handleRedirect);
export default router;
