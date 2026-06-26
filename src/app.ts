import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express';
import router from './routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();

app.use(clerkMiddleware());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '1kb' }));
app.use(express.static('public'));


app.get('/health', (_req, res) => {
    res.status(200).json({ message: 'Server is healthy' })
})

app.use('/', router);

app.use(errorHandler)

export default app;
