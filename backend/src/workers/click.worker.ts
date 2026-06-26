import 'dotenv/config';

import { Worker, Job } from 'bullmq';
import { ClickEvent } from '../types';
import prisma from '../config/db';
import redis from '../config/redis';
import { UAParser } from 'ua-parser-js';

const worker = new Worker<ClickEvent>('click-events', async (job: Job<ClickEvent>) => {

    const { urlId, slug, ipAddress, userAgent, referrer, country } = job.data;

    const parser = new UAParser(userAgent);
    const deviceType = parser.getDevice().type || 'desktop';

    await prisma.click.create({
        data: {
            urlId,
            ipAddress: ipAddress ?? null,
            userAgent: deviceType,
            referrer: referrer ?? null,
            country: country ?? null,
        },
    });

    await redis.del(`analytics:${slug}`);
},
{
    connection: {
        host: process.env.REDIS_HOST!,
        port: parseInt(process.env.REDIS_PORT!),
    },
});

worker.on('completed', (job) => {
    console.log(`Click recorded for /${job.data.slug} (job ${job.id})`);
});

worker.on('failed', (job, err) => {
    console.error(`Job ${job!.id} failed:`, err.message);
});

worker.on('error', (err) => {
    console.error('Worker connection error:', err.message);
});

const shutdown = async () => {
    await worker.close();
    await prisma.$disconnect();
    await redis.quit();
    process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

console.log('Click analytics worker is running...');
