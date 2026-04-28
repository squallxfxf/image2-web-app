import { prisma } from '@/lib/prisma';
import { PROMPT_FIELD_MAP } from './constants';

export const promptFieldMap = PROMPT_FIELD_MAP;

export type PromptEditableField = keyof typeof promptFieldMap;

type VersionInput = {
  generatedImageId: string;
  field: PromptEditableField;
  content: string;
  userInstruction?: string;
};

export async function appendPromptVersionWithClient(tx: any, input: VersionInput) {
  const type = promptFieldMap[input.field];

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
}

export async function appendPromptVersion(input: VersionInput) {
  return prisma.$transaction((tx: any) => appendPromptVersionWithClient(tx, input));
}
