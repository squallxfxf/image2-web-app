import { prisma } from '@/lib/prisma';

export const promptFieldMap = {
  imageDescription: 'image_description',
  image2Prompt: 'image2_prompt',
  ltxPrompt: 'ltx_prompt',
  wanPrompt: 'wan_prompt'
} as const;

export type PromptEditableField = keyof typeof promptFieldMap;

export async function appendPromptVersion(input: {
  generatedImageId: string;
  field: PromptEditableField;
  content: string;
  userInstruction?: string;
}) {
  const type = promptFieldMap[input.field];

  return prisma.$transaction(async (tx: any) => {
    const currentCount = await tx.promptVersion.count({
      where: { generatedImageId: input.generatedImageId, type }
    });

    await tx.promptVersion.updateMany({
      where: { generatedImageId: input.generatedImageId, type },
      data: { isCurrent: false }
    });

    return tx.promptVersion.create({
      data: {
        generatedImageId: input.generatedImageId,
        type,
        content: input.content,
        versionNumber: currentCount + 1,
        isCurrent: true,
        userInstruction: input.userInstruction
      }
    });
  });
}
