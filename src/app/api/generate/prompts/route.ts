import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generatePromptsSchema } from '@/lib/schemas';
import { generateBoundPrompts } from '@/lib/prompt-generation';
import { AppError, apiErrorResponse } from '@/lib/errors';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;
    if (!userId) throw new AppError('未登录', 401);

    const { generatedImageId } = generatePromptsSchema.parse(await req.json());
    const image = await prisma.generatedImage.findFirst({ where: { id: generatedImageId, userId } });
    if (!image) throw new AppError('图片不存在', 404);

    const generated = await generateBoundPrompts({ image2Prompt: image.image2Prompt, imageDescriptionSeed: image.imageDescription ?? undefined });

    await prisma.generatedImage.update({
      where: { id: image.id },
      data: { imageDescription: generated.imageDescription, ltxPrompt: generated.ltxPrompt, wanPrompt: generated.wanPrompt }
    });

    return Response.json(generated);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
