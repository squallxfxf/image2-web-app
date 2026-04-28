import { Queue } from 'bullmq';
import { redis } from '@/lib/redis';

export const IMAGE_QUEUE_NAME = 'image-generate-queue';

export const imageQueue = new Queue(IMAGE_QUEUE_NAME, { connection: redis });
