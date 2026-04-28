import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AppError, apiErrorResponse } from '@/lib/errors';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id as string | undefined;
    if (!userId) throw new AppError('未登录', 401);

    const job = await prisma.generationJob.findFirst({
      where: { id: params.id, userId },
      include: { images: true }
    });
    if (!job) throw new AppError('任务不存在', 404);

    return Response.json(job);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
