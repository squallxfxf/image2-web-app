import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateImageSchema } from '@/lib/schemas';
import { calcCreditCost } from '@/lib/credits';
import { moderatePrompt } from '@/lib/moderation';
import { AppError, apiErrorResponse } from '@/lib/errors';
import { imageQueue } from '@/queue/imageQueue';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id as string | undefined;
    if (!userId) throw new AppError('未登录', 401);

    const body = generateImageSchema.parse(await req.json());
    const mod = moderatePrompt(`${body.prompt} ${body.negativePrompt ?? ''}`);
    if (mod.blocked) {
      await prisma.promptBlockLog.create({ data: { userId, prompt: body.prompt, reason: mod.reason! } });
      throw new AppError(mod.reason!, 400, 'PROMPT_BLOCKED');
    }

    const creditCost = calcCreditCost(body.count, body.quality, body.aspectRatio);

    const job = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user || user.credits < creditCost) throw new AppError('积分不足', 400, 'INSUFFICIENT_CREDITS');

      await tx.user.update({ where: { id: userId }, data: { credits: { decrement: creditCost } } });
      const job = await tx.generationJob.create({
        data: {
          userId,
          prompt: body.prompt,
          negativePrompt: body.negativePrompt,
          aspectRatio: body.aspectRatio,
          quality: body.quality,
          style: body.style,
          count: body.count,
          outputFormat: body.outputFormat,
          creditCost,
          status: 'queued'
        }
      });
      await tx.creditTransaction.create({
        data: { userId, type: 'consume', amount: -creditCost, reason: '提交图片生成任务', relatedJobId: job.id }
      });
      return job;
    });

    await imageQueue.add('generate-image', { jobId: job.id }, { attempts: 2, removeOnComplete: true });
    return Response.json({ jobId: job.id, status: job.status });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
