import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { patchImageSchema } from '@/lib/schemas';
import { appendPromptVersion, promptFieldMap } from '@/lib/prompt-version';
import { AppError, apiErrorResponse } from '@/lib/errors';

const promptFields = Object.keys(promptFieldMap) as Array<keyof typeof promptFieldMap>;

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;
    if (!userId) throw new AppError('未登录', 401);

    const data = patchImageSchema.parse(await req.json());
    const image = await prisma.generatedImage.findFirst({ where: { id: params.id, userId } });
    if (!image) throw new AppError('图片不存在', 404);

    const updated = await prisma.generatedImage.update({ where: { id: image.id }, data });

    for (const field of promptFields) {
      const value = data[field];
      if (typeof value === 'string' && value.trim().length > 0 && value !== (image as any)[field]) {
        await appendPromptVersion({
          generatedImageId: image.id,
          field,
          content: value,
          userInstruction: 'manual_edit'
        });
      }
    }

    return Response.json(updated);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
