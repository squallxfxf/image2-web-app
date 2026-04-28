import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { optimizeSchema } from '@/lib/schemas';
import { generateTextPrompt } from '@/lib/prompt-generation';
import { AppError, apiErrorResponse } from '@/lib/errors';

const rules: Record<string, string> = {
  image_description: '优化为100-200字中文客观图片描述，不虚构内容。',
  image2_prompt: '优化为可直接用于IMAGE2再次生图的一段中文提示词，保持核心设定。',
  ltx_prompt: '优化为LTX2.3图生视频提示词，20秒，保持主体一致，含无字幕/无文字/无水印/无UI元素。',
  wan_prompt: '优化为WAN2.2图生视频提示词，6秒，镜头简洁，含无字幕/无文字/无水印/无UI元素。'
};

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;
    if (!userId) throw new AppError('未登录', 401);

    const body = optimizeSchema.parse(await req.json());
    const image = await prisma.generatedImage.findFirst({ where: { id: body.generatedImageId, userId } });
    if (!image) throw new AppError('图片不存在', 404);

    const aiResponse = await generateTextPrompt(
      rules[body.targetType],
      `当前内容:\n${body.currentContent}\n\n用户修改要求:\n${body.userInstruction}`
    );

    const currentVersion = await prisma.promptVersion.count({ where: { generatedImageId: image.id, type: body.targetType } });

    await prisma.$transaction(async (tx) => {
      await tx.promptConversation.create({
        data: {
          generatedImageId: image.id,
          targetType: body.targetType,
          userMessage: body.userInstruction,
          aiResponse
        }
      });
      await tx.promptVersion.updateMany({
        where: { generatedImageId: image.id, type: body.targetType },
        data: { isCurrent: false }
      });
      await tx.promptVersion.create({
        data: {
          generatedImageId: image.id,
          type: body.targetType,
          content: aiResponse,
          userInstruction: body.userInstruction,
          versionNumber: currentVersion + 1,
          isCurrent: true
        }
      });
    });

    return Response.json({ content: aiResponse });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
