// worker.ts
import { Job, Worker } from 'bullmq';

import { redisClient } from '../../config/redis';
import { paymentDisbursed } from '../utils/payment.utils';

export function paymentDispatchQueueWorker(): void {
  const worker = new Worker(
    'paymentDispatchQueue',
    async (job: Job) => {
      console.log('paymentDispatchQueueWorker', job?.data);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await paymentDisbursed(job?.data?.booking);
    },
    {
      connection: redisClient, // Use the configured Redis client directly
      concurrency: 1,
      autorun: true,
    }
  );

  worker.on('completed', async (job: Job) => {
    console.log('Completed job with order id: ' + job.id);
  });

  worker.on('failed', async (job: Job | undefined) => {
    if (job) {
      console.log('failed job with booking id:', job.data?.booking?.bookingId);
    } else {
      console.debug('Job failed, but no job information available.');
    }
  });
}
