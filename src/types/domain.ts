export type PromptTargetType = 'image_description' | 'image2_prompt' | 'ltx_prompt' | 'wan_prompt';

export interface GeneratedImageCardModel {
  id: string;
  imageUrl: string;
  imageDescription: string | null;
  image2Prompt: string;
  ltxPrompt: string | null;
  wanPrompt: string | null;
  isFavorite: boolean;
  createdAt?: string;
}

export interface ImageListResponse {
  items: GeneratedImageCardModel[];
  total: number;
  page: number;
  pageSize: number;
}
