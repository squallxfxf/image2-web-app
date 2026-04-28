import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AppError, apiErrorResponse } from '@/lib/errors';

export async function GET() {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;
    if (!userId) throw new AppError('未登录', 401);

    const me = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (me?.role !== 'admin') throw new AppError('无权限', 403);

    const [jobs, images, tx] = await Promise.all([
      prisma.generationJob.groupBy({ by: ['status'], _count: true, _sum: { creditCost: true } }),
      prisma.generatedImage.count(),
      prisma.creditTransaction.aggregate({ _sum: { amount: true } })
    ]);

    return Response.json({ jobStats: jobs, totalImages: images, creditNet: tx._sum.amount ?? 0 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
