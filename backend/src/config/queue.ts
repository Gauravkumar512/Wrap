import { Queue } from "bullmq";
import { ClickEvent } from "../types";

export const clickQueue = new Queue<ClickEvent>('click-events', { 
    connection : {
        host: process.env.REDIS_HOST!,
        port: parseInt(process.env.REDIS_PORT!)
    },
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    }
});
