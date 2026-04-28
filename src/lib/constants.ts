export const PROMPT_TARGET_TYPES = [
  'image_description',
  'image2_prompt',
  'ltx_prompt',
  'wan_prompt'
] as const;

export const PROMPT_FIELD_MAP = {
  imageDescription: 'image_description',
  image2Prompt: 'image2_prompt',
  ltxPrompt: 'ltx_prompt',
  wanPrompt: 'wan_prompt'
} as const;
