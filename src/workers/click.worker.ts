import { Worker, Job } from 'bullmq';
import { ClickEvent } from '../types';
import prisma from '../config/db';
import dotenv from 'dotenv';    
import { UAParser } from 'ua-parser-js';

dotenv.config();

const worker = new Worker<ClickEvent>('click-events', async(job: Job<ClickEvent>) => {

    const { urlId, ipAddress, userAgent, referrer, country } = job.data

    const parser = new UAParser(userAgent);

    const deviceType = parser.getDevice().type || 'desktop';

    await prisma.click.create({
        data: {
            urlId,
            ipAddress: ipAddress ?? null,
            userAgent: deviceType ,
            referrer: referrer ?? null,
            country: country ?? null,
        }
    })
    console.log(`Click recorded for urlId: ${urlId}`) // remove in production
},
{
    connection: {
        host: process.env.REDIS_HOST!,
        port: parseInt(process.env.REDIS_PORT!),
    }
})

worker.on('completed', (job) => {
    console.log(`Job completed with id ${job.id}`);
});

worker.on('failed', (job, err) => {
    console.error(`Job failed with id ${job!.id}:`, err.message);
});

console.log('Click analytics worker is running...');