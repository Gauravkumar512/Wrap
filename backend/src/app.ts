import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { clerkMiddleware } from '@clerk/express';
import router from './routes';
import { errorHandler } from './middleware/error.middleware';
import prisma from './config/db';
import redis from './config/redis';

dotenv.config();

const app = express();

app.use(helmet());
app.use(clerkMiddleware());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '1kb' }));
app.use(express.static('public'));

app.get('/health', async (_req, res) => {
    try {
        await Promise.all([
            prisma.$queryRaw`SELECT 1`,
            redis.ping(),
        ]);
        res.status(200).json({ status: 'ok', db: 'ok', redis: 'ok' });
    } catch (err) {
        res.status(503).json({ status: 'error', message: (err as Error).message });
    }
});

app.use('/', router);

app.use(errorHandler)

export default app;
