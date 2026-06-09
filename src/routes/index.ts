import { Router } from 'express';
import { handleShorten } from '../controllers/shorten.controller';

const router = Router();

router.post('/shorten', handleShorten);

export default router;