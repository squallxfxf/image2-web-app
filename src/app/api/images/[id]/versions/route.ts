import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AppError, apiErrorResponse } from '@/lib/errors';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;
    if (!userId) throw new AppError('未登录', 401);

    const targetType = new URL(req.url).searchParams.get('type');
    if (!targetType) throw new AppError('缺少 type 参数');

    const image = await prisma.generatedImage.findFirst({ where: { id: params.id, userId }, select: { id: true } });
    if (!image) throw new AppError('图片不存在', 404);

    const versions = await prisma.promptVersion.findMany({
      where: { generatedImageId: image.id, type: targetType as any },
      orderBy: { versionNumber: 'desc' }
    });

    return Response.json({ items: versions });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
