import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AppError, apiErrorResponse } from '@/lib/errors';

export async function GET(req: Request) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;
    if (!userId) throw new AppError('未登录', 401);

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page') ?? '1');
    const pageSize = Number(searchParams.get('pageSize') ?? '12');
    const q = searchParams.get('q') ?? '';
    const favorite = searchParams.get('favorite');

    const where = {
      userId,
      ...(favorite ? { isFavorite: favorite === 'true' } : {}),
      ...(q
        ? {
            OR: [
              { image2Prompt: { contains: q, mode: 'insensitive' as const } },
              { imageDescription: { contains: q, mode: 'insensitive' as const } },
              { ltxPrompt: { contains: q, mode: 'insensitive' as const } },
              { wanPrompt: { contains: q, mode: 'insensitive' as const } }
            ]
          }
        : {})
    };

    const [items, total] = await Promise.all([
      prisma.generatedImage.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * pageSize, take: pageSize }),
      prisma.generatedImage.count({ where })
    ]);

    return Response.json({ items, total, page, pageSize });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
