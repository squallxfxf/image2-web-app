import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { patchImageSchema } from '@/lib/schemas';
import { AppError, apiErrorResponse } from '@/lib/errors';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;
    if (!userId) throw new AppError('未登录', 401);

    const data = patchImageSchema.parse(await req.json());
    const image = await prisma.generatedImage.findFirst({ where: { id: params.id, userId } });
    if (!image) throw new AppError('图片不存在', 404);

    const updated = await prisma.generatedImage.update({ where: { id: image.id }, data });
    return Response.json(updated);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
