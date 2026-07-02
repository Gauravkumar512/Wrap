import { Queue } from "bullmq";
import { ClickEvent } from "../types";
import { bullConnection } from "./bullConnection";

export const clickQueue = new Queue<ClickEvent>('click-events', {
    connection: bullConnection,
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
