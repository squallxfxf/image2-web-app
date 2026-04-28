import { z } from 'zod';

export const generateImageSchema = z.object({
  prompt: z.string().min(4),
  negativePrompt: z.string().optional(),
  aspectRatio: z.enum(['1:1', '9:16', '16:9', '4:3', '3:4']),
  quality: z.enum(['low', 'medium', 'high', 'auto']),
  style: z.string().optional(),
  count: z.number().int().min(1).max(4),
  outputFormat: z.enum(['png', 'jpeg', 'webp']).default('png')
});

export const optimizeSchema = z.object({
  generatedImageId: z.string().min(1),
  targetType: z.enum(['image_description', 'image2_prompt', 'ltx_prompt', 'wan_prompt']),
  userInstruction: z.string().min(1),
  currentContent: z.string().min(1)
});

export const generatePromptsSchema = z.object({
  generatedImageId: z.string().min(1)
});

export const patchImageSchema = z.object({
  imageDescription: z.string().optional(),
  image2Prompt: z.string().optional(),
  ltxPrompt: z.string().optional(),
  wanPrompt: z.string().optional(),
  isFavorite: z.boolean().optional()
});
