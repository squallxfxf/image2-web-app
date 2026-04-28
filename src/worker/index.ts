import { Worker } from 'bullmq';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { IMAGE_QUEUE_NAME } from '@/queue/imageQueue';
import { openai } from '@/lib/openai';
import { uploadImageBuffer } from '@/lib/s3';
import { generateBoundPrompts } from '@/lib/prompt-generation';
import { logger } from '@/lib/logger';
import { shouldRefundJob } from '@/lib/refund';

const sizeMap: Record<string, string> = {
  '1:1': '1024x1024',
  '9:16': '1024x1792',
  '16:9': '1792x1024',
  '4:3': '1536x1152',
  '3:4': '1152x1536'
};

new Worker(
  IMAGE_QUEUE_NAME,
  async (job: any) => {
    const { jobId } = job.data as { jobId: string };
    const task = await prisma.generationJob.findUnique({ where: { id: jobId } });
    if (!task) return;

    try {
      await prisma.generationJob.update({ where: { id: task.id }, data: { status: 'processing' } });

      const imageRes = await openai.images.generate({
        model: 'gpt-image-1',
        prompt: task.prompt,
        size: sizeMap[task.aspectRatio] ?? '1024x1024',
        quality: task.quality as 'low' | 'medium' | 'high' | 'auto',
        n: task.count,
        response_format: 'b64_json'
      });

      const data = imageRes.data ?? [];

      for (let i = 0; i < data.length; i += 1) {
        const item = data[i];
        const b64 = item.b64_json;
        if (!b64) continue;

        const buffer = Buffer.from(b64, 'base64');
        const key = `generated/${task.userId}/${task.id}/${i}.png`;
        const imageUrl = await uploadImageBuffer(key, buffer, 'image/png');

        const generated = await generateBoundPrompts({ image2Prompt: task.prompt });

        const created = await prisma.generatedImage.create({
          data: {
            userId: task.userId,
            jobId: task.id,
            imageUrl,
            thumbnailUrl: imageUrl,
            image2Prompt: task.prompt,
            negativePrompt: task.negativePrompt,
            imageDescription: generated.imageDescription,
            ltxPrompt: generated.ltxPrompt,
            wanPrompt: generated.wanPrompt,
            aspectRatio: task.aspectRatio,
            quality: task.quality,
            style: task.style,
            status: 'completed'
          }
        });

        await prisma.promptVersion.createMany({
          data: [
            { generatedImageId: created.id, type: 'image_description', content: generated.imageDescription, versionNumber: 1, isCurrent: true },
            { generatedImageId: created.id, type: 'image2_prompt', content: task.prompt, versionNumber: 1, isCurrent: true },
            { generatedImageId: created.id, type: 'ltx_prompt', content: generated.ltxPrompt, versionNumber: 1, isCurrent: true },
            { generatedImageId: created.id, type: 'wan_prompt', content: generated.wanPrompt, versionNumber: 1, isCurrent: true }
          ]
        });
      }

      await prisma.generationJob.update({ where: { id: task.id }, data: { status: 'completed' } });
    } catch (error) {
      logger.error('worker failed', error);
      await prisma.$transaction(async (tx: any) => {
        const currentJob = await tx.generationJob.findUnique({ where: { id: task.id }, select: { status: true } });
        const existingRefund = await tx.creditTransaction.findFirst({
          where: { relatedJobId: task.id, type: 'refund' },
          select: { id: true }
        });

        const canRefund = shouldRefundJob({
          status: currentJob?.status ?? 'failed',
          hasRefundTransaction: Boolean(existingRefund)
        });

        if (!canRefund) {
          await tx.generationJob.update({ where: { id: task.id }, data: { status: 'failed', errorMessage: (error as Error).message } });
          return;
        }

        await tx.generationJob.update({ where: { id: task.id }, data: { status: 'refunded', errorMessage: (error as Error).message } });
        await tx.user.update({ where: { id: task.userId }, data: { credits: { increment: task.creditCost } } });
        await tx.creditTransaction.create({
          data: {
            userId: task.userId,
            type: 'refund',
            amount: task.creditCost,
            reason: '生成失败自动退款',
            relatedJobId: task.id
          }
        });
      });
    }
  },
  { connection: redis }
);

logger.info('Image worker started');
