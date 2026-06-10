import { Router } from 'express';
import { handleShorten } from '../controllers/shorten.controller';
import { handleRedirect } from '../controllers/redirect.controller';

const router = Router();

router.post('/shorten', handleShorten);
router.get('/:slug', handleRedirect);

export default router;